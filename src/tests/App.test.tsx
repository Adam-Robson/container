import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { routes } from '../routes/router';

function renderApp(initialPath = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] });
  return render(<RouterProvider router={router} />);
}

describe('App shell', () => {
  test('renders the brand in the header', () => {
    renderApp();
    expect(screen.getByTestId('brand')).toHaveTextContent('container');
  });

  test('renders the home page at /', () => {
    renderApp();
    expect(
      screen.getByRole('heading', { level: 1, name: 'container' }),
    ).toBeInTheDocument();
  });

  test('renders the not-found page for an unknown path', () => {
    renderApp('/does/not/exist');
    expect(
      screen.getByRole('heading', { level: 1, name: '404' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back home/i })).toHaveAttribute(
      'href',
      '/',
    );
  });
});
