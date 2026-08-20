import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

vi.mock('firebase/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('firebase/auth')>()),
  getAuth: vi.fn(() => ({}) as never),
  onAuthStateChanged: vi.fn(
    (_auth: unknown, callback: (user: null) => void) => {
      callback(null);
      return () => {};
    },
  ),
}));

const { createMemoryRouter, RouterProvider } = await import('react-router-dom');
const { default: App } = await import('../App');
const { default: Home } = await import('../pages/Home');
const { AuthProvider } = await import('../contexts/AuthProvider');

function renderApp(initialPath = '/') {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <App />,
        children: [{ index: true, element: <Home /> }],
      },
    ],
    { initialEntries: [initialPath] },
  );

  return render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>,
  );
}

describe('App shell', () => {
  test('renders the brand in the header', () => {
    renderApp();
    expect(screen.getByTestId('container')).toHaveTextContent('container');
  });

  test('offers sign-in options when signed out', () => {
    renderApp();
    expect(
      screen.getByRole('button', { name: /continue as guest/i }),
    ).toBeDefined();
    expect(
      screen.getByRole('button', { name: /sign in with github/i }),
    ).toBeDefined();
  });

  test('links to the editor route', () => {
    renderApp();
    expect(screen.getByRole('link', { name: /^editor$/i })).toHaveAttribute(
      'href',
      '/editor',
    );
  });
});
