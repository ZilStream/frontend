import { fromBech32Address } from "@zilliqa-js/crypto";
import { Operator, Token } from "store/types";
import { Network } from "./network";
import { Node, TestnetNode } from "./node";

export enum BatchRequestType {
  Balance = "balance",
  TokenBalance = "tokenBalance",
  TokenAllowance = "tokenAllowance",
  Pools = "pools",
  PoolBalance = "poolBalance",
  TotalContributions = "totalContributions",
  StakingOperators = "stakingOperators",
  StakingDelegators = "stakingDelegators",
  CarbonStakers = "carbonStakers",
  PortBuoyStakers = "portBuoyStakers",
  PortDockStakers = "portDockStakers"
};

const zilSwapAddress = "zil1hgg7k77vpgpwj3av7q7vv5dl4uvunmqqjzpv2w"
const zilSwapHash = fromBech32Address(zilSwapAddress)

const stakingAddress = "zil15lr86jwg937urdeayvtypvhy6pnp6d7p8n5z09"
const stakingHash = fromBech32Address(stakingAddress)

const carbStakingAddress = "zil18r37xks4r3rj7rzydujcckzlylftdy2qerszne"
const carbStakingHash = fromBech32Address(carbStakingAddress)

const portBuoyStakingAddress = "zil1lkhea3egremrwtn4lfhsa4psk978k2sat3cs3u"
const portBuoyStakingHash = fromBech32Address(portBuoyStakingAddress)

const portDockStakingAddress = "zil1yhy3wm79cx8v9zyg7qecwa457w0ysupgvzk5pt"
const portDockStakingHash = fromBech32Address(portDockStakingAddress)

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
      id: "1",
      jsonrpc: "2.0",
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
      id: "1",
      jsonrpc: "2.0",
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
      id: "1",
      jsonrpc: "2.0",
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
      id: "1",
      jsonrpc: "2.0",
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
    token: undefined,
    item: {
      id: "1",
      jsonrpc: "2.0",
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
      id: "1",
      jsonrpc: "2.0",
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
 * Create a `GetSmartContractSubState` request for the staking operators.
 *
 * @returns BatchRequest
 */
 export const stakingOperatorsBatchRequest = (): BatchRequest => {
  return {
    type: BatchRequestType.StakingOperators,
    token: undefined,
    item: {
      id: "1",
      jsonrpc: "2.0",
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
    token: undefined,
    item: {
      id: "1",
      jsonrpc: "2.0",
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
    token: undefined,
    item: {
      id: "1",
      jsonrpc: "2.0",
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
    token: undefined,
    item: {
      id: "1",
      jsonrpc: "2.0",
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
    token: undefined,
    item: {
      id: "1",
      jsonrpc: "2.0",
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