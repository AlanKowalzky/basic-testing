import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    const elements = [1, 2, 3];
    const result = generateLinkedList(elements);

    const expected = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            value: null,
            next: null,
          },
        },
      },
    };

    expect(result).toStrictEqual(expected);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    const elements = ['a', 'b', 'c'];
    const result = generateLinkedList(elements);

    expect(result).toMatchSnapshot();
  });

  test('should generate empty linked list', () => {
    const elements: number[] = [];
    const result = generateLinkedList(elements);

    expect(result).toStrictEqual({
      value: null,
      next: null,
    });
  });

  test('should generate linked list with null values', () => {
    const elements = [null, undefined, 'test'];
    const result = generateLinkedList(elements);

    expect(result).toMatchSnapshot();
  });
});
