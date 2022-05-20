import { fromBech32Address } from "@zilliqa-js/crypto";
import { CARBSWAP_ADDRESS, XCADDEX_ADDRESS, ZILALL_ADDRESS, ZILSWAP_ADDRESS } from "lib/constants";
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
  CarbonStakers = "carbonStakers",
  GraphStakers = "graphStakers",
  PortBuoyStakers = "portBuoyStakers",
  PortDockStakers = "portDockStakers",
  FeesBachelorStakers = "feesBachelorStakers",
  FeesMastersStakers = "feesMastersStakers",
  FeesDoctoralStakers = "feesDoctoralStakers",
  XcadStaking = "XcadStaking",
  OkipadStaking = "OkipadStaking",
  BloxStaking = "BloxStaking",
  DmzStaking = "DmzStaking",
  HunyBalances = "HunyBalances",
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

const carbStakingAddress = "zil18r37xks4r3rj7rzydujcckzlylftdy2qerszne"
const carbStakingHash = fromBech32Address(carbStakingAddress)

const grphStakingAddress = "zil1la9r6xxlth28rxmhuka0dgc7mpfnk4x5jwcw3l"
const grphStakingHash = fromBech32Address(grphStakingAddress)

const portBuoyStakingAddress = "zil1lkhea3egremrwtn4lfhsa4psk978k2sat3cs3u"
const portBuoyStakingHash = fromBech32Address(portBuoyStakingAddress)

const portDockStakingAddress = "zil1yhy3wm79cx8v9zyg7qecwa457w0ysupgvzk5pt"
const portDockStakingHash = fromBech32Address(portDockStakingAddress)

const okipadStakingAddress = "zil1eeahtrggk3m77nu40ltmaqdmtcyhdh9ujahgf6"
const okipadStakingHash = fromBech32Address(okipadStakingAddress)

const feesBachelorStakingAddress = "zil19hl9kaq3ddpqlr58qy8ewn9vcyueundmx22uyp"
const feesBachelorStakingHash = fromBech32Address(feesBachelorStakingAddress)

const feesMastersStakingAddress = "zil1yvnanl43330kfw272vxgu7yucctt0sk5syejln"
const feesMastersStakingHash = fromBech32Address(feesMastersStakingAddress)

const feesDoctoralStakingAddress = "zil1t40vh32v888m9s9e9uzrhgc6kj4030urquvylt"
const feesDoctoralStakingHash = fromBech32Address(feesDoctoralStakingAddress)

const bloxStakingAddress = "zil1heh4x9lhp2cuma9n8qvrap80ax900s9024dmlc"
const bloxStakingHash = fromBech32Address(bloxStakingAddress)

const dmzStakingAddress = "zil1g5fvu2png22fkdv9krdsamjuv45fp8y3ldqur6"
const dmzStakingHash = fromBech32Address(dmzStakingAddress)

const hunyHiveAddress = "zil10mmqxduremmhyz2j89qptk3x8f2srw8rqukf8y"
const hunyHiveHash = fromBech32Address(hunyHiveAddress)

export const xcadStakingAddresses = {
  0: ['zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f', '0xa397c1aa3054bdad8aecf645a2b582202eea57b9'], // dXCAD #1
  1: ['zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk', '0xb90c6392e2c550eaff55fdbc8101bf24cb6ec386'], // CARB
  2: ['zil18f5rlhqz9vndw4w8p60d0n7vg3n9sqvta7n6t2', '0xc6474b616fbb71fca8dcf4b09b5ea1b553231a4d'], // PORT
  3: ['zil1504065pp76uuxm7s9m2c4gwszhez8pu3mp6r8c', '0x5b1be8e077f4f2702b4fcff93dfefc6010bd2370'], // STREAM
  4: ['zil14jmjrkvfcz2uvj3y69kl6gas34ecuf2j5ggmye', '0xc78b6c4a7c13f1e556ee59af20c74f8c9156e6b6'], // REDC
  5: ['zil1pqcev4ykxla0jhy3anx32lnqgv8xncd8q57ql2', '0xcf87bd87e32e059533d0b6a2c575db3a5a83792c'], // SPW
  6: ['zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y', '0x0b719d791741d3937cea5b661c5d4699740a6063'], // XCAD
  7: ['zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y', '0x4522c41f5e60ec47a3e8bb2f8e73ca6cfc2be0b4'], // XCAD -> dXCAD
  8: ['zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y', '0x8d24baae9877d735900873834448373b8917da1f'], // XCAD -> dXCAD
  9: ['zil1jy3g5j9w5njqwxuuv3zwkz9syyueelmu7g080v', '0xa11cf5474cd132e6f1812c3e20ba47e51818cb62'], // FEES
  10: ['zil1gf5vxndx44q6fn025fwdaajnrmgvngdzel0jzp', '0xa7d9862dceead3bcd43811462118bff08737a03a'], // BLOX
  11: ['zil12jhxfcsfyaylhrf9gu8lc82ddgvudu4tzvduum', '0xa6994b8d8c5530d1996fd76f89df0523b893e5d0'], // Oki
  12: ['zil1n9z6pk3aca8rvndya2tfgmyexdsp8m44gpyrs3', '0xf5f4e66c65551a9a48dd146783ce0ec754836281'], // HOL
  13: ['zil19lr3vlpm4lufu2q94mmjvdkvmx8wdwajuntzx2', '0x4512ce283342949b3585b0db0eee5c6568909c91'], // DMZ
  14: ['zil1c6akv8k6dqaac7ft8ezk5gr2jtxrewfw8hc27d', '0xdc54428db01207524385ab07b418bf541efedabe'], // DUCK
  15: ['zil1kwfu3x9n6fsuxc4ynp72uk5rxge25enw7zsf9z', '0x62ceedfa70a34fcbeacebb6d76bcbf339ed47648'], // SCO
  16: ['zil1yqwyfdpxmp0m9suz2c6gx9qgyh7crwd42jz9j4', '0x0bf04c6ae283c9a054aa15dba4996f9246351929'], // zOPUL
  17: ['zil1xgeelgph77hpmlljtcfuv3g6sq5f6c05rl3wdn', '0x9695a2c7fa5ae141f1ed994d4fe04d1162c44427'], // zBRKL
  18: ['zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f', '0xda12fa83a9ce290eb5e1bbea6e51f5fca2955ae1'], // dXCAD #2
  19: ['zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y', '0x09c3db53d2303a1524eab790fc6ec470cde31193'], // XCAD 90 days
  20: ['zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y', '0x4baab6cff0709331c048bf9df20de87cb9bf2875'], // XCAD 120 days
  21: ['zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y', '0xca6f1ed57ea5d9a3adeaafc8298ff454a3cde46e'], // XCAD 180 days
  22: ['zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f', '0xf228bc7adf3ac09f828dd070d26750bfcfd291e4'] // dXCAD #3
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
 * Create a `GetSmartContractSubState` request for the carb stakers.
 *
 * @param string The wallet address.
 * @returns BatchRequest
 */
 export const graphStakersBatchRequest = (walletAddress: string): BatchRequest => {
  return {
    type: BatchRequestType.GraphStakers,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        grphStakingHash.replace("0x", "").toLowerCase(),
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
 export const feesBachelorsStakersBatchRequest = (walletAddress: string): BatchRequest => {
  return {
    type: BatchRequestType.FeesBachelorStakers,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        feesBachelorStakingHash.replace("0x", "").toLowerCase(),
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
 export const feesMastersStakersBatchRequest = (walletAddress: string): BatchRequest => {
  return {
    type: BatchRequestType.FeesMastersStakers,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        feesMastersStakingHash.replace("0x", "").toLowerCase(),
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
 export const feesDoctoralStakersBatchRequest = (walletAddress: string): BatchRequest => {
  return {
    type: BatchRequestType.FeesDoctoralStakers,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        feesDoctoralStakingHash.replace("0x", "").toLowerCase(),
        "removeStaker",
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
 * Create a `GetSmartContractSubState` request for the port dock stakers.
 *
 * @param string The wallet address.
 * @returns BatchRequest
 */
 export const bloxStakingBatchRequest = (walletAddress: string): BatchRequest => {
  return {
    type: BatchRequestType.BloxStaking,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        bloxStakingHash.replace("0x", "").toLowerCase(),
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
 export const dmzStakingBatchRequest = (walletAddress: string): BatchRequest => {
  return {
    type: BatchRequestType.DmzStaking,
    item: {
      ...requestParams,
      method: "GetSmartContractSubState",
      params: [
        dmzStakingHash.replace("0x", "").toLowerCase(),
        "stakers",
        [fromBech32Address(walletAddress).toLowerCase()],
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
  console.log(hunyHiveHash.replace("0x", "").toLowerCase(), walletAddr)
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