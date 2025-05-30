import { screen, waitFor, fireEvent, act, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Tab1 from '../../src/pages/Tab1';
import { customRender, setupMocks } from '../utils/testUtils';
import { mockGames } from '../__mocks__/mockData';
import * as Connections from '../../src/utils/Connections';

describe('Tab1 Component - Delete Game', () => {
  let fetchGamesMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    ({ fetchGamesMock } = setupMocks());
  });

  // TEST 2: Delete a game
  it('should delete a game and remove it from the list', async () => {
    //1. Mock DeleteGame API
    const deleteGameMock = vi.spyOn(Connections, 'DeleteGame').mockResolvedValue({ message: 'Game deleted successfully' });

    //2. Mock FetchGames to return initial list
    fetchGamesMock.mockResolvedValueOnce(mockGames);

    //3. Render the Tab1 component
    customRender(<Tab1 />);

    //4. Wait for initial game card to appear
    await waitFor(() => {
      expect(screen.getByTestId(`game-card-${mockGames[0].id}`)).toBeInTheDocument();
    });

    //5. Find game card and click delete button
    const gameCard = screen.getByTestId(`game-card-${mockGames[0].id}`);
    const deleteButton = within(gameCard).getByTestId('delete-option-button');
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    //6. Verify confirmation modal is shown
    await waitFor(() => {
      expect(screen.getByText('Are you sure you want to delete this game?')).toBeInTheDocument();
    });

    //7. Mock FetchGames to return updated list
    fetchGamesMock.mockReset();
    fetchGamesMock.mockResolvedValueOnce([mockGames[1]]);

    //8. Click confirm button to delete game
    const confirmButton = screen.getByTestId('delete-confirm-button');
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    //9. Verify toast is shown
    await waitFor(() => {
      const toast = screen.getByTestId('toast-message');
      expect(toast).toHaveAttribute('message', 'Game successfully deleted!');
      expect(toast).not.toHaveClass('overlay-hidden');
    }, { timeout: 10000 });

    //10. Verify DeleteGame was called
    expect(deleteGameMock).toHaveBeenCalledWith(mockGames[0].id.toString());

    //11. Verify game list updated in DOM
    await waitFor(() => {
      expect(screen.queryByTestId(`game-card-${mockGames[0].id}`)).not.toBeInTheDocument();
      expect(screen.getByTestId(`game-card-${mockGames[1].id}`)).toBeInTheDocument();
    }, { timeout: 10000 });
  });
});