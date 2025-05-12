// Uncomment the code below and write your tests
import { BankAccount, getBankAccount, InsufficientFundsError, TransferFailedError, SynchronizationFailedError } from './index';
import { random } from 'lodash';

// Mockujemy moduł lodash, aby kontrolować zachowanie funkcji random
jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'), // Importujemy rzeczywiste implementacje, jeśli potrzebne
  random: jest.fn(), // Mockujemy tylko funkcję random
}));

describe('BankAccount', () => {
  let account: BankAccount;
  const initialBalance = 100;

  beforeEach(() => {
    // Resetujemy mocki przed każdym testem
    (random as jest.Mock).mockReset();
    account = new BankAccount(initialBalance);
  });

  describe('Initialization and Balance Checking', () => {
    test('should create account with initial positive balance', () => {
      expect(account.getBalance()).toBe(initialBalance);
    });

    test('should create account with initial balance of zero', () => {
      const zeroBalanceAccount = new BankAccount(0);
      expect(zeroBalanceAccount.getBalance()).toBe(0);
    });

    test('getBankAccount factory should return a BankAccount instance with specified balance', () => {
      const factoryBalance = 250;
      const factoryAccount = getBankAccount(factoryBalance);
      expect(factoryAccount).toBeInstanceOf(BankAccount);
      expect(factoryAccount.getBalance()).toBe(factoryBalance);
    });
  });

  describe('Deposit', () => {
    test('should deposit money and update balance', () => {
      const depositAmount = 50;
      account.deposit(depositAmount);
      expect(account.getBalance()).toBe(initialBalance + depositAmount);
    });

    test('should return the account instance for method chaining after deposit', () => {
      expect(account.deposit(50)).toBeInstanceOf(BankAccount);
    });
  });

  describe('Withdraw', () => {
    test('should withdraw money if funds are sufficient', () => {
      const withdrawAmount = 30;
      account.withdraw(withdrawAmount);
      expect(account.getBalance()).toBe(initialBalance - withdrawAmount);
    });

    test('should throw InsufficientFundsError when withdrawing more than balance', () => {
      const withdrawAmount = initialBalance + 10;
      expect(() => account.withdraw(withdrawAmount)).toThrow(InsufficientFundsError);
      expect(() => account.withdraw(withdrawAmount)).toThrow(`Insufficient funds: cannot withdraw more than ${initialBalance}`);
    });

    test('should return the account instance for method chaining after withdraw', () => {
      expect(account.withdraw(30)).toBeInstanceOf(BankAccount);
    });
  });

  describe('Transfer', () => {
    let recipientAccount: BankAccount;

    beforeEach(() => {
      recipientAccount = new BankAccount(50);
    });

    test('should transfer money between accounts if funds are sufficient', () => {
      const transferAmount = 30;
      account.transfer(transferAmount, recipientAccount);
      expect(account.getBalance()).toBe(initialBalance - transferAmount);
      expect(recipientAccount.getBalance()).toBe(50 + transferAmount);
    });

    test('should throw InsufficientFundsError when transferring more than balance from source account', () => {
      const transferAmount = initialBalance + 10;
      expect(() => account.transfer(transferAmount, recipientAccount)).toThrow(InsufficientFundsError);
      expect(account.getBalance()).toBe(initialBalance); // Saldo źródłowe nie powinno się zmienić
      expect(recipientAccount.getBalance()).toBe(50); // Saldo docelowe nie powinno się zmienić
    });

    test('should throw TransferFailedError when transferring to the same account', () => {
      const transferAmount = 10;
      expect(() => account.transfer(transferAmount, account)).toThrow(TransferFailedError);
      expect(account.getBalance()).toBe(initialBalance); // Saldo nie powinno się zmienić
    });

    test('should return the source account instance for method chaining after transfer', () => {
      expect(account.transfer(30, recipientAccount)).toBeInstanceOf(BankAccount);
    });
  });

  describe('Asynchronous Operations', () => {
    describe('fetchBalance', () => {
      test('fetchBalance should return a number if request did not fail (simulated)', async () => {
        const mockedFetchedBalance = 77;
        // Symulujemy, że random() dla salda zwróci 77, a dla requestFailed zwróci 1 (czyli nie failed)
        (random as jest.Mock).mockReturnValueOnce(mockedFetchedBalance).mockReturnValueOnce(1);

        const fetchedBalance = await account.fetchBalance();
        expect(fetchedBalance).toBe(mockedFetchedBalance);
        expect(random).toHaveBeenCalledTimes(2); // Sprawdzamy, czy random zostało wywołane 2 razy
      });

      test('fetchBalance should return null if request failed (simulated)', async () => {
        // Symulujemy, że random() dla salda zwróci cokolwiek, a dla requestFailed zwróci 0 (czyli failed)
        (random as jest.Mock).mockReturnValueOnce(50).mockReturnValueOnce(0);

        const fetchedBalance = await account.fetchBalance();
        expect(fetchedBalance).toBeNull();
        expect(random).toHaveBeenCalledTimes(2);
      });
    });

    describe('synchronizeBalance', () => {
      test('should set new balance if fetchBalance returned a number (simulated)', async () => {
        const mockedFetchedBalance = 88;
        // Symulujemy, że random() dla salda zwróci 88, a dla requestFailed zwróci 1 (nie failed)
        // To wpłynie na wewnętrzne wywołanie fetchBalance w synchronizeBalance
        (random as jest.Mock).mockReturnValueOnce(mockedFetchedBalance).mockReturnValueOnce(1);

        await account.synchronizeBalance();
        expect(account.getBalance()).toBe(mockedFetchedBalance);
        expect(random).toHaveBeenCalledTimes(2); // fetchBalance wywołuje random 2 razy
      });

      test('should throw SynchronizationFailedError if fetchBalance returned null (simulated)', async () => {
        // Symulujemy, że random() dla salda zwróci cokolwiek, a dla requestFailed zwróci 0 (failed)
        (random as jest.Mock).mockReturnValueOnce(50).mockReturnValueOnce(0);

        await expect(account.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError);
        expect(account.getBalance()).toBe(initialBalance); // Saldo nie powinno się zmienić
        expect(random).toHaveBeenCalledTimes(2);
      });

      test('should throw SynchronizationFailedError if fetchBalance (mocked directly) returned null', async () => {
        // Alternatywny sposób mockowania, bezpośrednio na metodzie fetchBalance
        const fetchBalanceSpy = jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);

        await expect(account.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError);
        expect(account.getBalance()).toBe(initialBalance);

        fetchBalanceSpy.mockRestore(); // Przywracamy oryginalną implementację
      });
    });
  });
});
