// Uncomment the code below and write your tests
import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const valueToResolve = 'Resolved!';
    // Opcja 1: używając await
    // const result = await resolveValue(valueToResolve);
    // expect(result).toBe(valueToResolve);

    // Opcja 2: używając asercji .resolves
    await expect(resolveValue(valueToResolve)).resolves.toBe(valueToResolve);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const errorMessage = 'This is a test error';
    expect(() => throwError(errorMessage)).toThrow(errorMessage);
  });

  test('should throw error with default message if message is not provided', () => {
    // Zakładamy, że domyślna wiadomość to 'Oops!' - sprawdź w implementacji funkcji
    expect(() => throwError()).toThrow('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrow(MyAwesomeError);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    // Opcja 1: używając try/catch
    // try {
    //   await rejectCustomError();
    // } catch (error) {
    //   expect(error).toBeInstanceOf(MyAwesomeError);
    // }

    // Opcja 2: używając asercji .rejects
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);
  });
});
