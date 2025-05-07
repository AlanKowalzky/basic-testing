// Uncomment the code below and write your tests
import {  simpleCalculator, Action } from './index';

const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';


describe('simpleCalculator table tests', () => {
  describe('valid inputs and operations', () => {
    const standardCalculationTestCases = [
      { a: 1, b: 2, action: Action.Add, expected: 3, description: 'add 1 + 2' },
      { a: 5, b: 3, action: Action.Subtract, expected: 2, description: 'subtract 5 - 3' },
      { a: 6, b: 7, action: Action.Multiply, expected: 42, description: 'multiply 6 * 7' },
      { a: 20, b: 5, action: Action.Divide, expected: 4, description: 'divide 20 / 5' },
      { a: 2, b: 3, action: Action.Exponentiate, expected: 8, description: 'exponentiate 2 ** 3' },
      { a: 0, b: 5, action: Action.Add, expected: 5, description: 'add 0 + 5' },
      { a: -5, b: -3, action: Action.Add, expected: -8, description: 'add -5 + (-3)' },
      { a: 10, b: -2, action: Action.Divide, expected: -5, description: 'divide 10 / (-2)' },
      { a: 0.5, b: 0.5, action: Action.Add, expected: 1.0, description: 'add 0.5 + 0.5' },
      { a: 7, b: 2, action: Action.Divide, expected: 3.5, description: 'divide 7 / 2' },
    ];

    test.each(standardCalculationTestCases)(
      `should correctly ${CYAN}$description${RESET} to be ${YELLOW}$expected${RESET}`,
      ({ a, b, action, expected }) => {
        expect(simpleCalculator({ a, b, action })).toBe(expected);
      },
    );

    const divisionByZeroTestCases = [
      { a: 5, b: 0, action: Action.Divide, expected: Infinity, description: 'positive number by zero (5 / 0)' },
      { a: -5, b: 0, action: Action.Divide, expected: -Infinity, description: 'negative number by zero (-5 / 0)' },
    ];

    test.each(divisionByZeroTestCases)(
      `should return ${YELLOW}$expected${RESET} when dividing ${CYAN}$description${RESET}`,
      ({ a, b, action, expected }) => {
        expect(simpleCalculator({ a, b, action })).toBe(expected);
      },
    );

    test('should return NaN when dividing zero by zero (0 / 0)', () => {
      expect(simpleCalculator({ a: 0, b: 0, action: Action.Divide })).toBeNaN();
    });
  });

  describe('invalid inputs', () => {
    const invalidInputTestCases = [
      {
        a: 1,
        b: 2,
        action: 'invalidActionString', // Not part of Action enum
        description: 'an invalid action string',
      },
      {
        a: 1,
        b: 2,
        action: 999, // Not a valid Action enum value
        description: 'an action of invalid type (number not in enum)',
      },
      {
        a: 'not a number', // Invalid type for 'a'
        b: 2,
        action: Action.Add,
        description: 'argument "a" is not a number',
      },
      {
        a: 1,
        b: true, // Invalid type for 'b'
        action: Action.Add,
        description: 'argument "b" is not a number (boolean)',
      },
      {
        a: 1,
        b: 2,
        action: undefined, // action is undefined
        description: 'action is undefined',
      },
    ];

    test.each(invalidInputTestCases)(
      `should return null for ${CYAN}$description${RESET}`,
      ({ a, b, action }) => {
        expect(simpleCalculator({ a, b, action: action as any })).toBeNull();
      },
    );
  });
});
