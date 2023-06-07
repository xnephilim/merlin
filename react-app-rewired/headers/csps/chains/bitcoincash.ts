import type { Csp } from '../../types'

export const csp: Csp = {
  'connect-src': [
    process.env.REACT_APP_HIGHTABLE_BITCOINCASH_HTTP_URL!,
    process.env.REACT_APP_HIGHTABLE_BITCOINCASH_WS_URL!,
  ],
}
