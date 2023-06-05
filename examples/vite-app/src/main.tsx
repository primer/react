import React from 'react'
import ReactDOM from 'react-dom/client'
import {ThemeProvider, BaseStyles} from '@primer/react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import {Content} from './Content'
import Root from './routes/root'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,

    children: [
      {
        path: 'code',
        element: <Content />,
      },
      {
        path: 'issues',
        element: <Content />,
      },
      {
        path: 'pull-requests',
        element: <Content />,
      },
      {
        path: 'discussions',
        element: <Content />,
      },
      {
        path: 'actions',
        element: <Content />,
      },
      {
        path: 'projects',
        element: <Content />,
      },
      {
        path: 'insights',
        element: <Content />,
      },
      {
        path: 'settings',
        element: <Content />,
      },
      {
        path: 'security',
        element: <Content />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider colorMode="auto">
    <BaseStyles>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </BaseStyles>
  </ThemeProvider>,
)
