// Uncomment the code below and write your tests
// Importujemy funkcje z modułu. Dzięki hoistingowi `jest.mock`,
// te importy otrzymają wersje funkcji zdefiniowane w naszym mocku.
import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  // Pobieramy oryginalny moduł
  const originalModule = jest.requireActual<typeof import('./index')>('./index');

  // Zwracamy obiekt, który będzie nową wersją modułu
  return {
    __esModule: true, // Ważne dla modułów ES6
    ...originalModule, // Zachowujemy wszystkie oryginalne eksporty (w tym unmockedFunction)
    mockOne: jest.fn(),   // Nadpisujemy mockOne pustą funkcją mockującą
    mockTwo: jest.fn(),   // Nadpisujemy mockTwo
    mockThree: jest.fn(), // Nadpisujemy mockThree
  };
});

describe('partial mocking', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    // Tworzymy szpiega na console.log przed każdym testem
    // i mockujemy jego implementację, aby nic nie logował podczas testów
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Przywracamy oryginalną implementację console.log po każdym teście
    consoleSpy.mockRestore();
  });

  afterAll(() => {
    // Odmockowujemy moduł po zakończeniu wszystkich testów w tym pliku
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    mockOne();
    mockTwo();
    mockThree();
    // Sprawdzamy, czy console.log nie zostało wywołane przez zamockowane funkcje
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  test('unmockedFunction should log into console', () => {
    unmockedFunction();
    // Sprawdzamy, czy console.log zostało wywołane dokładnie raz z oczekiwanym komunikatem
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('I am not mocked');
  });
});
