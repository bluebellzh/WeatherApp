import { convertTemperature, getWindDirection } from '../utils/utils';
import { WindDirection } from '../weather';

describe('convertTemperature', () => {
  it('converts celsius to fahrenheit correctly', () => {
    expect(convertTemperature(0, 'fahrenheit')).toBe(32);
    expect(convertTemperature(100, 'fahrenheit')).toBe(212);
    expect(convertTemperature(-40, 'fahrenheit')).toBe(-40);
    expect(convertTemperature(21, 'fahrenheit')).toBe(69.8);
  });

  it('returns celsius when unit is not fahrenheit', () => {
    expect(convertTemperature(25, 'celsius')).toBe(25);
    expect(convertTemperature(30, 'unknown')).toBe(30);
  });
});

describe('getWindDirection', () => {
  const testCases = [
    { degrees: 0, expected: WindDirection.NORTH },
    { degrees: 45, expected: WindDirection.NORTH_EAST },
    { degrees: 90, expected: WindDirection.EAST },
    { degrees: 135, expected: WindDirection.SOUTH_EAST },
    { degrees: 180, expected: WindDirection.SOUTH },
    { degrees: 225, expected: WindDirection.SOUTH_WEST },
    { degrees: 270, expected: WindDirection.WEST },
    { degrees: 315, expected: WindDirection.NORTH_WEST },
    { degrees: 360, expected: WindDirection.NORTH },
  ];

  testCases.forEach(({ degrees, expected }) => {
    it(`converts ${degrees} degrees to ${expected}`, () => {
      expect(getWindDirection(degrees)).toBe(expected);
    });
  });

  it('handles angles greater than 360 degrees', () => {
    expect(getWindDirection(370)).toBe(WindDirection.NORTH);
    expect(getWindDirection(405)).toBe(WindDirection.NORTH_EAST);
  });

  it('handles negative angles', () => {
    expect(getWindDirection(-45)).toBe(WindDirection.NORTH_WEST);
    expect(getWindDirection(-90)).toBe(WindDirection.WEST);
  });

  it('rounds to nearest direction', () => {
    expect(getWindDirection(22)).toBe(WindDirection.NORTH);
    expect(getWindDirection(68)).toBe(WindDirection.EAST);
  });
});