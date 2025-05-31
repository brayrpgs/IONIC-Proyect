import { screen, waitFor, fireEvent, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Tab1 from '../../src/pages/Tab1';
import { customRender, setupMocks } from '../utils/testUtils';
import { mockGames, newMockGame } from '../__mocks__/mockData';
import * as Connections from '../../src/utils/Connections';

describe('Tab1 Component - Create Game', () => {
  let fetchGamesMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    ({ fetchGamesMock } = setupMocks());
  });

  // TEST 1: Create new game
  it('should create a new game and update the list', async () => {
    //1. Set up user event
    const user = userEvent.setup();
    //2. Render the Tab1 component
    customRender(<Tab1 />);

    //3. Wait for initial games to load
    await waitFor(() => {
      expect(screen.getByTestId('game-card-1')).toBeInTheDocument();
    });

    //4. Click create button to open modal
    const createButton = screen.getByTestId('create-option-button');
    await act(async () => {
      fireEvent.click(createButton);
    });

    //5. Verify modal is open
    await waitFor(() => {
      expect(screen.getByTestId('create-modal')).toBeInTheDocument();
    }, { timeout: 1000 });

    //6. Get form inputs
    const titleInput = screen.getByTestId('create-title-input');
    const platformInput = screen.getByTestId('create-platform-input');
    const genreInput = screen.getByTestId('create-genre-input');
    const hoursPlayedInput = screen.getByTestId('create-hours-played-input');
    const isCompletedCheckbox = screen.getByTestId('create-is-completed-checkbox');
    const imageInput = screen.getByTestId('create-image-input') as HTMLInputElement;

    //7. Update form inputs
    await act(async () => {
      fireEvent(titleInput, new CustomEvent('ionChange', {
        detail: { value: newMockGame.title },
        bubbles: true,
        composed: true
      }));
      fireEvent(platformInput, new CustomEvent('ionChange', {
        detail: { value: newMockGame.platform },
        bubbles: true,
        composed: true
      }));
      fireEvent(genreInput, new CustomEvent('ionChange', {
        detail: { value: newMockGame.genre },
        bubbles: true,
        composed: true
      }));
      fireEvent(hoursPlayedInput, new CustomEvent('ionChange', {
        detail: { value: newMockGame.hoursPlayed.toString() },
        bubbles: true,
        composed: true
      }));
      fireEvent(isCompletedCheckbox, new CustomEvent('ionChange', {
        detail: { checked: true },
        bubbles: true,
        composed: true,
        cancelable: true
      }));

      const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
      await user.upload(imageInput, file);

      //8. Click save button
      const saveButton = await screen.findByTestId('create-confirm-button') as HTMLButtonElement;
      await fireEvent.click(saveButton);
    });

    //9. Mock updated games list
    fetchGamesMock.mockResolvedValueOnce([...mockGames, newMockGame]);

    //10. Verify SendGame was called
    await waitFor(
      () => {
        expect(Connections.SendGame).toHaveBeenCalledWith(
          expect.objectContaining({
            title: newMockGame.title,
            platform: newMockGame.platform,
            genre: newMockGame.genre,
            hoursPlayed: newMockGame.hoursPlayed.toString(),
            isCompleted: 'true',
            image: expect.any(File),
          })
        );
      },
      { timeout: 10000 }
    );

    //11. Verify toast is shown
    await waitFor(
      () => {
        const toast = screen.getByTestId('toast-game-created');
        expect(toast).not.toHaveClass('overlay-hidden');
        expect(toast).toHaveAttribute('message', 'Game successfully created!');
      },
      { timeout: 10000 }
    );

    //12. Verify new game card is in the document
    await waitFor(
      () => {
        expect(screen.getByTestId(`game-card-${newMockGame.id}`)).toBeInTheDocument();
      },
      { timeout: 10000 }
    );
  });
});