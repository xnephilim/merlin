import { type Plugins } from 'plugins/types'
import { RouteCategory } from 'Routes/helpers'
import { MerlinIcon } from 'components/Icons/MerlinIcon'

import { MerlinPage } from './merlinPage'

// eslint-disable-next-line import/no-default-export
export default function register(): Plugins {
  return [
    [
      'merlinPage',
      {
        name: 'merlinPage',
        icon: <MerlinIcon />,
        routes: [
          {
            path: '/merlin',
            label: 'navBar.merlinToken',
            main: () => <MerlinPage />,
            icon: <MerlinIcon />,
            category: RouteCategory.Explore,
            hide: true,
            routes: [
              {
                path: '/merlin',
                label: 'navBar.merlinToken',
                main: () => <MerlinPage />,
              },
              {
                path: '/merlinx',
                label: 'navBar.merlinToken',
                main: () => <MerlinPage />,
              },
            ],
          },
        ],
      },
    ],
  ]
}
