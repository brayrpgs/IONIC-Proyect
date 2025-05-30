import { Games } from '../../src/utils/Connections';

// A list of "existing" games for mocking purposes
export const mockGames: Games[] = [
  {
    id: 1,
    title: 'The Legend of Zelda: Breath of the Wild',
    imageUrl: '/images/zelda.jpg',
    platform: 'Nintendo Switch',
    hoursPlayed: 200,
    isCompleted: true,
    genre: 'Action-Adventure',
  },
  {
    id: 2,
    title: 'Cyberpunk 2077',
    imageUrl: '/images/cyberpunk.jpg',
    platform: 'PC',
    hoursPlayed: 80,
    isCompleted: false,
    genre: 'RPG',
  },
];

// A mock for new game
export const newMockGame: Games = {
  id: 3,
  title: 'Hollow Knight',
  imageUrl: '/images/hollow_knight.jpg',
  platform: 'Nintendo Switch',
  hoursPlayed: 50,
  isCompleted: true,
  genre: 'Metroidvania',
};