import { ZIL_ADDRESS } from "lib/constants";
import { Operator, Token } from "store/types";
import { balanceBatchRequest, sendBatchRequest, tokenBalanceBatchRequest, BatchResponse, poolsBatchRequest, tokenPoolBalanceBatchRequest, totalContributionsBatchRequest, stakingOperatorsBatchRequest, stakingDelegatorsBatchRequest, carbonStakersBatchRequest, portBuoyStakersBatchRequest, portDockStakersBatchRequest, infoBatchRequest, xcadPoolsBatchRequest, xcadTotalContributionsBatchRequest, xcadPoolBalanceBatchRequest, xcadStakingAddresses, xcadStakingRequest, okipadStakingBatchRequest, feesBachelorsStakersBatchRequest, feesMastersStakersBatchRequest, feesDoctoralStakersBatchRequest, xcadZilPoolsBatchRequest, xcadZilTotalContributionsBatchRequest, xcadZilPoolBalanceBatchRequest, dmzStakingBatchRequest, bloxStakingBatchRequest } from "utils/batch";
import { Network } from "utils/network";

export default async function getPortfolioState(walletAddress: string, tokens: Token[], operators: Operator[] = []): Promise<BatchResponse[]> {
  const batchRequests: any[] = [];

  tokens.forEach(token => {
    if(token.address === ZIL_ADDRESS) {
      batchRequests.push(balanceBatchRequest(token, walletAddress))
    } else {
      batchRequests.push(tokenBalanceBatchRequest(token, walletAddress))
      batchRequests.push(tokenPoolBalanceBatchRequest(token, walletAddress))
      batchRequests.push(xcadPoolBalanceBatchRequest(token, walletAddress))
      batchRequests.push(xcadZilPoolBalanceBatchRequest(token, walletAddress))
    }
  }) 

  batchRequests.push(infoBatchRequest())
  batchRequests.push(poolsBatchRequest())
  batchRequests.push(totalContributionsBatchRequest())
  batchRequests.push(xcadPoolsBatchRequest())
  batchRequests.push(xcadTotalContributionsBatchRequest())
  batchRequests.push(xcadZilPoolsBatchRequest())
  batchRequests.push(xcadZilTotalContributionsBatchRequest())
  batchRequests.push(stakingOperatorsBatchRequest())
  batchRequests.push(carbonStakersBatchRequest(walletAddress))
  batchRequests.push(portBuoyStakersBatchRequest(walletAddress))
  batchRequests.push(portDockStakersBatchRequest(walletAddress))
  batchRequests.push(okipadStakingBatchRequest(walletAddress))
  batchRequests.push(dmzStakingBatchRequest(walletAddress))
  batchRequests.push(feesBachelorsStakersBatchRequest(walletAddress))
  batchRequests.push(feesMastersStakersBatchRequest(walletAddress))
  batchRequests.push(feesDoctoralStakersBatchRequest(walletAddress))
  batchRequests.push(bloxStakingBatchRequest(walletAddress))

  Object.values(xcadStakingAddresses).forEach(stakingValue => {
    const tokenAddress = stakingValue[0]
    const contractAddress = stakingValue[1]
    const token = tokens.filter(t => t.address === tokenAddress)?.[0]
    if(token) {
      batchRequests.push(xcadStakingRequest(token, contractAddress, walletAddress))
    }
  })

  if(operators.length > 0) {
    operators.forEach(operator => {
      batchRequests.push(stakingDelegatorsBatchRequest(operator, walletAddress))
    })
  }

  return await sendBatchRequest(batchRequests)
}