import React, { useState } from "react";
import Head from "next/head";
import Layout from "@/components/sections/layouts/Layout";

const Inscribe = () => {
  const [type, setType] = useState("swap");

  const renderContent = () => {
    if (type === "swap") {
      return (
        <div className="dark:bg-slate-800 bg-gray-200 rounded-md p-2">
          <div className="rounded-md dark:bg-slate-900 bg-gray-100 p-4">
            <p className="text-[12px] dark:text-gray-200 text-gray-800">
              You pay
            </p>

            <div className="flex justify-between w-full">
              <input
                type="number"
                className="h-full bg-transparent text-3xl py-1 font-semibold focus:outline-none w-full hide-number-btn"
                placeholder="0.00"
              />
              <div className="p-2 dark:bg-slate-800 bg-gray-200 rounded-md flex gap-2 items-center w-[150px] cursor-pointer">
                <img src="/logo.png" alt="" className="w-[28px] h-[28px]" />
                <p> $DPAY</p>
              </div>
            </div>

            <p className="text-[12px] dark:text-gray-200 text-gray-800">
              $ 4454.3
            </p>
          </div>

          <div className="w-full relative h-[8px]">
            <div className="p-2 rounded-md dark:bg-slate-800 bg-gray-200 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer duration-300">
              <div className="dark:bg-slate-900 bg-gray-100 rounded-md text-[12px] px-4 py-2">
                SWAP
              </div>
            </div>
          </div>

          <div className="rounded-md dark:bg-slate-900 bg-gray-100 p-4">
            <p className="text-[12px] dark:text-gray-200 text-gray-800">
              You receive
            </p>

            <div className="flex justify-between w-full">
              <input
                type="number"
                className="h-full bg-transparent text-3xl py-1 font-semibold focus:outline-none w-full hide-number-btn"
                placeholder="0.00"
              />
              <div className="p-2 dark:bg-slate-800 bg-gray-200 rounded-md flex gap-2 items-center w-[150px] cursor-pointer">
                <img src="/logo.png" alt="" className="w-[28px] h-[28px]" />
                <p> $DPAY</p>
              </div>
            </div>

            <p className="text-[12px] dark:text-gray-200 text-gray-800">
              $ 4454.3
            </p>
          </div>

          <button className="main_btn rounded-md py-2 w-full mt-2">Swap</button>
        </div>
      );
    } else if (type === "liquidity") {
      return (
        <div className="dark:bg-slate-800 bg-gray-200 rounded-md p-2">
          <div className="rounded-md dark:bg-slate-900 bg-gray-100 p-4">
            <p className="text-[12px] dark:text-gray-200 text-gray-800">
              Input an address which hold $dpay.
            </p>

            <div className="flex justify-between w-full">
              <input
                type="string"
                className="h-full bg-transparent text-3xl py-1 font-semibold focus:outline-none w-full hide-number-btn"
                placeholder="0.00"
              />
            </div>

            <p className="text-[12px] dark:text-gray-200 text-gray-800">
              $ 4454.3
            </p>
          </div>

          <div className="w-full relative h-[8px]">
            <div className="p-2 rounded-md dark:bg-slate-800 bg-gray-200 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer duration-300">
              <div className="dark:bg-slate-900 bg-gray-100 rounded-md text-[12px] px-4 py-2">
                CLAIM
              </div>
            </div>
          </div>

          <div className="rounded-md dark:bg-slate-900 bg-gray-100 p-4">
            <p className="text-[12px] dark:text-gray-200 text-gray-800">
              You receive dunes.
            </p>

            <div className="flex justify-between w-full">
              <input
                type="number"
                className="h-full bg-transparent text-3xl py-1 font-semibold focus:outline-none w-full hide-number-btn"
                placeholder="0.00"
              />
            </div>

            <p className="text-[12px] dark:text-gray-200 text-gray-800">
              $ 4454.3
            </p>
          </div>

          <button className="main_btn rounded-md py-2 w-full mt-2">
            Claim
          </button>
        </div>
      );
    }
  };

  return (
    <Layout>
      <Head>
        <title>DPAY - Inscribe</title>
        <meta name="description" content="DPAY - DPAY inscribe" />
      </Head>

      <div className="mt-16">
        <div className="mx-auto max-w-[600px] w-full">
          <div className="my-3 flex gap-2 p-2 rounded-md dark:bg-slate-800 bg-gray-200 mx-auto">
            <button
              onClick={() => setType("swap")}
              className={`px-4 py-2 rounded-md focus:outline-none w-full ${
                type === "swap" ? "main_btn" : ""
              }`}
            >
              Swap
            </button>
            <button
              onClick={() => setType("liquidity")}
              className={`px-4 py-2 rounded-md focus:outline-none w-full ${
                type === "liquidity" ? "main_btn" : ""
              }`}
            >
              Claim
            </button>
          </div>
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
};

export default Inscribe;
