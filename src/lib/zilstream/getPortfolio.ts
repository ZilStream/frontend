import { ZIL_ADDRESS } from "lib/constants";
import { Operator, Token } from "store/types";
import { balanceBatchRequest, sendBatchRequest, tokenBalanceBatchRequest, BatchResponse, poolsBatchRequest, tokenPoolBalanceBatchRequest, totalContributionsBatchRequest, stakingOperatorsBatchRequest, stakingDelegatorsBatchRequest, carbonStakersBatchRequest, portBuoyStakersBatchRequest, portDockStakersBatchRequest, infoBatchRequest, xcadPoolsBatchRequest, xcadTotalContributionsBatchRequest, xcadPoolBalanceBatchRequest } from "utils/batch";
import { Network } from "utils/network";

export default async function getPortfolioState(walletAddress: string, tokens: Token[], operators: Operator[] = []): Promise<BatchResponse[]> {
  const batchRequests: any[] = [];

  tokens.forEach(token => {
    if(token.address_bech32 === ZIL_ADDRESS) {
      batchRequests.push(balanceBatchRequest(token, walletAddress))
    } else {
      batchRequests.push(tokenBalanceBatchRequest(token, walletAddress))
      batchRequests.push(tokenPoolBalanceBatchRequest(token, walletAddress))
      batchRequests.push(xcadPoolBalanceBatchRequest(token, walletAddress))
    }
  }) 

  batchRequests.push(infoBatchRequest())
  batchRequests.push(poolsBatchRequest())
  batchRequests.push(totalContributionsBatchRequest())
  batchRequests.push(xcadPoolsBatchRequest())
  batchRequests.push(xcadTotalContributionsBatchRequest())
  batchRequests.push(stakingOperatorsBatchRequest())
  batchRequests.push(carbonStakersBatchRequest(walletAddress))
  batchRequests.push(portBuoyStakersBatchRequest(walletAddress))
  batchRequests.push(portDockStakersBatchRequest(walletAddress))

  if(operators.length > 0) {
    operators.forEach(operator => {
      batchRequests.push(stakingDelegatorsBatchRequest(operator, walletAddress))
    })
  }

  return await sendBatchRequest(batchRequests)
}