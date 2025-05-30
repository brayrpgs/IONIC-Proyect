import { render } from '@testing-library/react';
import { IonApp } from '@ionic/react';
import * as Connections from '../../src/utils/Connections';
import { vi } from 'vitest';
import { mockGames, newMockGame } from '../__mocks__/mockData';

//1. Import Ionic CSS for tests
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

//2. Define custom render with IonApp wrapper
export const customRender = (ui: React.ReactElement) => {
  return render(ui, { wrapper: IonApp });
};

//3. Set up mocks before each test
export const setupMocks = () => {
  vi.clearAllMocks();
  const fetchGamesMock = vi.spyOn(Connections, 'FetchGames').mockResolvedValue(mockGames);
  vi.spyOn(Connections, 'SendGame').mockResolvedValue(newMockGame);
  vi.spyOn(Connections, 'DeleteGame').mockResolvedValue({ message: 'Game deleted successfully' });
  vi.spyOn(Connections, 'UpdateGame').mockResolvedValue(mockGames[0]);
  return { fetchGamesMock };
};