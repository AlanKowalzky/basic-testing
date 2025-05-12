// Uncomment the code below and write your tests
import {
  readFileAsynchronously,
  doStuffByTimeout,
  doStuffByInterval,
} from './index';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Mockujemy moduły Node.js
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  ...jest.requireActual('fs/promises'),
  readFile: jest.fn(),
}));

jest.mock('path', () => ({
  ...jest.requireActual('path'),
  join: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const mockCallback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(mockCallback, timeout);

    expect(jest.getTimerCount()).toBe(1);
    expect(mockCallback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeout);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test('should call callback only after timeout', () => {
    const mockCallback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(mockCallback, timeout);

    expect(mockCallback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeout - 1);
    expect(mockCallback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const mockCallback = jest.fn();
    const interval = 500;

    doStuffByInterval(mockCallback, interval);

    expect(jest.getTimerCount()).toBe(1);
    expect(mockCallback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const mockCallback = jest.fn();
    const interval = 500;

    doStuffByInterval(mockCallback, interval);

    expect(mockCallback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(interval);
    expect(mockCallback).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(interval * 3);
    expect(mockCallback).toHaveBeenCalledTimes(5);
  });
});

describe('readFileAsynchronously', () => {
  const mockFilePath = 'testFile.txt';
  const mockFullPath = `/mocked/path/to/${mockFilePath}`;

  beforeEach(() => {
    (existsSync as jest.Mock).mockReset();
    (readFile as jest.Mock).mockReset();
    (join as jest.Mock).mockReset().mockReturnValue(mockFullPath);
  });

  test('should call join with pathToFile', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);
    await readFileAsynchronously(mockFilePath);
    expect(join).toHaveBeenCalledWith(expect.any(String), mockFilePath);
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);
    const result = await readFileAsynchronously(mockFilePath);
    expect(result).toBeNull();
    expect(readFile).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    const mockContent = 'Hello from mock file!';
    const mockBuffer = Buffer.from(mockContent);

    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(mockBuffer);

    const result = await readFileAsynchronously(mockFilePath);

    expect(existsSync).toHaveBeenCalledWith(mockFullPath);
    expect(readFile).toHaveBeenCalledWith(mockFullPath);
    expect(result).toBe(mockContent);
  });
});
