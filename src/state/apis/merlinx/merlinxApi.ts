import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { CHAIN_REFERENCE } from '@xblackfury/caip'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { getConfig } from 'config'

import { BASE_RTK_CREATE_API_CONFIG } from '../const'

const TOKEMAK_STATS_URL = getConfig().REACT_APP_TOKEMAK_STATS_URL
const TOKEMAK_TMERLIN_POOL_ADDRESS = '0x808d3e6b23516967ceae4f17a5f9038383ed5311'

type GetMerlinxAprOutput = {
  merlinxApr: string
}

type TokemakPool = {
  address: string
  liquidityProviderApr: string
}

type TokemakChainData = {
  chainId: string
  pools: TokemakPool[]
}

export const merlinxApi = createApi({
  ...BASE_RTK_CREATE_API_CONFIG,
  reducerPath: 'merlinxApi',
  endpoints: build => ({
    getMerlinxApr: build.query<GetMerlinxAprOutput, void>({
      queryFn: async () => {
        try {
          const response = await axios.get<{ chains: TokemakChainData[] }>(TOKEMAK_STATS_URL)
          const tokemakData = response?.data
          // Tokemak only supports mainnet for now, so we could just access chains[0], but this keeps things more declarative
          const tokemakChainData = tokemakData.chains.find(
            ({ chainId }) => chainId === CHAIN_REFERENCE.EthereumMainnet,
          )

          if (!tokemakChainData?.pools) {
            return {
              error: {
                error: 'Cannot get Tokemak pools data',
                status: 'CUSTOM_ERROR',
              },
            }
          }

          const { pools } = tokemakChainData
          const tMerlinPool = pools.find(({ address }) => address === TOKEMAK_TMERLIN_POOL_ADDRESS)

          if (!tMerlinPool) {
            return {
              error: {
                error: 'Cannot get Tokemak TMERLIN pool data',
                status: 'CUSTOM_ERROR',
              },
            }
          }

          return { data: { merlinxApr: tMerlinPool.liquidityProviderApr } }
        } catch (e) {
          if ((e as AxiosError).isAxiosError) {
            return {
              error: {
                error:
                  (e as AxiosError).response?.statusText ?? 'Cannot get Tokemak TMERLIN pool data',
                status: (e as AxiosError).response?.status ?? 400,
              },
            }
          }

          return {
            error: {
              error: 'Cannot get Tokemak TMERLIN pool data',
              status: 'PARSING_ERROR',
            },
          }
        }
      },
    }),
  }),
})

export const { useGetMerlinxAprQuery } = merlinxApi
