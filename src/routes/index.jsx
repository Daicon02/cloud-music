import { Navigate } from 'react-router-dom'
import Home from '../application/Home'
import Recommend from '../application/Recommend'
import Rank from '../application/Rank'
import Album from '../application/Album'
import Singers from '../application/Singers'
import Singer from '../application/SingerInfo'
import Search from '../application/Search'

const RouteList = [
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: '/',
        exact: true,
        element: <Navigate to="/recommend" />,
      },
      {
        path: '/recommend',
        element: <Recommend />,
        key: 'recommend',
        children: [
          {
            path: '/recommend/:id',
            element: <Album />,
          },
        ],
      },
      {
        path: '/rank',
        element: <Rank />,
        key: 'rank',
        children: [
          {
            path: '/rank/:id',
            element: <Album />,
          },
        ],
      },
      {
        path: '/singers',
        element: <Singers />,
        key: 'singers',
        children: [
          {
            path: '/singers/:id',
            element: <Singer />,
          },
        ],
      },
      {
        path: '/search',
        exact: true,
        key: 'search',
        element: <Search />,
      },
      {
        path: '/album/:id',
        exact: true,
        key: 'album',
        element: <Album />,
      },
    ],
  },
]

export default RouteList
