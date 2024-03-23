import React from "react";
import { AiFillWarning } from "react-icons/ai";
import { useWallet } from "@/store/hooks";

export default function Bills({ networkFee, pricing }) {
  const { price } = useWallet();

  return (
    <>
      <hr className="w-[80%] mt-3 mx-auto" />
      <div className="pt-2">
        <div className="grid grid-cols-2 font-light py-1 text-sm">
          <p className="text-right pr-2 ">
            Network fee ({pricing?.prices?.shibescriptionCostsBySize.length}):
          </p>
          <p className="text-left pl-2 ">
            {pricing?.prices?.shibescriptionCostsBySize.length} * {networkFee} ={" "}
            {(
              pricing?.prices?.shibescriptionCostsBySize.length * networkFee
            ).toFixed(0)}{" "}
            shibes
            <span className="text-[11px] text-gray-300 ">
              &nbsp; ~$&nbsp;
              {(
                ((pricing?.prices?.shibescriptionCostsBySize.length *
                  networkFee) /
                  10 ** 8) *
                price
              ).toFixed(2)}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 font-light py-1 text-sm">
          <p className="text-right pr-2 ">
            shibes in inscription (
            {pricing?.prices?.shibescriptionCostsBySize.length}):
          </p>
          <p className="text-left pl-2 ">
            {pricing?.prices?.shibescriptionCostsBySize.length} * {75000} ={" "}
            {(
              pricing?.prices?.shibescriptionCostsBySize.length * 75000
            ).toFixed(0)}{" "}
            shibes
            <span className="text-[11px] text-gray-300 ">
              &nbsp; ~$&nbsp;
              {(
                ((pricing?.prices?.shibescriptionCostsBySize.length * 75000) /
                  10 ** 8) *
                price
              ).toFixed(2)}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 font-light py-1  text-sm">
          <p className="text-right pr-2">Service Fee:</p>
          <p className="text-left pl-2">
            {pricing?.prices?.totalServiceFee} shibes
            <span className=" text-[11px] text-gray-300 ">
              &nbsp;~${" "}
              {((pricing?.prices?.totalServiceFee / 10 ** 8) * price).toFixed(
                2
              )}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 font-light py-1  text-sm">
          <p className="text-right pr-2">=</p>
          <p className="text-left pl-2">
            <span className="line-through"> {pricing?.prices?.totalFee}</span>{" "}
            shibes
            <span className=" text-[11px] text-gray-300 ">
              &nbsp;~${" "}
              {((pricing?.prices?.totalFee / 10 ** 8) * price).toFixed(2)}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 font-light py-1 mt-3  text-sm">
          <p className="text-right pr-2">Total Fee:</p>
          <p className="text-left pl-2">
            {pricing?.prices?.totalFee / 10 ** 8} doge
            <span className=" text-[11px] text-gray-300 ">
              &nbsp;~$
              {((pricing?.prices?.totalFee / 10 ** 8) * price).toFixed(2)}
            </span>
          </p>
        </div>
      </div>

      <div className="text-sm font-extralight flex justify-center w-full mt-3 text-yellow-500">
        <p className="flex gap-1 text-center">
          <AiFillWarning className="text-lg ml-auto" />
          Please note the inscribing transaction delivers the inscription to the
          receiving address directly.
        </p>
      </div>
    </>
  );
}
