import { Alert, AlertDescription, AlertIcon, Link } from '@chakra-ui/react'
import { useTranslate } from 'react-polyglot'
import { Text } from 'components/Text'
import { MobileCreate } from 'context/WalletProvider/MobileWallet/components/MobileCreate'

const DeprecationHeader = () => {
  const translate = useTranslate()

  return (
    <Alert status='error' mb={4}>
      <AlertIcon />
      <AlertDescription fontSize='md'>
        <Text translation={'walletProvider.xnephIlim.legacy.deprecatedWarning'} />
        <Link
          href={'https://xnephilim.zendesk.com/hc/en-us/articles/6161030693517'}
          fontWeight='normal'
          isExternal
        >
          {translate('walletProvider.xnephIlim.legacy.learnMore')}
        </Link>
      </AlertDescription>
    </Alert>
  )
}

export const MobileLegacyCreate = () => {
  return <MobileCreate HeaderComponent={DeprecationHeader} />
}
