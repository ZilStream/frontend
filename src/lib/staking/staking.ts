import { fromBech32Address } from "@zilliqa-js/zilliqa"
import { BatchRequest, BatchRequestType, requestParams } from "utils/batch"

export interface StakingContract {
  address: string
  token: string
  token_symbol: string
  token_decimals: number
  reward_token: string
  name?: string
  statePath: string
  cumulativeValues?: boolean
}

const stakingContracts: StakingContract[] = [
  {
    address: "zil18r37xks4r3rj7rzydujcckzlylftdy2qerszne",
    token: "zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk",
    token_symbol: "CARB",
    token_decimals: 8,
    reward_token: "zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk",
    name: "Carbon",
    statePath: "stakers",
  },
  {
    address: "zil1la9r6xxlth28rxmhuka0dgc7mpfnk4x5jwcw3l",
    token: "zil1xnnhly0m4qxx240a7j3rlvfj4wavaz40wlgd80",
    token_symbol: "GRPH",
    token_decimals: 8,
    reward_token: "zil1xnnhly0m4qxx240a7j3rlvfj4wavaz40wlgd80",
    name: "Graph",
    statePath: "stakers",
  },
  {
    address: "zil1lkhea3egremrwtn4lfhsa4psk978k2sat3cs3u",
    token: "zil18f5rlhqz9vndw4w8p60d0n7vg3n9sqvta7n6t2",
    token_symbol: "PORT",
    token_decimals: 4,
    reward_token: "zil18f5rlhqz9vndw4w8p60d0n7vg3n9sqvta7n6t2",
    name: "PORT: The Buoy",
    statePath: "stakers",
  },
  {
    address: "zil1yhy3wm79cx8v9zyg7qecwa457w0ysupgvzk5pt",
    token: "zil18f5rlhqz9vndw4w8p60d0n7vg3n9sqvta7n6t2",
    token_symbol: "PORT",
    token_decimals: 4,
    reward_token: "zil18f5rlhqz9vndw4w8p60d0n7vg3n9sqvta7n6t2",
    name: "PORT: The Dock",
    statePath: "stakers",
  },
  {
    address: "zil1eeahtrggk3m77nu40ltmaqdmtcyhdh9ujahgf6",
    token: "zil12jhxfcsfyaylhrf9gu8lc82ddgvudu4tzvduum",
    token_symbol: "Oki",
    token_decimals: 5,
    reward_token: "zil12jhxfcsfyaylhrf9gu8lc82ddgvudu4tzvduum",
    name: "Okipad",
    statePath: "stakers",
  },
  {
    address: "zil19hl9kaq3ddpqlr58qy8ewn9vcyueundmx22uyp",
    token: "zil1jy3g5j9w5njqwxuuv3zwkz9syyueelmu7g080v",
    token_symbol: "FEES",
    token_decimals: 4,
    reward_token: "zil1jy3g5j9w5njqwxuuv3zwkz9syyueelmu7g080v",
    name: "FEES: Bachelor",
    statePath: "stakers",
  },
  {
    address: "zil1yvnanl43330kfw272vxgu7yucctt0sk5syejln",
    token: "zil1jy3g5j9w5njqwxuuv3zwkz9syyueelmu7g080v",
    token_symbol: "FEES",
    token_decimals: 4,
    reward_token: "zil1jy3g5j9w5njqwxuuv3zwkz9syyueelmu7g080v",
    name: "FEES: Masters",
    statePath: "stakers",
  },
  {
    address: "zil1t40vh32v888m9s9e9uzrhgc6kj4030urquvylt",
    token: "zil1jy3g5j9w5njqwxuuv3zwkz9syyueelmu7g080v",
    token_symbol: "FEES",
    token_decimals: 4,
    reward_token: "zil1jy3g5j9w5njqwxuuv3zwkz9syyueelmu7g080v",
    name: "FEES: Doctoral",
    statePath: "removeStaker",
  },
  {
    address: "zil1heh4x9lhp2cuma9n8qvrap80ax900s9024dmlc",
    token: "zil1gf5vxndx44q6fn025fwdaajnrmgvngdzel0jzp",
    token_symbol: "BLOX",
    token_decimals: 2,
    reward_token: "zil1gf5vxndx44q6fn025fwdaajnrmgvngdzel0jzp",
    name: "BLOX",
    statePath: "stakers",
  },
  {
    address: "zil1g5fvu2png22fkdv9krdsamjuv45fp8y3ldqur6",
    token: "zil19lr3vlpm4lufu2q94mmjvdkvmx8wdwajuntzx2",
    token_symbol: "DMZ",
    token_decimals: 18,
    reward_token: "zil19lr3vlpm4lufu2q94mmjvdkvmx8wdwajuntzx2",
    name: "DMZ",
    statePath: "stakers",
  },
  {
    address: "zil10pt00wklns2aetdnfvg4fe9ng65ser42z2cwuk",
    token: "zil1xxl6yp2twxvljdnn87g9fk7wykdrcv66xdy4rc",
    token_symbol: "Lunr",
    token_decimals: 4,
    reward_token: "zil1xxl6yp2twxvljdnn87g9fk7wykdrcv66xdy4rc",
    name: "LunrFi 1-month",
    statePath: "stakes",
    cumulativeValues: true
  },
  {
    address: "zil1eft78svmxf0cxn82ysdtxxs6ky8e85xnzfvzrh",
    token: "zil1xxl6yp2twxvljdnn87g9fk7wykdrcv66xdy4rc",
    token_symbol: "Lunr",
    token_decimals: 4,
    reward_token: "zil1xxl6yp2twxvljdnn87g9fk7wykdrcv66xdy4rc",
    name: "LunrFi 3-month",
    statePath: "stakes",
    cumulativeValues: true
  },
  {
    address: "zil1dt57qg37zmxzm58tvdx8rvyrk09zpsxwc77hpp",
    token: "zil1xxl6yp2twxvljdnn87g9fk7wykdrcv66xdy4rc",
    token_symbol: "Lunr",
    token_decimals: 4,
    reward_token: "zil1xxl6yp2twxvljdnn87g9fk7wykdrcv66xdy4rc",
    name: "LunrFi 6-month",
    statePath: "stakes",
    cumulativeValues: true
  },
  {
    address: "zil1qs6ppsy0p6rnaqznx3zs9q4rafmu4p8qtm3pdd",
    token: "zil1xxl6yp2twxvljdnn87g9fk7wykdrcv66xdy4rc",
    token_symbol: "Lunr",
    token_decimals: 4,
    reward_token: "zil1xxl6yp2twxvljdnn87g9fk7wykdrcv66xdy4rc",
    name: "LunrFi 12-month",
    statePath: "stakes",
    cumulativeValues: true
  },

  // XCAD DEX SAS
  {
    address: "zil15wtur23s2j76mzhv7ez69dvzyqhw54aerlwpna",
    token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    token_symbol: "dXCAD",
    token_decimals: 18,
    reward_token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    name: "XCAD DEX: dXCAD",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil1hyxx8yhzc4gw4l64lk7gzqdlyn9kasux3mmfl9",
    token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    token_symbol: "dXCAD",
    token_decimals: 18,
    reward_token: "zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk",
    name: "XCAD DEX: CARB",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil1hyxx8yhzc4gw4l64lk7gzqdlyn9kasux3mmfl9",
    token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    token_symbol: "dXCAD",
    token_decimals: 18,
    reward_token: "zil1cer5kct0hdcle2xu7jcfkh4pk4fjxxjd82ther",
    name: "XCAD DEX: PORT",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil1tvd73crh7ne8q260elunmlhuvqgt6gmsw3vn9y",
    token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    token_symbol: "dXCAD",
    token_decimals: 18,
    reward_token: "zil1504065pp76uuxm7s9m2c4gwszhez8pu3mp6r8c",
    name: "XCAD DEX: STREAM",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil1c79kcjnuz0c724hwtxhjp3603jg4de4k350kxq",
    token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    token_symbol: "dXCAD",
    token_decimals: 18,
    reward_token: "zil1504065pp76uuxm7s9m2c4gwszhez8pu3mp6r8c",
    name: "XCAD DEX: REDC",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil1pdce67ghg8fexl82tdnpch2xn96q5crrhnugwq",
    token: "zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y",
    token_symbol: "XCAD",
    token_decimals: 18,
    reward_token: "zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y",
    name: "XCAD DEX: XCAD -> XCAD",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil1g53vg867vrky0glghvhcuu72dn7zhc95nhpuqx",
    token: "zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y",
    token_symbol: "XCAD",
    token_decimals: 18,
    reward_token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    name: "XCAD DEX: XCAD -> dXCAD",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil135jt4t5cwltntyqgwwp5gjph8wy30kslsdljsz",
    token: "zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y",
    token_symbol: "XCAD",
    token_decimals: 18,
    reward_token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    name: "XCAD DEX: XCAD -> dXCAD",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil15yw0236v6yewduvp9slzpwj8u5vp3jmz4mfy3x",
    token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    token_symbol: "dXCAD",
    token_decimals: 18,
    reward_token: "zil1jy3g5j9w5njqwxuuv3zwkz9syyueelmu7g080v",
    name: "XCAD DEX: FEES",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil15lvcvtwwatfme4pcz9rzzx9l7zrn0gp6tfe0sz",
    token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    token_symbol: "dXCAD",
    token_decimals: 18,
    reward_token: "zil1gf5vxndx44q6fn025fwdaajnrmgvngdzel0jzp",
    name: "XCAD DEX: BLOX",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil156v5hrvv25cdrxt06ahcnhc9ywuf8ewstqrl6w",
    token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    token_symbol: "dXCAD",
    token_decimals: 18,
    reward_token: "zil12jhxfcsfyaylhrf9gu8lc82ddgvudu4tzvduum",
    name: "XCAD DEX: Oki",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil17h6wvmr925df5jxaz3nc8nswca2gxc5pa64qu2",
    token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    token_symbol: "dXCAD",
    token_decimals: 18,
    reward_token: "zil1n9z6pk3aca8rvndya2tfgmyexdsp8m44gpyrs3",
    name: "XCAD DEX: HOL",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil1g5fvu2png22fkdv9krdsamjuv45fp8y3ldqur6",
    token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    token_symbol: "dXCAD",
    token_decimals: 18,
    reward_token: "zil19lr3vlpm4lufu2q94mmjvdkvmx8wdwajuntzx2",
    name: "XCAD DEX: DMZ",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil1m32y9rdszgr4ysu94vrmgx9l2s00ak47slsf3d",
    token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    token_symbol: "dXCAD",
    token_decimals: 18,
    reward_token: "zil1c6akv8k6dqaac7ft8ezk5gr2jtxrewfw8hc27d",
    name: "XCAD DEX: DUCK",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil1vt8wm7ns5d8uh6kwhdkhd09lxw0dgajgwqv37p",
    token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    token_symbol: "dXCAD",
    token_decimals: 18,
    reward_token: "zil1kwfu3x9n6fsuxc4ynp72uk5rxge25enw7zsf9z",
    name: "XCAD DEX: SCO",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil1p0cyc6hzs0y6q492zhd6fxt0jfrr2xffvalxtl",
    token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    token_symbol: "dXCAD",
    token_decimals: 18,
    reward_token: "zil1yqwyfdpxmp0m9suz2c6gx9qgyh7crwd42jz9j4",
    name: "XCAD DEX: zOPUL",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil1j62693l6tts5ru0dn9x5lczdz93vg3p8y7nr9r",
    token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    token_symbol: "dXCAD",
    token_decimals: 18,
    reward_token: "zil1xgeelgph77hpmlljtcfuv3g6sq5f6c05rl3wdn",
    name: "XCAD DEX: zBRKL",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil1mgf04qafec5sad0ph04xu504lj3f2khp8zqgjy",
    token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    token_symbol: "dXCAD",
    token_decimals: 18,
    reward_token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    name: "XCAD DEX: dXCAD",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil1p8pak57jxqap2f82k7g0cmkywrx7xyvnmj4cep",
    token: "zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y",
    token_symbol: "XCAD",
    token_decimals: 18,
    reward_token: "zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y",
    name: "XCAD DEX: XCAD 90 days",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil1fw4tdnlswzfnrszgh7wlyr0g0jum72r4mhqecm",
    token: "zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y",
    token_symbol: "XCAD",
    token_decimals: 18,
    reward_token: "zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y",
    name: "XCAD DEX: XCAD 120 days",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil1efh3a4t75hv68t024lyznrl52j3umerwwfvr6f",
    token: "zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y",
    token_symbol: "XCAD",
    token_decimals: 18,
    reward_token: "zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y",
    name: "XCAD DEX: XCAD 180 days",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil1y2zmxxmflcjf5ce58z8qg3ucl4j969asnuc7ft",
    token: "zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y",
    token_symbol: "XCAD",
    token_decimals: 18,
    reward_token: "zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y",
    name: "XCAD DEX: XCAD 180 days",
    statePath: "stakers_total_bal",
  },
  {
    address: "zil17g5tc7kl8tqflq5d6pcdye6shl8a9y0yyp06c0",
    token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    token_symbol: "dXCAD",
    token_decimals: 18,
    reward_token: "zil1xfcg9hfpdlmz2aytz0s4dww35hfa6s0jnjut5f",
    name: "XCAD DEX: dXCAD",
    statePath: "stakers_total_bal",
  }
]

export const stakingBatchRequests = (walletAddress: string): BatchRequest[] => {
  var reqs: BatchRequest[] = []

  stakingContracts.forEach(contract => {
    reqs.push({
      type: BatchRequestType.Staking,
      stakingContract: contract,
      item: {
        ...requestParams,
        method: "GetSmartContractSubState",
        params: [
          fromBech32Address(contract.address).replace("0x", "").toLowerCase(),
          contract.statePath,
          [fromBech32Address(walletAddress).toLowerCase()]
        ]
      }
    })
  })

  return reqs
}

