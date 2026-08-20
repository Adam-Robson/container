import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

/**
 * Lazy load the editor page to reduce
 * initial bundle size
 */
const EditorPage = lazy(() => import('../pages/Editor'));

/**
 * Router configuration.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'editor',
        element: (
          <Suspense
            fallback={<p className="route-fallback">Loading editor…</p>}
          >
            <EditorPage />
          </Suspense>
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
