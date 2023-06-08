# @xblackfury/investor-merlinx

ShapeShift's Yearn investor package.

## Installation

```bash
yarn add @xblackfury/investor-merlinx
```

## Initialization

```javascript
import { MerlinxApi } from '@xblackfury/investor-merlinx'
import { toChainId, CHAIN_NAMESPACE, CHAIN_REFERENCE } from '@xgridiron/caip'

const api = new MerlinxApi({
  adapter: await adapterManager.byChainId(
    toChainId({ chainNamespace: CHAIN_NAMESPACE.Evm, chainReference: CHAIN_REFERENCE.EthereumMainnet })
  ), // adapter is an ETH @xblackfury/chain-adapters
  providerUrl: '<your eth node privider url>'
})
```

### Functions

- getMerlinxOpportunities
- getMerlinxOpportunityByStakingAddress
- getGasPrice
- getTxReceipt
- checksumAddress
- estimateClaimWithdrawGas
- estimateSendWithdrawalRequestsGas
- estimateAddLiquidityGas
- estimateRemoveLiquidityGas
- estimateWithdrawGas
- estimateInstantWithdrawGas
- estimateDepositGas
- estimateApproveGas
- approve
- allowance
- deposit
- withdraw
- instantWithdraw
- claimWithdraw
- sendWithdrawalRequests
- addLiquidity
- removeLiquidity
- getTimeUntilClaimable
- balance
- totalSupply
- pricePerShare
- apy
- tvl

### Examples

For more in-depth examples, check out ./src/merlinxcli.ts

```javascript
const api = new MerlinxApi({
  adapter: await adapterManager.byChainId(
    toChainId({ chainNamespace: CHAIN_NAMESPACE.Evm, chainReference: CHAIN_REFERENCE.EthereumMainnet })
  ),
  providerUrl: 'https://dev-api.ethereum.xnephilim.com'
})

await api.approve({
  tokenContractAddress, // MERLIN address
  contractAddress, // Staking contract address
  userAddress, // User's wallet address
  wallet // HDWallet
})

await api.deposit({
  contractAddress, // Staking contract address
  amountDesired, // Amount to stake
  userAddress, // User's wallet address
  wallet // HDWallet
})

await api.withdraw({
  contractAddress, // Staking contract address
  amountDesired, // Amount to unstake
  userAddress, // User's wallet address
  wallet // HDWallet
})
```
