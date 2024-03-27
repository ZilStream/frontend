import React, { useState } from "react";
import { numberFormat } from "utils/format";
import { Info } from "react-feather";
import Tippy from "@tippyjs/react";
import { Token } from "store/types";

interface Props {
  token: Token;
}

const Supply = (props: Props) => {
  const [showPopup, setShowPopup] = useState(false);

  const percentage =
    (props.token.market_data.current_supply /
      props.token.market_data.max_supply) *
    100;
  const burnedPercentage =
    (props.token.market_data.burned_supply /
      props.token.market_data.max_supply) *
    100;
  const excludedAddresses =
    props.token.supply_skip_addresses != ""
      ? props.token.supply_skip_addresses.split(",")
      : [];

  const SupplyInfo = (
    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md text-sm">
      <div className="mb-2">
        The amount of tokens that are currently circulating in the market.
      </div>
      <div className="flex items-center">
        <div className="flex-grow">Initial Supply:</div>
        <div className="font-semibold">
          {numberFormat(props.token.market_data.init_supply, 0)}
        </div>
      </div>

      {props.token.market_data.total_supply !=
        props.token.market_data.max_supply && (
        <div className="flex items-center">
          <div className="flex-grow">Total Supply:</div>
          <div className="font-semibold">
            {numberFormat(props.token.market_data.total_supply, 0)}
          </div>
        </div>
      )}

      <div className="flex items-center">
        <div className="flex-grow">Burned Supply:</div>
        <div className="font-semibold">
          {numberFormat(props.token.market_data.burned_supply, 0)}
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex-grow">Undistributed Supply:</div>
        <div className="font-semibold">
          {numberFormat(
            props.token.market_data.max_supply -
              props.token.market_data.current_supply -
              props.token.market_data.burned_supply,
            0
          )}
        </div>
      </div>

      {props.token.market_data.max_supply > 0 ? (
        <div className="flex items-center">
          <div className="flex-grow">Max Supply:</div>
          <div className="font-semibold">
            {numberFormat(props.token.market_data.max_supply, 0)}
          </div>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="flex-grow">Max Supply:</div>
          <div className="font-semibold">No data</div>
        </div>
      )}

      {excludedAddresses.length > 0 && (
        <div className="mt-4 text-xs">
          <div>Excluded addresses:</div>
          {excludedAddresses.map((address) => {
            return (
              <div key={address} className="text-gray-600 dark:text-gray-400">
                {address}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (
    !props.token.market_data.max_supply &&
    props.token.market_data.max_supply == 0
  ) {
    return (
      <div className="relative">
        <div className="mb-2 flex items-center">
          <div className="flex-grow font-medium">
            {numberFormat(props.token.market_data.current_supply, 0)}{" "}
            {props.token.symbol}
          </div>
          <Tippy content={SupplyInfo}>
            <button className="ml-2 focus:outline-none">
              <Info size={14} className="text-gray-500" />
            </button>
          </Tippy>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-2 flex items-center">
        <div className="flex-grow font-medium">
          {numberFormat(props.token.market_data.current_supply, 0)}{" "}
          {props.token.symbol}
        </div>
        <div className="font-medium">{numberFormat(percentage, 0)}%</div>
        <Tippy content={SupplyInfo}>
          <button className="ml-2 focus:outline-none">
            <Info size={14} className="text-gray-500" />
          </button>
        </Tippy>
      </div>
      <div className="h-3 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-700 flex">
        <div
          className="h-full bg-green-500"
          style={{ width: numberFormat(percentage, 0) + "%" }}
        ></div>
        <div className="flex-grow"></div>
        <div
          className="h-full bg-red-500"
          style={{ width: numberFormat(burnedPercentage, 0) + "%" }}
        ></div>
      </div>
    </div>
  );
};

export default Supply;
