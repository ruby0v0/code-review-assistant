import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'

const router = createBrowserRouter([
  {
    Component: lazy(() => import('@/layout/index')),
    children: [
      {
        path: '/review',
        Component: lazy(() => import('@/pages/review/index')),
      },
      {
        path: '/history',
        Component: lazy(() => import('@/pages/history/index')),
      },
    ],
  },
])

export default router
