import React, { useState, useContext } from "react";
import QRCode from "react-qr-code";
import toast from "react-hot-toast";
import { FaCopy, FaCheck } from "react-icons/fa";
import { Checkbox } from "pretty-checkbox-react";
import { Result } from "postcss";
import { WalletContext } from "@/context/wallet";
import { ImSpinner10 } from "react-icons/im";

const WaitingPayment = ({ networkFee, order }) => {
  const wallet = useContext(WalletContext);

  const fundingAddress = order?.fundingAddress;
  const [copied, setCopied] = useState({
    address: false,
    amount: false,
  });
  const [paymentType, setPaymentType] = useState("wallet");
  const [loading, setLoading] = useState();

  const copyToClipboard = (value, type) => {
    navigator.clipboard.writeText(value);
    setCopied({
      ...copied,
      [type]: true,
    });
  };

  const pushBitcoinTx = async (rawTxInfo) => {
    if (!rawTxInfo) {
      return;
    }

    const decodedPsbt = await wallet.decodePsbt(rawTxInfo.psbtHex);

    if (decodedPsbt.warning) {
      toast.error("RawTx decoding is failed");
      return;
    }

    try {
      const res = await wallet.pushTx(rawTxInfo.rawtx);
      if (res.status == API_STATUS.FAILED) {
        toast.error(res.message);
      } else {
        console.log(Result);
        toast.success(`Sent ${inputAmount} successfully.`);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    setLoading(true);
    wallet
      .createBitcoinTx(
        {
          address: fundingAddress,
          domain: "",
          undefined,
        },
        order?.costsPerFileInscriptionJob?.totalFee,
        networkFee,
        false
      )
      .then((data) => {
        console.log(data);
        pushBitcoinTx(data);
      })
      .catch((e) => {
        console.log(e);
        toast.error(`Something went wrong`);
        setLoading(false);
      });
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
                Waiting on Payment
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
                    Pay with Dpay Wallet
                  </Checkbox>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex gap-1 text-gray-700 dark:text-gray-200">
                <div>Service Fee : </div>
                <div>
                  {order?.costsPerFileInscriptionJob?.totalServiceFee / 10 ** 8}
                </div>
              </div>

              <div className="flex gap-1 text-gray-700 dark:text-gray-200">
                <div>Network Fee : </div>
                <div>{networkFee}</div>
              </div>

              <div className="flex p-1 items-center text-gray-700 dark:text-gray-200 flex-wrap justify-center">
                <div>Total Amount : </div>
                <div className="flex items-center">
                  <span className="text-lg ml-1">
                    {Number(
                      order?.costsPerFileInscriptionJob?.totalFee / 100000000
                    ).toFixed(2)}
                    DOGE
                  </span>{" "}
                  &nbsp; ({order?.costsPerFileInscriptionJob?.totalFee}) Shibes
                  {copied.amount ? (
                    <FaCheck
                      className="ml-1"
                      onClick={() =>
                        copyToClipboard(
                          order?.costsPerFileInscriptionJob?.totalFee /
                            100000000,
                          "amount"
                        )
                      }
                    />
                  ) : (
                    <FaCopy
                      className="ml-1"
                      onClick={() =>
                        copyToClipboard(
                          order?.costsPerFileInscriptionJob?.totalFee /
                            100000000,
                          "amount"
                        )
                      }
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
                    <button
                      className="mt-2 w-full main_btn py-2 rounded-md flex justify-center items-center"
                      onClick={() => handlePay()}
                    >
                      {loading ? (
                        <ImSpinner10 className="text-lg animate-spin"></ImSpinner10>
                      ) : (
                        "Pay with Dpay wallet"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="animate-pulse w-full flex flex-col items-center">
            <div className="w-100 h-8 dark:bg-slate-700 bg-gray-200 animate-pulse"></div>
            <div className="flex flex-col items-center gap-3 mt-3">
              <div className="w-60 h-6 dark:bg-slate-700 bg-gray-200 animate-pulse"></div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 w-100">
                <div className="h-12 w-full dark:bg-slate-700 bg-gray-200 animate-pulse mt-2"></div>
                <div className="h-12 w-full dark:bg-slate-700 bg-gray-200 animate-pulse mt-2"></div>
              </div>
              <div className="w-[165px] h-[165px] dark:bg-slate-700 bg-gray-200"></div>
            </div>
            <div className="flex flex-col items-center w-full">
              <div className="w-80 h-14 dark:bg-slate-700 bg-gray-200 animate-pulse mt-3"></div>
              <div className="w-20 h-6 dark:bg-slate-700 bg-gray-200 animate-pulse mt-3"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingPayment;
