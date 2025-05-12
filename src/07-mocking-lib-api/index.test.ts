import axios from 'axios';
import { throttledGetDataFromApi } from './index';

// Mockujemy moduł axios
jest.mock('axios');

// Mockujemy moduł lodash
jest.mock('lodash', () => ({
  throttle: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
}));

describe('throttledGetDataFromApi', () => {
  const mockData = { data: 'test data' };
  let axiosInstance: { get: jest.Mock };

  beforeEach(() => {
    // Resetujemy mocki przed każdym testem
    jest.clearAllMocks();

    // Mockujemy axios.create i jego instancję
    axiosInstance = {
      get: jest.fn().mockResolvedValue({ data: mockData }),
    };
    (axios.create as jest.Mock).mockReturnValue(axiosInstance);
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi('/test');

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const relativePath = '/test';
    await throttledGetDataFromApi(relativePath);

    expect(axiosInstance.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const result = await throttledGetDataFromApi('/test');

    expect(result).toBe(mockData);
  });
});
