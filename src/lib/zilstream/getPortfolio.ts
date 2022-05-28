import { ZIL_ADDRESS } from "lib/constants";
import { stakingBatchRequests } from "lib/staking/staking";
import { Operator, Token } from "store/types";
import { balanceBatchRequest, sendBatchRequest, tokenBalanceBatchRequest, BatchResponse, poolsBatchRequest, tokenPoolBalanceBatchRequest, totalContributionsBatchRequest, stakingOperatorsBatchRequest, stakingDelegatorsBatchRequest, infoBatchRequest, xcadPoolsBatchRequest, xcadTotalContributionsBatchRequest, xcadPoolBalanceBatchRequest, xcadZilPoolsBatchRequest, xcadZilTotalContributionsBatchRequest, xcadZilPoolBalanceBatchRequest, carbTokenPoolBalanceBatchRequest, carbPoolsBatchRequest, carbTotalContributionsBatchRequest, hunyBalanceBatchRequest, zilAllTokenPoolBalanceBatchRequest, zilAllPoolsBatchRequest, zilAllTotalContributionsBatchRequest } from "utils/batch";
import { Network } from "utils/network";

export default async function getPortfolioState(walletAddress: string, tokens: Token[], operators: Operator[] = []): Promise<BatchResponse[]> {
  var batchRequests: any[] = [];

  tokens.forEach(token => {
    if(token.address === ZIL_ADDRESS) {
      batchRequests.push(balanceBatchRequest(token, walletAddress))
      batchRequests.push(carbTokenPoolBalanceBatchRequest(token, walletAddress))
    } else {
      batchRequests.push(tokenBalanceBatchRequest(token, walletAddress))
      batchRequests.push(tokenPoolBalanceBatchRequest(token, walletAddress))
      batchRequests.push(xcadPoolBalanceBatchRequest(token, walletAddress))
      batchRequests.push(xcadZilPoolBalanceBatchRequest(token, walletAddress))
      batchRequests.push(carbTokenPoolBalanceBatchRequest(token, walletAddress))
      batchRequests.push(zilAllTokenPoolBalanceBatchRequest(token, walletAddress))
    }
  })

  batchRequests.push(infoBatchRequest())
  batchRequests.push(poolsBatchRequest())
  batchRequests.push(totalContributionsBatchRequest())
  batchRequests.push(xcadPoolsBatchRequest())
  batchRequests.push(xcadTotalContributionsBatchRequest())
  batchRequests.push(xcadZilPoolsBatchRequest())
  batchRequests.push(xcadZilTotalContributionsBatchRequest())
  batchRequests.push(carbPoolsBatchRequest())
  batchRequests.push(carbTotalContributionsBatchRequest())
  batchRequests.push(zilAllPoolsBatchRequest())
  batchRequests.push(zilAllTotalContributionsBatchRequest())
  batchRequests.push(stakingOperatorsBatchRequest())
  batchRequests = batchRequests.concat(stakingBatchRequests(walletAddress))
  batchRequests.push(hunyBalanceBatchRequest(walletAddress))

  if(operators.length > 0) {
    operators.forEach(operator => {
      batchRequests.push(stakingDelegatorsBatchRequest(operator, walletAddress))
    })
  }

  return await sendBatchRequest(batchRequests)
}