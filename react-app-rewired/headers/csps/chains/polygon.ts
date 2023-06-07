import type { Csp } from '../../types'

export const csp: Csp = {
  'connect-src': [
    process.env.REACT_APP_POLYGON_NODE_URL!,
    process.env.REACT_APP_HIGHTABLE_POLYGON_HTTP_URL!,
    process.env.REACT_APP_HIGHTABLE_POLYGON_WS_URL!,
  ],
}
