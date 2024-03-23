import React, { useState, useContext } from "react";
import QRCode from "react-qr-code";
import Countdown from "react-countdown";
import { FaCopy, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { WalletContext } from "@/context/wallet";
import { InscribeContext } from "@/context/inscribe";
import { useEffect } from "react";
import { feeAmount } from "@/configs/constants";
import { Checkbox } from "pretty-checkbox-react";

const WaitingPayment = ({ totalFee, networkFee }) => {
  const fundingAddress = "DAMH5oGgg2PPR2D8a5WoKB9RQmjynbmPUR";
  const walletContext = useContext(WalletContext);
  const inscribeContext = useContext(InscribeContext);
  const [isLoading, setLoad] = useState(true);
  const [copied, setCopied] = useState({
    address: false,
    amount: false,
  });

  const [paymentType, setPaymentType] = useState("wallet");
  const [loading, setLoading] = useState(false);

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      clearInterval(inscribeContext.intervalId);
      if (!inscribeContext.minted) {
        inscribeContext.setMintFailed(true);
        localStorage.setItem("mintFailed", "true");
      }
      return <></>;
    } else {
      return (
        <span>
          {hours}:{minutes}:{seconds}
        </span>
      );
    }
  };

  const copyToClipboard = (value, type) => {
    navigator.clipboard.writeText(value);
    setCopied({
      ...copied,
      [type]: true,
    });
  };

  const handlePay = async () => {
    if (walletContext.account) {
      if (typeof window === "undefined") return;
      const wallet = window.unisat;
      try {
        let txid = await wallet.sendBitcoin(fundingAddress, amount);
        inscribeContext.setPaid(true);
        localStorage.setItem("paid", true);
      } catch (e) {
        // inscribeContext.setPaid(false)
        // localStorage.setItem('paid', '')
        toast(e.message);
        return;
      }
    } else {
      inscribeContext.setPaid(false);
      localStorage.setItem("paid", "");
      toast("Please connect Unisat wallet");
      return;
    }
  };

  const handlePaymentType = (type) => {
    setPaymentType(type);
  };

  return (
    <div className="py-2 flex justify-center relative w-full">
      <div className="payment-card relative w-full">
        {fundingAddress ? (
          <>
            <div className="pb-3 w-full">
              <h4 className="text-2xl text-center text-gray-800 dark:text-gray-100">
                Waiting on Payment in{" "}
                <Countdown
                  date={Number(inscribeContext?.pendingOrder)}
                  renderer={renderer}
                />
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 w-full mb-3 bg-gray-200 dark:bg-slate-600">
              <div className="p-1 w-full">
                <div
                  className={`flex items-center px-3 py-4 w-full cursor-pointer h-full ${
                    paymentType === "chain"
                      ? "dark:bg-slate-700 bg-gray-100"
                      : ""
                  }`}
                  onClick={() => handlePaymentType("chain")}
                >
                  <Checkbox
                    animation="jelly"
                    color="danger"
                    icon={<i className="mdi mdi-check" />}
                    onChange={() => handlePaymentType("chain")}
                    checked={paymentType === "chain" ? "checked" : ""}
                  >
                    Pay on chain DOGE
                  </Checkbox>
                </div>
              </div>
              <div className="p-1 w-full">
                {" "}
                <div
                  className={`flex items-center px-3 py-4 w-full cursor-pointer h-full ${
                    paymentType === "wallet"
                      ? "dark:bg-slate-700 bg-gray-100"
                      : ""
                  }`}
                  onClick={() => handlePaymentType("wallet")}
                >
                  <Checkbox
                    animation="jelly"
                    color="danger"
                    icon={<i className="mdi mdi-check" />}
                    onChange={() => handlePaymentType("wallet")}
                    checked={paymentType === "wallet" ? "checked" : ""}
                  >
                    Pay with Wallet
                  </Checkbox>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex gap-1 text-gray-700 dark:text-gray-200">
                <div>Service Fee : </div>
                <div>{feeAmount}</div>
              </div>

              <div className="flex gap-1 text-gray-700 dark:text-gray-200">
                <div>Network Fee : </div>
                <div>{networkFee}</div>
              </div>

              <div className="flex p-1 items-center text-gray-700 dark:text-gray-200 flex-wrap justify-center">
                <div>Total Amount : </div>
                <div className="flex items-center">
                  <span className="text-lg ml-1">
                    {Number(totalFee / 100000000).toFixed(4)}
                    DOGE
                  </span>{" "}
                  ({totalFee}) Shibes
                  {copied.amount ? (
                    <FaCheck
                      className="ml-1"
                      onClick={() => copyToClipboard(totalFee, "amount")}
                    />
                  ) : (
                    <FaCopy
                      className="ml-1"
                      onClick={() => copyToClipboard(totalFee, "amount")}
                    />
                  )}
                </div>
              </div>
              {paymentType === "chain" ? (
                <div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-center text-gray-600 dark:text-gray-300 text-sm py-2">
                      Scan the QRCode to pay:
                    </p>
                    <div className="bg-gray-200 p-2.5 rounded drop-shadow-md shadow-sm shadow-black border-b border-t border-r border-l border-gray-300">
                      {fundingAddress && (
                        <QRCode
                          className="p-2 bg-gray-50"
                          value={fundingAddress}
                          size={180}
                        />
                      )}
                    </div>
                    <div className="pt-3 flex flex-col justify-center">
                      <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
                        or Copy address below
                      </p>
                      <p className="text-center flex justify-center text-gray-700 dark:text-gray-200">
                        {fundingAddress.slice(0, 15)}
                        ...
                        {fundingAddress.slice(-15)}
                        <span>
                          {copied.address ? (
                            <FaCheck
                              className="ml-1"
                              onClick={() =>
                                copyToClipboard(fundingAddress, "address")
                              }
                            />
                          ) : (
                            <FaCopy
                              className="ml-1"
                              onClick={() =>
                                copyToClipboard(fundingAddress, "address")
                              }
                            />
                          )}
                        </span>
                      </p>
                    </div>
                    <p className="text-center text-gray-600 dark:text-gray-300 text-sm mt-4">
                      After payment is made, you will receive the inscription
                      within at least 20 minutes.
                    </p>
                    <a
                      href="https://bitcoin.org/en/buy"
                      target="_blank"
                      className="underline hover:text-orange-400 transition ease-linear text-gray-700 dark:text-gray-200"
                    >
                      Need DOGE? Click here to buy some DOGE!
                    </a>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-center text-gray-600 dark:text-gray-300 text-sm py-2">
                      Scan the QRCode to pay:
                    </p>
                    <div className="bg-gray-200 p-2.5 rounded drop-shadow-md shadow-sm shadow-black border-b border-t border-r border-l border-gray-300">
                      {fundingAddress && (
                        <QRCode
                          className="p-2 bg-gray-50"
                          value={fundingAddress}
                          size={180}
                        />
                      )}
                    </div>
                    <p className="text-center text-gray-600 dark:text-gray-300 text-sm py-2">
                      You will receive the inscription within at least 10
                      minutes.
                    </p>
                    <a
                      href="https://bitcoin.org/en/buy"
                      target="_blank"
                      className="underline hover:text-orange-400 transition ease-linear text-gray-700 dark:text-gray-200"
                    >
                      Need DOGE? Click here to buy some DOGE!
                    </a>
                  </div>
                  <div className=" w-full mt-4">
                    {walletContext.account &&
                      walletContext.type !== "Unisat" && (
                        <button className={styles.inscribeButton}>
                          Pay with wallet
                        </button>
                      )}
                    {walletContext.account &&
                      walletContext.type === "Unisat" && (
                        <button
                          className={styles.inscribeButton}
                          onClick={() => handlePay()}
                        >
                          Pay with wallet
                        </button>
                      )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="animate-pulse w-full flex flex-col items-center">
            <div className="w-100 h-8 bg-gray-300 animate-pulse"></div>
            <div className="flex flex-col items-center gap-3 mt-3">
              <div className="w-60 h-6 bg-gray-300 animate-pulse"></div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 w-100">
                <div className="h-12 w-full bg-gray-300 animate-pulse mt-2"></div>
                <div className="h-12 w-full bg-gray-300 animate-pulse mt-2"></div>
              </div>
              <div className="w-[165px] h-[165px] bg-gray-300"></div>
            </div>
            <div className="flex flex-col items-center w-full">
              <div className="w-80 h-14 bg-gray-300 animate-pulse mt-3"></div>
              <div className="w-20 h-6 bg-gray-300 animate-pulse mt-3"></div>
            </div>
          </div>
        )}
      </div>
      {/* <div className='inscribe h-[500px] mb-12'>
        <div className='pb-4 w-full'>
          <h4 className='text-2xl  text-center'>Waiting on Payment in </h4>
        </div>
        {}
      </div> */}
    </div>
  );
};

export default WaitingPayment;
