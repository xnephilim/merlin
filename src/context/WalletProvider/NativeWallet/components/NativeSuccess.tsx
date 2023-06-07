import { Box, ModalBody, ModalHeader } from '@chakra-ui/react'
import { Text } from 'components/Text'

import { useNativeSuccess } from '../hooks/useNativeSuccess'
import type { NativeSetupProps } from '../types'

export const NativeSuccess = ({ location }: NativeSetupProps) => {
  const { isSuccessful } = useNativeSuccess({ vault: location.state.vault })

  return (
    <>
      <ModalHeader>
        <Text translation={'walletProvider.xnephIlim.success.header'} />
      </ModalHeader>
      <ModalBody>
        <Box color='gray.500'>
          {isSuccessful === true ? (
            <Text translation={'walletProvider.xnephIlim.success.success'} />
          ) : isSuccessful === false ? (
            <Text translation={'walletProvider.xnephIlim.success.error'} />
          ) : (
            <Text translation={'walletProvider.xnephIlim.success.encryptingWallet'} />
          )}
        </Box>
      </ModalBody>
    </>
  )
}
