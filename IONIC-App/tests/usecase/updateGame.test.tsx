import { screen, waitFor, fireEvent, act, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Tab1 from '../../src/pages/Tab1';
import { customRender, setupMocks } from '../utils/testUtils';
import { mockGames } from '../__mocks__/mockData';
import * as Connections from '../../src/utils/Connections';

describe('Tab1 Component - Update Game', () => {
  let fetchGamesMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    ({ fetchGamesMock } = setupMocks());
  });

  // TEST 4: Update an existing game
  it('should update an existing game and refresh the list', async () => {
    //1. Render the Tab1 component
    customRender(<Tab1 />);

    //2. Wait for game card to appear
    await waitFor(() => {
      expect(screen.getByTestId(`game-card-1`)).toBeInTheDocument();
    }, { timeout: 2000 });

    //3. Click edit button to open modal
    const gameCard = screen.getByTestId(`game-card-1`);
    const editButton = within(gameCard).getByTestId('edit-option-button');
    await act(async () => {
      fireEvent.click(editButton);
    });

    //4. Verify modal is open
    await waitFor(() => {
      expect(screen.getByTestId('update-modal')).toBeInTheDocument();
    }, { timeout: 2000 });

    //5. Set up updated games list
    const updatedHours = '150';
    const updatedMockGames = [{ ...mockGames[0], hoursPlayed: Number(updatedHours) }, mockGames[1]];
    fetchGamesMock.mockResolvedValueOnce(updatedMockGames);
    vi.spyOn(Connections, 'UpdateGame').mockImplementationOnce(async (game) => {
      return updatedMockGames[0];
    });

    //6. Update form inputs and save
    await waitFor(async () => {
      const titleInput = screen.getByTestId('update-title-input').querySelector('input') as HTMLInputElement;
      const platformInput = screen.getByTestId('update-platform-input').querySelector('input') as HTMLInputElement;
      const hoursPlayedInput = screen.getByTestId('update-hours-played-input').querySelector('input') as HTMLInputElement;
      const isCompletedCheckbox = screen.getByTestId('update-is-completed-checkbox') as HTMLIonCheckboxElement;
      const genreInput = screen.getByTestId('update-genre-input').querySelector('input') as HTMLInputElement;

      //7. Clear and set inputs
      await act(async () => {
        fireEvent.change(titleInput, { target: { value: '' } });
        fireEvent.change(titleInput, { target: { value: mockGames[0].title } });
        fireEvent(titleInput, new CustomEvent('ionChange', {
          detail: { value: mockGames[0].title },
          bubbles: true,
          composed: true
        }));
        fireEvent.change(platformInput, { target: { value: '' } });
        fireEvent.change(platformInput, { target: { value: mockGames[0].platform } });
        fireEvent(platformInput, new CustomEvent('ionChange', {
          detail: { value: mockGames[0].platform },
          bubbles: true,
          composed: true
        }));
        fireEvent.change(hoursPlayedInput, { target: { value: '' } });
        fireEvent.change(hoursPlayedInput, { target: { value: updatedHours } });
        fireEvent(hoursPlayedInput, new CustomEvent('ionChange', {
          detail: { value: updatedHours },
          bubbles: true,
          composed: true
        }));
        fireEvent(isCompletedCheckbox, new CustomEvent('ionChange', {
          detail: { checked: mockGames[0].isCompleted },
          bubbles: true,
          composed: true
        }));
        fireEvent.change(genreInput, { target: { value: '' } });
        fireEvent.change(genreInput, { target: { value: mockGames[0].genre } });
        fireEvent(genreInput, new CustomEvent('ionChange', {
          detail: { value: mockGames[0].genre },
          bubbles: true,
          composed: true
        }));

        //8. Click save button
        const saveButton = screen.getByTestId('update-confirm-button');
        fireEvent.click(saveButton);
      });
    }, { timeout: 2000 });

    //9. Verify toast is shown
    await waitFor(() => {
      const toast = screen.getByTestId('toast-message');
      expect(toast).toHaveAttribute('message', 'Game successfully updated!');
      expect(toast).not.toHaveClass('overlay-hidden');
    }, { timeout: 10000 });

    //10. Verify UpdateGame was called with correct data
    expect(Connections.UpdateGame).toHaveBeenCalledWith(
      expect.objectContaining({
        id: mockGames[0].id,
        title: mockGames[0].title,
        platform: mockGames[0].platform,
        hoursPlayed: mockGames[0].hoursPlayed.toString(),
        isCompleted: String(mockGames[0].isCompleted),
        genre: mockGames[0].genre,
        image: null
      })
    );

    //11. Verify updated hours in game card
    await waitFor(() => {
      expect(within(screen.getByTestId(`game-card-${mockGames[0].id}`)).getByText(`${updatedHours} hrs`)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});