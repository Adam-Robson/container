import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';
import App from '../App';

describe('App Component', () => {
  beforeEach(() => {
    try {
      render(<App />);
    } catch (error) {
      console.error(error);
    }
  });

  test('renders react logo', () => {
    const title = screen.getAllByTestId(/container/i);
    expect(title).toBeDefined();
  });
});
