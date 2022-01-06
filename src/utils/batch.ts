import { fromBech32Address } from "@zilliqa-js/crypto";
import { XCADDEX_ADDRESS, ZILSWAP_ADDRESS } from "lib/constants";
import { Operator, Token } from "store/types";
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
  StakingOperators = "stakingOperators",
  StakingDelegators = "stakingDelegators",
  CarbonStakers = "carbonStakers",
  PortBuoyStakers = "portBuoyStakers",
  PortDockStakers = "portDockStakers",
  XcadStaking = "XcadStaking",
  OkipadStaking = "OkipadStaking"
};

const zilSwapAddress = ZILSWAP_ADDRESS
const zilSwapHash = fromBech32Address(zilSwapAddress)

const xcadDexAddress = XCADDEX_ADDRESS
const xcadDexHash = fromBech32Address(xcadDexAddress)

const stakingAddress = "zil15lr86jwg937urdeayvtypvhy6pnp6d7p8n5z09"
const stakingHash = fromBech32Address(stakingAddress)

const carbStakingAddress = "zil18r37xks4r3rj7rzydujcckzlylftdy2qerszne"
const carbStakingHash = fromBech32Address(carbStakingAddress)

const portBuoyStakingAddress = "zil1lkhea3egremrwtn4lfhsa4psk978k2sat3cs3u"
const portBuoyStakingHash = fromBech32Address(portBuoyStakingAddress)

const portDockStakingAddress = "zil1yhy3wm79cx8v9zyg7qecwa457w0ysupgvzk5pt"
const portDockStakingHash = fromBech32Address(portDockStakingAddress)

const okipadStakingAddress = "zil1eeahtrggk3m77nu40ltmaqdmtcyhdh9ujahgf6"
const okipadStakingHash = fromBech32Address(okipadStakingAddress)

export const xcadStakingAddresses: {[id: string]: string} = {
  'zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f': '0xa397c1aa3054bdad8aecf645a2b582202eea57b9',
  'zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk': '0xb90c6392e2c550eaff55fdbc8101bf24cb6ec386',
  'zil18f5rlhqz9vndw4w8p60d0n7vg3n9sqvta7n6t2': '0xc6474b616fbb71fca8dcf4b09b5ea1b553231a4d'
}

interface BatchRequestItem {
  id: string;
  jsonrpc: string;
  method: string;
  params: any[];
}

interface BatchRequest {
  type: string
  token?: Token
  item: BatchRequestItem
}

export interface BatchResponse {
  request: BatchRequest;
  result: any;
}

const requestParams = {
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
  const address = fromBech32Address(token.address_bech32)
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
  const address = fromBech32Address(token.address_bech32)
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
  const address = fromBech32Address(token.address_bech32).toLowerCase()
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
  const address = fromBech32Address(token.address_bech32).toLowerCase()
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
 * Create a `GetSmartContractSubState` request for the carb stakers.
 *
 * @param string The wallet address.
 * @returns BatchRequest
 */
 export const carbonStakersBatchRequest = (walletAddress: string): BatchRequest => {
  return {
    type: BatchRequestType.CarbonStakers,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        carbStakingHash.replace("0x", "").toLowerCase(),
        "stakers",
        [fromBech32Address(walletAddress).toLowerCase()],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the port buoy stakers.
 *
 * @param string The wallet address.
 * @returns BatchRequest
 */
 export const portBuoyStakersBatchRequest = (walletAddress: string): BatchRequest => {
  return {
    type: BatchRequestType.PortBuoyStakers,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        portBuoyStakingHash.replace("0x", "").toLowerCase(),
        "stakers",
        [fromBech32Address(walletAddress).toLowerCase()],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the port dock stakers.
 *
 * @param string The wallet address.
 * @returns BatchRequest
 */
 export const portDockStakersBatchRequest = (walletAddress: string): BatchRequest => {
  return {
    type: BatchRequestType.PortDockStakers,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        portDockStakingHash.replace("0x", "").toLowerCase(),
        "stakers",
        [fromBech32Address(walletAddress).toLowerCase()],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the port dock stakers.
 *
 * @param string The wallet address.
 * @returns BatchRequest
 */
 export const xcadStakingRequest = (token: Token, contractAddress: string, walletAddress: string): BatchRequest => {
  return {
    type: BatchRequestType.XcadStaking,
    token: token,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        contractAddress.replace("0x", ""),
        "stakers_total_bal",
        [fromBech32Address(walletAddress).toLowerCase()],
      ],
    },
  };
}

/**
 * Create a `GetSmartContractSubState` request for the port dock stakers.
 *
 * @param string The wallet address.
 * @returns BatchRequest
 */
 export const okipadStakingBatchRequest = (walletAddress: string): BatchRequest => {
  return {
    type: BatchRequestType.OkipadStaking,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        okipadStakingHash.replace("0x", "").toLowerCase(),
        "stakers",
        [fromBech32Address(walletAddress).toLowerCase()],
      ],
    },
  };
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