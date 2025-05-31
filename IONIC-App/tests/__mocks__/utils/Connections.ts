import { vi } from 'vitest';
import { Games, GameToSend } from '../../../src/utils/Connections';
import { mockGames } from '../mockData';

//1. Constants
export const URL_BASE = "http://localhost:5041";
export const URL_GAMES = "http://localhost:5041/api/games";

//2. Mock FetchGames function
export const FetchGames = vi.fn((): Promise<Games[]> => Promise.resolve(mockGames));

//3. Mock SendGame function
export const SendGame = vi.fn((game: GameToSend): Promise<Games> => Promise.resolve({
  ...game,
  id: 99,
  hoursPlayed: Number(game.hoursPlayed),
  isCompleted: game.isCompleted === 'true',
  imageUrl: `${URL_BASE}/images/default_new_game.jpg`,
}));

//4. Mock DeleteGame function
export const DeleteGame = vi.fn((id: string): Promise<{ message: string }> => Promise.resolve({ message: `Game ${id} deleted successfully` }));

//5. Mock UpdateGame function
export const UpdateGame = vi.fn((game: GameToSend): Promise<Games> => Promise.resolve({
  ...game,
  id: Number(game.id),
  hoursPlayed: Number(game.hoursPlayed),
  isCompleted: game.isCompleted === 'true',
  imageUrl: game.image instanceof File ? `${URL_BASE}/images/${game.image.name}` : (game as any).imageUrl || `${URL_BASE}/images/default_updated_game.jpg`,
}));