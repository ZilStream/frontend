import { TokenInfo } from "store/types";
import { balanceBatchRequest, sendBatchRequest, tokenBalanceBatchRequest, BatchResponse, poolsBatchRequest, tokenPoolBalanceBatchRequest, totalContributionsBatchRequest, stakingOperatorsBatchRequest, stakingDelegatorsBatchRequest } from "utils/batch";
import { Network } from "utils/network";

export default async function getPortfolioState(walletAddress: string, tokens: TokenInfo[]): Promise<BatchResponse[]> {
  const batchRequests: any[] = [];

  tokens.forEach(token => {
    if(token.address_bech32 === 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz') {
      batchRequests.push(balanceBatchRequest(token, walletAddress))
    } else {
      batchRequests.push(tokenBalanceBatchRequest(token, walletAddress))
      batchRequests.push(tokenPoolBalanceBatchRequest(token, walletAddress))
    }
  })

  batchRequests.push(poolsBatchRequest())
  batchRequests.push(totalContributionsBatchRequest())
  batchRequests.push(stakingOperatorsBatchRequest())
  batchRequests.push(stakingDelegatorsBatchRequest())

  return await sendBatchRequest(Network.MainNet, batchRequests)
}