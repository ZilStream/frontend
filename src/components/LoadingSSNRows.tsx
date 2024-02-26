import React from "react";
import Shimmer from "./Shimmer";

const LoadingSSNRows = () => {
  return (
    <>
      <tr
        role="row"
        className="text-sm border-b dark:border-gray-700 last:border-b-0"
      >
        <td className="pl-5 pr-2 py-4 rounded-tl-lg">
          <Shimmer className="h-6 w-full" />
        </td>
        <td className="px-2 py-4 font-semibold text-left flex items-center">
          <Shimmer className="h-6 w-full" />
        </td>
        <td className="px-2 py-4 font-normal text-right">
          <Shimmer className="h-6 w-full" />
        </td>
        <td className="px-2 py-4 font-normal text-right">
          <Shimmer className="h-6 w-full" />
        </td>
        <td className="px-2 py-4 font-normal text-right">
          <Shimmer className="h-6 w-full" />
        </td>
        <td className="pl-2 pr-3 py-4 text-right rounded-tr-lg">
          <Shimmer className="h-6 w-full" />
        </td>
      </tr>
      <tr
        role="row"
        className="text-sm border-b dark:border-gray-700 last:border-b-0"
      >
        <td className="pl-5 pr-2 py-4">
          <Shimmer className="h-6 w-full" />
        </td>
        <td className="px-2 py-4 font-semibold text-left flex items-center">
          <Shimmer className="h-6 w-full" />
        </td>
        <td className="px-2 py-4 font-normal text-right">
          <Shimmer className="h-6 w-full" />
        </td>
        <td className="px-2 py-4 font-normal text-right">
          <Shimmer className="h-6 w-full" />
        </td>
        <td className="px-2 py-4 font-normal text-right">
          <Shimmer className="h-6 w-full" />
        </td>
        <td className="pl-2 pr-3 py-4 text-right">
          <Shimmer className="h-6 w-full" />
        </td>
      </tr>
      <tr
        role="row"
        className="text-sm border-b dark:border-gray-700 last:border-b-0"
      >
        <td className="pl-5 pr-2 py-4 rounded-bl-lg">
          <Shimmer className="h-6 w-full" />
        </td>
        <td className="px-2 py-4 font-semibold text-left flex items-center">
          <Shimmer className="h-6 w-full" />
        </td>
        <td className="px-2 py-4 font-normal text-right">
          <Shimmer className="h-6 w-full" />
        </td>
        <td className="px-2 py-4 font-normal text-right">
          <Shimmer className="h-6 w-full" />
        </td>
        <td className="px-2 py-4 font-normal text-right">
          <Shimmer className="h-6 w-full" />
        </td>
        <td className="pl-2 pr-3 py-4 text-right rounded-br-lg">
          <Shimmer className="h-6 w-full" />
        </td>
      </tr>
    </>
  );
};

export default LoadingSSNRows;
