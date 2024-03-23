import React, { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "@/components/sections/layouts/Layout";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import TokenAvatar from "../components/UI/TokenAvatar";
import { CiSearch } from "react-icons/ci";
import NumberFormat from "../components/UI/NumberFormatter";

const Explorer = () => {
  const [data, setData] = useState({ list: [], total: 0 });
  const [searchKey, setSearchKey] = useState("");
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState("desc");
  const [orderBy, setOrderBuy] = useState("price");
  const [fetchingData, setFetchingData] = useState(false);
  const [avatar, setAvater] = useState(false);

  const handlePageClick = (e) => {
    setOffset(e.selected);
  };

  const searchByTicker = async (ticker) => {
    setFetchingData(true);
    const res = await fetch(
      `/coinranking/api/v2/coins?offset=${0}&orderBy=marketCap&limit=${100}&orderDirection=desc&referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&search=${ticker}&tags[]=drc-20`
    );
    const resJson = await res.json();
    setData({ list: resJson.data.coins, total: resJson.data.stats.totalCoins });
    setFetchingData(false);
  };

  const handleSearchKey = async (e) => {
    if (searchKey) {
      searchByTicker(searchKey);
    }
  };

  const handleSearch = async (e) => {
    if (e.keyCode === 13) {
      searchByTicker(e.target.value);
    }
  };

  const fetchData = async () => {
    setFetchingData(true);
    const res = await fetch(
      `/coinranking/api/v2/coins?offset=${
        offset * 100
      }&orderBy=marketCap&limit=${100}&orderDirection=desc&referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&search=&tags[]=drc-20`
    );
    const resJson = await res.json();
    setData({ list: resJson.data.coins, total: resJson.data.stats.totalCoins });
    setFetchingData(false);
  };

  useEffect(() => {
    fetchData();
  }, [search, sort, orderBy, offset]);

  return (
    <Layout>
      <Head>
        <title>DPAY - Explorer</title>
        <meta name="description" content="DPAY - DPAY Explorer" />
      </Head>

      <div className="h-full flex flex-col items-center justify-center mt-16 container-fluid mx-auto max-w-[1600px]">
        <h1 className="text-3xl font-bold text-center">
          Discover the Power of DRC20 Tokens with Our Token Explorer
        </h1>

        <div className="dark:text-gray-200 text-slate-800 text-center mb-8">
          Unleash the Potential of DRC20 Tokens with Real-Time Insights and
          Comprehensive Analytics
        </div>

        <div className="mb-8 flex justify-center w-full">
          <div className="form-icon relative w-full max-w-[600px] mx-auto">
            <CiSearch className="text-lg absolute top-1/2 -translate-y-1/2 start-3" />
            <input
              onChange={(e) => setSearchKey(e.target.value)}
              type="text"
              className="form-input w-full ps-10 pr-24 py-2 pl-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-3xl outline-none border border-gray-200 focus:border-red-600 dark:border-gray-800 dark:focus:border-red-600 focus:ring-0 bg-white text-sm"
              name="s"
              id="searchItem"
              placeholder="Search token for ticker"
              onKeyUp={(e) => handleSearch(e)}
            />
            <button
              className="rounded-3xl main_btn absolute top-1/2 -translate-y-1/2 right-1 py-1 px-3"
              onClick={handleSearchKey}
            >
              Search
            </button>
          </div>
        </div>

        <div className="rounded-md mt-1 grid sm:grid-cols-5 grid-cols-4 duration-100 items-center w-full">
          <div className="hover:bg-gray-200 dark:hover:bg-slate-800 dark:bg-slate-800/50 bg-gray-100 cursor-pointer p-2 flex gap-2 rounded-l-md">
            Ticker
          </div>
          <div className="hover:bg-gray-200 dark:hover:bg-slate-800 dark:bg-slate-800/50 bg-gray-100 cursor-pointer p-2 ">
            Price{" "}
          </div>
          <div className="hover:bg-gray-200 dark:hover:bg-slate-800 dark:bg-slate-800/50 bg-gray-100 cursor-pointer p-2 hidden sm:inline-block">
            24h%
          </div>
          <div className="hover:bg-gray-200 dark:hover:bg-slate-800 dark:bg-slate-800/50 bg-gray-100 cursor-pointer p-2 hidden sm:inline-block">
            MarketCap
          </div>
          <div className="hover:bg-gray-200 dark:hover:bg-slate-800 dark:bg-slate-800/50 bg-gray-100 cursor-pointer p-2 hidden sm:inline-block">
            Volume 24h
          </div>
        </div>

        <div className="w-full">
          {fetchingData ? (
            <>
              {Array.from({ length: 20 }, (_, index) => {
                return (
                  <div
                    className="py-2 dark:bg-slate-800/50 bg-gray-100 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-md mt-1 grid sm:grid-cols-5 grid-cols-4 duration-100 cursor-pointer items-center"
                    key={index}
                  >
                    <div className="flex gap-2 px-2">
                      <div className="rounded-full w-[30px] h-[30px] dark:bg-slate-800 bg-gray-200/80 " />
                      <p className="text-orange-500 font-semibold"></p>
                    </div>
                    <div className="px-2">
                      <p className="h-4 dark:bg-slate-800 bg-gray-200/80 animate-pulse w-12 rounded-md"></p>
                    </div>
                    <div>
                      <p className="h-4 dark:bg-slate-800 bg-gray-200/80 animate-pulse w-12 rounded-md"></p>
                    </div>
                    <div className="hidden sm:inline-block px-2">
                      <p className="h-4 dark:bg-slate-800 bg-gray-200/80 animate-pulse w-12 rounded-md"></p>
                    </div>
                    <div className="px-2 hidden sm:inline-block">
                      <p className="h-4 dark:bg-slate-800 bg-gray-200/80 animate-pulse w-12 rounded-md"></p>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {data.list.map((token, key) => {
                return (
                  <div
                    className="py-2 dark:bg-slate-800/50 bg-gray-100 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-md mt-1 grid sm:grid-cols-5 grid-cols-4 duration-100 cursor-pointer items-center"
                    key={key + offset}
                  >
                    <div className="flex gap-2 px-2">
                      <TokenAvatar
                        url={`${token.iconUrl}?size=30x30`}
                        tick={token.symbol.slice(0, 1)}
                      />
                      <p className="text-orange-500 font-semibold">
                        {token.symbol}
                      </p>
                    </div>
                    <div className="px-2">
                      $ {Number(token.price).toFixed(2)}
                    </div>
                    <div
                      className={`px-2 ${
                        Number(token.change) >= 0
                          ? "text-green-500"
                          : "text-red-400"
                      }`}
                    >
                      {Number(token.change) > 0 && "+"}
                      {Number(token.change)
                        ? Number(token.change).toFixed(2)
                        : 0}
                      %
                    </div>
                    <div className="hidden sm:inline-block px-2">
                      $ <NumberFormat number={Number(token.marketCap)} />
                    </div>
                    <div className="px-2 hidden sm:inline-block">
                      $ <NumberFormat number={Number(token[`24hVolume`])} />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          pageCount={Math.ceil(data.total / 100)}
          previousLabel="<"
          renderOnZeroPageCount={null}
          className="pagination"
        />
      </div>
    </Layout>
  );
};

export default Explorer;
