import { screen, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Tab1 from '../../src/pages/Tab1';
import { customRender, setupMocks } from '../utils/testUtils';
import { mockGames } from '../__mocks__/mockData';
import * as Connections from '../../src/utils/Connections';

describe('Tab1 Component - Read Games', () => {
  let fetchGamesMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    ({ fetchGamesMock } = setupMocks());
  });

  // TEST 3: Read games
  it('should display games correctly on initial load', async () => {
    //1. Render the Tab1 component
    customRender(<Tab1 />);

    //2. Verify FetchGames is called once
    await waitFor(() => {
      expect(Connections.FetchGames).toHaveBeenCalledTimes(1);
    });

    //3. Find game cards by data-testid
    const game1Card = await screen.findByTestId('game-card-1');
    const game2Card = await screen.findByTestId('game-card-2');

    //4. Verify game titles in cards
    expect(within(game1Card).getByText((content, element) => {
      return content.includes(mockGames[0].title) && element?.tagName.toLowerCase() === 'ion-card-title';
    })).toBeInTheDocument();
    expect(within(game2Card).getByText((content, element) => {
      return content.includes(mockGames[1].title) && element?.tagName.toLowerCase() === 'ion-card-title';
    })).toBeInTheDocument();

    //5. Verify genre text in cards
    expect(within(game1Card).getByText(`🎭 Genre: ${mockGames[0].genre}`)).toBeInTheDocument();
    expect(within(game2Card).getByText(`🎭 Genre: ${mockGames[1].genre}`)).toBeInTheDocument();

    //6. Verify image URL for the first game
    const game1Image = within(game1Card).getByAltText(mockGames[0].title) as HTMLImageElement;
    expect(game1Image.src).toBe(`${Connections.URL_BASE}${mockGames[0].imageUrl}`);
  });
});