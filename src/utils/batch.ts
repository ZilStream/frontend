import { fromBech32Address } from "@zilliqa-js/crypto";
import { CARBSWAP_ADDRESS, XCADDEX_ADDRESS, ZILALL_ADDRESS, ZILSWAP_ADDRESS } from "lib/constants";
import { StakingContract } from "lib/staking/staking";
import { NftCollection, Operator, Token } from "store/types";
import { Network } from "./network";
import { Node, TestnetNode } from "./node";

export enum BatchRequestType {
  BlockchainInfo = "blockchainInfo",
  Balance = "balance",
  TokenBalance = "tokenBalance",
  TokenAllowance = "tokenAllowance",
  Pools = "pools",
  PoolBalance = "poolBalance",
  TotalContributions = "totalContributions",
  XcadPools = "xcadPools",
  XcadBalances = "xcadBalances",
  XcadTotalContributions = "xcadTotalContributions",
  XcadZilPools = "xcadZilPools",
  XcadZilBalances = "xcadZilBalances",
  XcadZilTotalContributions = "xcadZilTotalContributions",
  CarbPools = "carbPools",
  CarbBalances = "carbBalances",
  CarbTotalContributions = "carbTotalContributions",
  ZilAllPools = "zilAllPools",
  ZilAllBalances = "zilAllBalances",
  ZilAllTotalContributions = "zilAllTotalContributions",
  StakingOperators = "stakingOperators",
  StakingDelegators = "stakingDelegators",
  HunyBalances = "HunyBalances",
  Staking = "Staking",
  NftCollectionState = "NftCollectionState",
};

const zilSwapAddress = ZILSWAP_ADDRESS
const zilSwapHash = fromBech32Address(zilSwapAddress)

const xcadDexAddress = XCADDEX_ADDRESS
const xcadDexHash = fromBech32Address(xcadDexAddress)

const carbSwapAddress = CARBSWAP_ADDRESS
const carbSwapHash = fromBech32Address(carbSwapAddress)

const zilAllAddress = ZILALL_ADDRESS
const zilAllHash = fromBech32Address(zilAllAddress)

const stakingAddress = "zil15lr86jwg937urdeayvtypvhy6pnp6d7p8n5z09"
const stakingHash = fromBech32Address(stakingAddress)

const hunyHiveAddress = "zil10mmqxduremmhyz2j89qptk3x8f2srw8rqukf8y"
const hunyHiveHash = fromBech32Address(hunyHiveAddress)

export interface BatchRequestItem {
  id: string;
  jsonrpc: string;
  method: string;
  params: any[];
}

export interface BatchRequest {
  type: string
  token?: Token
  collection?: NftCollection
  stakingContract?: StakingContract
  item: BatchRequestItem
}

export interface BatchResponse {
  request: BatchRequest;
  result: any;
}

export const requestParams = {
  id: "1",
  jsonrpc: "2.0"
}

export const infoBatchRequest = (): BatchRequest => {
  return {
    type: BatchRequestType.BlockchainInfo,
    item: {
      ...requestParams,
      method: "GetBlockchainInfo",
      params: []
    }
  }
}

/**
 * Create a `GetBalance` request.
 *
 * @param Token The token for which it's requested.
 * @param string The wallet address.
 * @returns BatchRequest
 */
export const balanceBatchRequest = (token: Token, address: string): BatchRequest => {
  const walletAddress = fromBech32Address(address).replace('0x', '').toLowerCase()
  return {
    type: BatchRequestType.Balance,
    token: token,
    item: {
      ...requestParams,
      method: "GetBalance",
      params: [walletAddress],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the balances variable.
 *
 * @param Token The token for which it's requested.
 * @param string The wallet address.
 * @returns BatchRequest
 */
export const tokenBalanceBatchRequest = (token: Token, walletAddress: string): BatchRequest => {
  const address = fromBech32Address(token.address)
  const walletAddr = fromBech32Address(walletAddress).toLowerCase()
  return {
    type: BatchRequestType.TokenBalance,
    token: token,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        address.replace("0x", "").toLowerCase(),
        "balances",
        [walletAddr],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the allowances variable.
 *
 * @param Token The token for which it's requested.
 * @param string The wallet address.
 * @returns BatchRequest
 */
export const tokenAllowancesBatchRequest = (token: Token, walletAddress: string): BatchRequest => {
  const address = fromBech32Address(token.address)
  return {
    type: BatchRequestType.TokenAllowance,
    token: token,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        address.replace("0x", "").toLowerCase(),
        "allowances",
        [walletAddress],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the token pools.
 *
 * @returns BatchRequest
 */
 export const poolsBatchRequest = (): BatchRequest => {
  return {
    type: BatchRequestType.Pools,
    token: undefined,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        zilSwapHash.replace("0x", "").toLowerCase(),
        "pools",
        [],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the token pool total contributions.
 *
 * @returns BatchRequest
 */
 export const totalContributionsBatchRequest = (): BatchRequest => {
  return {
    type: BatchRequestType.TotalContributions,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        zilSwapHash.replace("0x", "").toLowerCase(),
        "total_contributions",
        [],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the token pool balance.
 *
 * @param Token The token for which it's requested.
 * @param string The wallet address.
 * @returns BatchRequest
 */
 export const tokenPoolBalanceBatchRequest = (token: Token, walletAddress: string): BatchRequest => {
  const address = fromBech32Address(token.address).toLowerCase()
  const walletAddr = fromBech32Address(walletAddress).toLowerCase()
  return {
    type: BatchRequestType.PoolBalance,
    token: token,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        zilSwapHash.replace("0x", "").toLowerCase(),
        "balances",
        [address, walletAddr],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the token pools.
 *
 * @returns BatchRequest
 */
 export const xcadPoolsBatchRequest = (): BatchRequest => {
  return {
    type: BatchRequestType.XcadPools,
    token: undefined,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        xcadDexHash.replace("0x", "").toLowerCase(),
        "xpools",
        [],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the token pool total contributions.
 *
 * @returns BatchRequest
 */
 export const xcadTotalContributionsBatchRequest = (): BatchRequest => {
  return {
    type: BatchRequestType.XcadTotalContributions,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        xcadDexHash.replace("0x", "").toLowerCase(),
        "xtotal_contributions",
        [],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the token pool balance.
 *
 * @param Token The token for which it's requested.
 * @param string The wallet address.
 * @returns BatchRequest
 */
 export const xcadPoolBalanceBatchRequest = (token: Token, walletAddress: string): BatchRequest => {
  const address = fromBech32Address(token.address).toLowerCase()
  const walletAddr = fromBech32Address(walletAddress).toLowerCase()
  return {
    type: BatchRequestType.XcadBalances,
    token: token,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        xcadDexHash.replace("0x", "").toLowerCase(),
        "xbalances",
        ["0x153feaddc48871108e286de3304b9597c817b456,"+address, "0x153feaddc48871108e286de3304b9597c817b456", walletAddr],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the token pools.
 *
 * @returns BatchRequest
 */
 export const xcadZilPoolsBatchRequest = (): BatchRequest => {
  return {
    type: BatchRequestType.XcadZilPools,
    token: undefined,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        xcadDexHash.replace("0x", "").toLowerCase(),
        "pools",
        [],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the token pool total contributions.
 *
 * @returns BatchRequest
 */
 export const xcadZilTotalContributionsBatchRequest = (): BatchRequest => {
  return {
    type: BatchRequestType.XcadZilTotalContributions,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        xcadDexHash.replace("0x", "").toLowerCase(),
        "total_contributions",
        [],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the token pool balance.
 *
 * @param Token The token for which it's requested.
 * @param string The wallet address.
 * @returns BatchRequest
 */
 export const xcadZilPoolBalanceBatchRequest = (token: Token, walletAddress: string): BatchRequest => {
  const address = fromBech32Address(token.address).toLowerCase()
  const walletAddr = fromBech32Address(walletAddress).toLowerCase()
  return {
    type: BatchRequestType.XcadZilBalances,
    token: token,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        xcadDexHash.replace("0x", "").toLowerCase(),
        "balances",
        [address, walletAddr],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the token pools.
 *
 * @returns BatchRequest
 */
 export const carbPoolsBatchRequest = (): BatchRequest => {
  return {
    type: BatchRequestType.CarbPools,
    token: undefined,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        carbSwapHash.replace("0x", "").toLowerCase(),
        "pools",
        [],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the token pool total contributions.
 *
 * @returns BatchRequest
 */
 export const carbTotalContributionsBatchRequest = (): BatchRequest => {
  return {
    type: BatchRequestType.CarbTotalContributions,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        carbSwapHash.replace("0x", "").toLowerCase(),
        "total_contributions",
        [],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the token pool balance.
 *
 * @param Token The token for which it's requested.
 * @param string The wallet address.
 * @returns BatchRequest
 */
 export const carbTokenPoolBalanceBatchRequest = (token: Token, walletAddress: string): BatchRequest => {
  const address = fromBech32Address(token.address).toLowerCase()
  const walletAddr = fromBech32Address(walletAddress).toLowerCase()
  return {
    type: BatchRequestType.CarbBalances,
    token: token,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        carbSwapHash.replace("0x", "").toLowerCase(),
        "balances",
        [address, walletAddr],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the token pools.
 *
 * @returns BatchRequest
 */
 export const zilAllPoolsBatchRequest = (): BatchRequest => {
  return {
    type: BatchRequestType.ZilAllPools,
    token: undefined,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        zilAllHash.replace("0x", "").toLowerCase(),
        "liquidity",
        [],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the token pool total contributions.
 *
 * @returns BatchRequest
 */
 export const zilAllTotalContributionsBatchRequest = (): BatchRequest => {
  return {
    type: BatchRequestType.ZilAllTotalContributions,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        zilAllHash.replace("0x", "").toLowerCase(),
        "total_contributions",
        [],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the token pool balance.
 *
 * @param Token The token for which it's requested.
 * @param string The wallet address.
 * @returns BatchRequest
 */
 export const zilAllTokenPoolBalanceBatchRequest = (token: Token, walletAddress: string): BatchRequest => {
  const address = fromBech32Address(token.address).toLowerCase()
  const walletAddr = fromBech32Address(walletAddress).toLowerCase()
  return {
    type: BatchRequestType.ZilAllBalances,
    token: token,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        zilAllHash.replace("0x", "").toLowerCase(),
        "balances",
        [address, walletAddr],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the staking operators.
 *
 * @returns BatchRequest
 */
 export const stakingOperatorsBatchRequest = (): BatchRequest => {
  return {
    type: BatchRequestType.StakingOperators,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        stakingHash.replace("0x", "").toLowerCase(),
        "ssnlist",
        [],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the staking delegators.
 *
 * @param Operator The operator for which it's requested.
 * @param string The wallet address.
 * @returns BatchRequest
 */
 export const stakingDelegatorsBatchRequest = (operator: Operator, walletAddress: string): BatchRequest => {
  return {
    type: BatchRequestType.StakingDelegators,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        stakingHash.replace("0x", "").toLowerCase(),
        "ssn_deleg_amt",
        [
          operator.address,
          fromBech32Address(walletAddress).toLowerCase()
        ],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the huny token pool balance.
 *
 * @param string The wallet address.
 * @returns BatchRequest
 */
 export const hunyBalanceBatchRequest = (walletAddress: string): BatchRequest => {
  const walletAddr = fromBech32Address(walletAddress).toLowerCase()
  
  return {
    type: BatchRequestType.HunyBalances,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        hunyHiveHash.replace("0x", "").toLowerCase(),
        "balances",
        [walletAddr],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the nft collection state.
 *
 * @param string The collection address.
 * @returns BatchRequest
 */
export const nftCollectionStateBatchRequest = (collection: NftCollection): BatchRequest => {
  const address = fromBech32Address(collection.address).toLowerCase()
  
  return {
    type: BatchRequestType.NftCollectionState,
    collection: collection,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        address.replace("0x", "").toLowerCase(),
        "token_owners",
        []
      ]
    }
  }
}

/**
 * Sends a series of requests as a batch to the Zilliqa API.
 *
 * @param Network The currently selected network.
 * @param BatchRequest[] An array of RPC requests.
 * @returns Promise<BatchResponse[]> Array of responses.
 */
export const sendBatchRequest = async (requests: BatchRequest[], network: Network = Network.MainNet, node: Node|TestnetNode = Node.ZilStream, ): Promise<BatchResponse[]> => {  
  const response = await fetch(node, {
    method: 'POST',
    body: JSON.stringify(requests.flatMap(request => request.item))
  })

  const results = await response.json();

  if (!Array.isArray(results)) {
    return []
  }

  var responseItems: BatchResponse[] = [];
  results.forEach((result: any, i: number) => {
    responseItems.push({
      request: requests[i],
      result: result.result,
    });
  });

  return responseItems;
};