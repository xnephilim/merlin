import type { Csp } from '../../types'

export const csp: Csp = {
  'connect-src': [
    process.env.REACT_APP_OPTIMISM_NODE_URL!,
    process.env.REACT_APP_HIGHTABLE_OPTIMISM_HTTP_URL!,
    process.env.REACT_APP_HIGHTABLE_OPTIMISM_WS_URL!,
  ],
}
