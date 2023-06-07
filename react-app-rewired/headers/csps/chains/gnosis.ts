import type { Csp } from '../../types'

export const csp: Csp = {
  'connect-src': [
    process.env.REACT_APP_GNOSIS_NODE_URL!,
    process.env.REACT_APP_HIGHTABLE_GNOSIS_HTTP_URL!,
    process.env.REACT_APP_HIGHTABLE_GNOSIS_WS_URL!,
  ],
}
