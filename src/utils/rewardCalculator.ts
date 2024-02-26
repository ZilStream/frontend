import BN from "bn.js";
import { STAKING_SSNLIST_ADDRESS } from "lib/constants";

const { Zilliqa } = require("@zilliqa-js/zilliqa");

const KEY_LAST_REWARD_CYCLE = "lastrewardcycle";
const KEY_DIRECT_DEPOSIT_DELEG = "direct_deposit_deleg";
const KEY_BUFF_DEPOSIT_DELEG = "buff_deposit_deleg";
const KEY_STAKE_SSN_PER_CYCLE = "stake_ssn_per_cycle";
const KEY_LAST_WITHDRAW_CYCLE = "last_withdraw_cycle_deleg";
const KEY_DELEG_PER_CYCLE = "deleg_stake_per_cycle";
const API_MAX_ATTEMPT = 3;

let rewardCalculator: RewardCalculator | null;

export const computeDelegRewardsExec = async (
  impl: string,
  networkURL: string,
  ssn: string,
  delegator: string
) => {
  if (!rewardCalculator) {
    rewardCalculator = new RewardCalculator(networkURL, impl);
    try {
      await rewardCalculator.compute_maps();
    } catch (err) {
      // error with fetching; api error
      // set to null to re-declare a new object with a new api
      rewardCalculator = null;
      throw err;
    }
  }
  return await rewardCalculator.get_rewards(ssn, delegator);
};

export const computeDelegRewards = async (ssn: string, delegator: string) => {
  let result;

  for (let attempt = 0; attempt < API_MAX_ATTEMPT; attempt++) {
    try {
      result = await computeDelegRewardsExec(
        STAKING_SSNLIST_ADDRESS,
        "https://api.zilliqa.com",
        ssn,
        delegator
      );
      break;
    } catch (err) {
      // error with querying api
      // retry
      console.log(err);
      continue;
    }
  }

  return result;
};

export class RewardCalculator {
  zilliqa: any;
  contract: any;
  last_reward_cycle_json: any;

  constructor(url: String, ssnlist: String) {
    this.zilliqa = new Zilliqa(url);
    this.contract = this.zilliqa.contracts.at(ssnlist);
  }

  // store the required maps first
  async compute_maps() {
    this.last_reward_cycle_json = await this.contract.getSubState(
      KEY_LAST_REWARD_CYCLE
    );
  }

  async get_rewards(ssnaddr: string, delegator: string) {
    console.log("get rewards", delegator, ssnaddr);
    const last_withdraw_cycle_map = await this.contract.getSubState(
      KEY_LAST_WITHDRAW_CYCLE,
      [delegator.toLowerCase()]
    );
    const reward_list = await this.get_reward_cycle_list(
      last_withdraw_cycle_map,
      this.last_reward_cycle_json,
      ssnaddr,
      delegator
    );
    const delegate_per_cycle = await this.combine_buff_direct(
      ssnaddr,
      delegator,
      reward_list
    );
    const need_list = await this.get_reward_need_cycle_list(
      last_withdraw_cycle_map,
      this.last_reward_cycle_json,
      ssnaddr,
      delegator
    );
    const rewards = await this.calculate_rewards(
      ssnaddr,
      delegate_per_cycle,
      need_list
    );
    return rewards;
  }

  // get reward cycle list
  async get_reward_cycle_list(
    last_withdraw_cycle_map: any,
    last_reward_cycle_json: any,
    ssnaddr: string,
    delegator: string
  ) {
    // remove this
    // console.log(last_withdraw_cycle_map);

    if (
      last_withdraw_cycle_map !== null &&
      last_withdraw_cycle_map[KEY_LAST_WITHDRAW_CYCLE][delegator][ssnaddr] !==
        undefined
    ) {
      const last_reward_cycle = Number.parseInt(
        last_reward_cycle_json[KEY_LAST_REWARD_CYCLE]
      );
      let result_list = [];
      let i = 1;
      for (i; i <= last_reward_cycle; i++) {
        result_list.push(i);
      }

      return result_list;
    } else {
      return [];
    }
  }

  // to get those cycles need to calculte rewards
  async get_reward_need_cycle_list(
    last_withdraw_cycle_map: any,
    last_reward_cycle_json: any,
    ssnaddr: string,
    delegator: string
  ) {
    // get last_reward_cycle;
    const last_reward_cycle = last_reward_cycle_json[KEY_LAST_REWARD_CYCLE];

    // get last_withdraw_cycle_deleg
    if (last_withdraw_cycle_map === null) {
      return [];
    }
    const last_withdraw_cycle =
      last_withdraw_cycle_map[KEY_LAST_WITHDRAW_CYCLE][delegator][ssnaddr];

    // to filter those elements that meet
    // last_withdraw_cycle < elements <= last_reward_cycle
    const reward_cycle_list_reverse = await this.get_reward_cycle_list(
      last_withdraw_cycle_map,
      last_reward_cycle_json,
      ssnaddr,
      delegator
    );
    const cycle_need_to_calculate = reward_cycle_list_reverse.filter(
      (c) =>
        c > Number.parseInt(last_withdraw_cycle) &&
        c <= Number.parseInt(last_reward_cycle)
    );
    return cycle_need_to_calculate;
  }

  // to combine buffered deposit map and direct deposit map
  // eventually get the actual delegate amount of every cycle for this particular ssn operator
  async combine_buff_direct(
    ssnaddr: string,
    delegator: string,
    reward_list: number[]
  ) {
    const result_map = new Map<number, BN>();

    const direct_deposit_json = await this.contract.getSubState(
      KEY_DIRECT_DEPOSIT_DELEG,
      [delegator.toLowerCase(), ssnaddr]
    );
    const buffer_deposit_json = await this.contract.getSubState(
      KEY_BUFF_DEPOSIT_DELEG,
      [delegator.toLowerCase(), ssnaddr]
    );
    const deleg_stake_per_cycle_json = await this.contract.getSubState(
      KEY_DELEG_PER_CYCLE,
      [delegator.toLowerCase(), ssnaddr]
    );

    let direct_deposit_map: any = null;
    let buffer_deposit_map: any = null;
    let deleg_stake_per_cycle_map: any = null;

    if (direct_deposit_json !== null) {
      direct_deposit_map =
        direct_deposit_json[KEY_DIRECT_DEPOSIT_DELEG][delegator.toLowerCase()][
          ssnaddr
        ];
    }

    if (buffer_deposit_json !== null) {
      buffer_deposit_map =
        buffer_deposit_json[KEY_BUFF_DEPOSIT_DELEG][delegator.toLowerCase()][
          ssnaddr
        ];
    }

    if (deleg_stake_per_cycle_json !== null) {
      deleg_stake_per_cycle_map =
        deleg_stake_per_cycle_json[KEY_DELEG_PER_CYCLE][
          delegator.toLowerCase()
        ][ssnaddr];
    }

    reward_list.forEach((cycle: number) => {
      // for every reward cycle, we need to get
      // 1. cycle - 1 in direct deposit
      // 2. cycle - 2 in buffered deposit
      // 3. accumulate last result to get total amount for this cycle
      const c1 = cycle - 1;
      const c2 = cycle - 2;
      let hist_amt = new BN(0);
      if (
        deleg_stake_per_cycle_map !== null &&
        deleg_stake_per_cycle_map[c1.toString()] !== undefined
      ) {
        hist_amt = new BN(deleg_stake_per_cycle_map[c1.toString()]);
      }

      let dir_amt = new BN(0);
      if (
        direct_deposit_map !== null &&
        direct_deposit_map[c1.toString()] !== undefined
      ) {
        dir_amt = new BN(direct_deposit_map[c1.toString()]);
      }

      let buf_amt = new BN(0);
      if (
        buffer_deposit_map !== null &&
        buffer_deposit_map[c2.toString()] !== undefined
      ) {
        buf_amt = new BN(buffer_deposit_map[c2.toString()]);
      }

      let total_amt_tmp = dir_amt.add(buf_amt);
      total_amt_tmp = total_amt_tmp.add(hist_amt);
      const last_amt = result_map.get(c1);
      if (last_amt !== undefined) {
        const total_amt = total_amt_tmp.add(last_amt);
        result_map.set(cycle, total_amt);
      } else {
        result_map.set(cycle, total_amt_tmp);
      }
    });
    return result_map;
  }

  async calculate_rewards(
    ssnaddr: string,
    delegate_per_cycle: Map<number, BN>,
    need_list: number[]
  ) {
    var result_rewards = new BN(0);

    const stake_ssn_per_cycle_map = await this.contract.getSubState(
      KEY_STAKE_SSN_PER_CYCLE,
      [ssnaddr]
    );

    if (stake_ssn_per_cycle_map === null) {
      return result_rewards;
    }
    need_list.forEach((cycle: number) => {
      const cycle_info =
        stake_ssn_per_cycle_map[KEY_STAKE_SSN_PER_CYCLE][ssnaddr][cycle];

      if (cycle_info === undefined) {
        // no rewards for this cycle, just skip
      } else {
        const total_rewards = new BN(cycle_info["arguments"][1]);
        const total_stake = new BN(cycle_info["arguments"][0]);

        let deleg_amt: any = delegate_per_cycle.get(cycle);

        if (deleg_amt !== undefined) {
          const rewards_tmp = deleg_amt.mul(total_rewards);
          const rewards = rewards_tmp.div(total_stake);
          result_rewards = result_rewards.add(rewards);
        }
      }
    });

    return result_rewards;
  }
}
