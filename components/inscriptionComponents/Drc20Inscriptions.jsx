import React, { useState, useRef, useEffect, useMemo } from "react";
import Bills from "../UI/Bills";
import WaitingPayment from "../WaitingPayment";
import FeeRecommend from "../UI/FeeRecommend";
import { Transition } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { updateFeeRate } from "@/store/slices/inscribe";
import { Checkbox } from "pretty-checkbox-react";
import toast from "react-hot-toast";
import { ImSpinner10 } from "react-icons/im";

function TextInscriptions() {
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(0);
  const [moving, setMoving] = useState("right");
  const [steps, setSteps] = useState([
    { name: "Step 1", href: "#", status: "current" },
    { name: "Step 2", href: "#", status: "upcoming" },
    { name: "Step 3", href: "#", status: "upcoming" },
    { name: "Step 4", href: "#", status: "upcoming" },
  ]);
  const [inscriptionText, setInscriptionText] = useState("");
  const [destAddress, setDestAddress] = useState("");
  const [textType, setTextType] = useState(1);
  const [feeOption, setFeeOption] = useState("1000000");

  const [amount, setAmount] = useState("");
  const [supply, setSupply] = useState("");
  const [limitPerMint, setLimitPerMint] = useState("");
  const [accuracyCheck, setAccuracyCheck] = useState();

  const [inscriptionData, setInscriptionData] = useState([]);
  const [inscriptionPricing, setInscriptionPricing] = useState();
  const [order, setOrder] = useState();

  const [loading, setLoading] = useState(false);

  const handleChangeFeeOption = (e) => {
    dispatch(updateFeeRate(e));
  };

  const prevStep = () => {
    setMoving("left");
    setSteps((old) =>
      old.map((v, i) => {
        if (i === currentStep) {
          v.status = "upcoming";
        } else if (i === currentStep - 1) {
          v.status = "current";
        }
        return v;
      })
    );
    setCurrentStep(currentStep - 1);
    return false;
  };

  const nextStep = async () => {
    setMoving("right");
    // getValues('firstname')
    if (currentStep === 0) {
      return;
    }

    if (true) {
      setSteps((old) =>
        old.map((v, i) => {
          if (i === currentStep) {
            v.status = "complete";
          } else if (i === currentStep + 1) {
            v.status = "current";
          }
          return v;
        })
      );
      setCurrentStep(currentStep + 1);
    }
    return false;
  };

  const wrapper = useRef(null);
  const [wrapperWidth, setWrapperWidth] = useState(1);
  const op = useMemo(() => {
    if (textType === 1) {
      return "mint";
    } else if (textType === 2) {
      return "deploy";
    } else if (textType === 3) {
      return "transfer";
    }
  }, [textType]);

  const handleCreatePrice = async () => {
    setLoading(true);
    let tokenInfo;
    if (textType === 1 || textType === 3) {
      const res = await fetch(
        `/drc20.explorer/ticks/byName/${inscriptionText}`
      );
      if (!res.ok) {
        toast.error("Tick not found.");
        setLoading(false);
        return;
      }
      tokenInfo = await res.json();
    }

    const data = [];

    if (textType === 1 || textType === 3) {
      const fullMints = Math.floor(amount / tokenInfo.limitPerMint);

      for (let i = 0; i < fullMints; i++) {
        data.push({
          p: "drc-20",
          op: op,
          tick: inscriptionText,
          amt: tokenInfo.limitPerMint.toString(),
        });
      }

      const remaining = amount % tokenInfo.limitPerMint;
      if (remaining > 0) {
        data.push({
          p: "drc-20",
          op: op,
          tick: inscriptionText,
          amt: remaining.toString(),
        });
      }
    } else if (textType === 2) {
      data.push({
        p: "drc-20",
        op: op,
        tick: inscriptionText,
        max: supply,
        lim: limitPerMint,
      });
    }

    setInscriptionData(data);

    try {
      const res = await fetch(`/drc20.explorer/inscribe/job/drc-20/pricing`, {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify({
          inscriptionContent: data,
          isPriority: true,
        }),
      });

      if (!res.ok) {
        const pricing = await res.json();
        toast.error(pricing?.errors[0]?.msg);
      } else {
        const pricing = await res.json();
        setInscriptionPricing(pricing);
      }
    } catch (error) {
      setCurrentStep(0);
      toast.error(
        "Something went woring when creating pricsing. please try again."
      );
    }
    setLoading(false);
    if (true) {
      setSteps((old) =>
        old.map((v, i) => {
          if (i === currentStep) {
            v.status = "complete";
          } else if (i === currentStep + 1) {
            v.status = "current";
          }
          return v;
        })
      );
      setCurrentStep(currentStep + 1);
    }
    return false;
  };

  const handleCreateOrder = async () => {
    const data = {
      receiverConfigs: [
        {
          amount: 1,
          address: destAddress,
        },
      ],
      inscriptionContent: inscriptionData,
      isPriority: true,
    };

    try {
      const res = await fetch(`/drc20.explorer/inscribe/job/drc-20`, {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify(data),
      });

      const order = await res.json();
      setOrder(order);
    } catch (error) {
      setCurrentStep(0);
      toast.error(
        "Something went woring when creating pricsing. please try again."
      );
    }
  };

  useEffect(() => {
    function handleResize() {
      if (wrapper.current !== null) {
        setWrapperWidth(wrapper.current.offsetWidth);
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex">
      <div className="flex-1 flex flex-col justify-top px-1 sm:px-1 ">
        <div
          className="flex items-start overflow-hidden w-96 sm:w-full"
          ref={wrapper}
        >
          <div className="flex flex-nowrap ">
            <Transition
              appear={false}
              unmount={false}
              show={currentStep === 0}
              enter="transform transition ease-in-out duration-500"
              enterFrom={
                moving === "right"
                  ? `translate-x-96 opacity-0`
                  : `-translate-x-96 opacity-0`
              }
              enterTo={`translate-x-0 opacity-100`}
              leave="transform transition ease-in-out duration-500 "
              leaveFrom={`translate-x-0 opacity-100`}
              leaveTo={
                moving === "right"
                  ? `-translate-x-full opacity-0`
                  : `translate-x-full opacity-0`
              }
              className="w-0 bg-green-200 overflow-visible"
              as="div"
            >
              <div
                className="dark:bg-slate-800 bg-gray-200/80 rounded-md p-3"
                style={{ width: `${wrapperWidth}px` }}
              >
                <div className="flex justify-center gap-4 my-3">
                  <Checkbox
                    animation="jelly"
                    color="danger"
                    icon={<i className="mdi mdi-check" />}
                    onChange={(e) => setTextType(1)}
                    checked={textType === 1 ? "checked" : ""}
                  >
                    Mint
                  </Checkbox>

                  <Checkbox
                    animation="jelly"
                    color="danger"
                    icon={<i className="mdi mdi-check" />}
                    onChange={(e) => setTextType(2)}
                    checked={textType === 2 ? "checked" : ""}
                  >
                    Deploy
                  </Checkbox>

                  <Checkbox
                    animation="jelly"
                    color="danger"
                    icon={<i className="mdi mdi-check" />}
                    onChange={(e) => setTextType(3)}
                    checked={textType === 3 ? "checked" : ""}
                  >
                    Transfer
                  </Checkbox>
                </div>

                <input
                  type="text"
                  placeholder="DRC20 Tick"
                  className="w-full my-3 rounded-md p-3 dark:bg-gray-700 bg-gray-100 focus:outline-none"
                  onChange={(e) => setInscriptionText(e.target.value)}
                  value={inscriptionText}
                />
                {textType !== 2 ? (
                  <input
                    type="number"
                    placeholder="Amount"
                    className="w-full my-3 rounded-md p-3 dark:bg-gray-700 bg-gray-100 focus:outline-none"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                ) : (
                  <>
                    <input
                      type="number"
                      placeholder="Total Supply"
                      className="w-full my-3 rounded-md p-3 dark:bg-gray-700 bg-gray-100 focus:outline-none"
                      value={supply}
                      onChange={(e) => setSupply(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Limit Per Mint"
                      className="w-full my-3 rounded-md p-3 dark:bg-gray-700 bg-gray-100 focus:outline-none"
                      value={limitPerMint}
                      onChange={(e) => setLimitPerMint(e.target.value)}
                    />
                  </>
                )}
                <input
                  type="text"
                  placeholder="Input Receive Address"
                  className="w-full my-3 rounded-md p-3 dark:bg-gray-700 bg-gray-100 focus:outline-none"
                  value={destAddress}
                  onChange={(e) => setDestAddress(e.target.value)}
                />
              </div>
            </Transition>

            <Transition
              appear={false}
              unmount={false}
              show={currentStep === 1}
              enter="transform transition ease-in-out duration-500"
              enterFrom={
                moving === "right"
                  ? `translate-x-96 opacity-0`
                  : `-translate-x-96 opacity-0`
              }
              enterTo={`translate-x-0 opacity-100`}
              leave="transform transition ease-in-out duration-500 "
              leaveFrom={`translate-x-0 opacity-100`}
              leaveTo={
                moving === "right"
                  ? `-translate-x-96 opacity-0`
                  : `translate-x-96 opacity-0`
              }
              className="bg-red-200 w-0 overflow-visible"
              as="div"
            >
              <div
                className="dark:bg-slate-800 bg-gray-200/80 rounded-md p-3"
                style={{ width: `${wrapperWidth}px` }}
              >
                <h1 className="text-center font-semibold text-lg">
                  Confirmation
                </h1>
                <p className="text-sm text-center mt-2">
                  Please check your order and confirm it.
                </p>
                <div className="flex flex-col mt-2 items-center rounded w-full max-h-[200px] bg-primary-dark/20 cursor-pointer  overflow-y-auto overflow-x-hidden scroll-smooth	transition ease-in-out duration-150">
                  {inscriptionData.map((data, key) => {
                    return (
                      <div
                        key={key}
                        className="flex p-2 dark:bg-gray-600 bg-gray-200 justify-between rounded-md w-full mb-2"
                      >
                        <div className="">{JSON.stringify(data)}</div>
                        <div className="flex itmes-center gap-2">
                          <p className="text-sm font-semibold">
                            {JSON.stringify(data).length} B
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  <input
                    type="text"
                    placeholder="Input Receive Address"
                    className="w-full my-3 rounded-md p-3 dark:bg-gray-700 bg-gray-100 focus:outline-none"
                    value={destAddress}
                    disabled
                  />
                  <div className="flex w-full justify-center mt-3 mb-4">
                    <Checkbox
                      animation="jelly"
                      color="danger"
                      icon={<i className="mdi mdi-check" />}
                      onChange={(e) => setAccuracyCheck(!accuracyCheck)}
                      checked={accuracyCheck ? "checked" : ""}
                    >
                      I confirm the accuracy of Input Data
                    </Checkbox>
                  </div>
                </div>
              </div>
            </Transition>

            <Transition
              appear={false}
              unmount={false}
              show={currentStep === 2}
              enter="transform transition ease-in-out duration-500"
              enterFrom={
                moving === "right"
                  ? `translate-x-96 opacity-0`
                  : `-translate-x-96 opacity-0`
              }
              enterTo={`translate-x-0 opacity-100`}
              leave="transform transition ease-in-out duration-500 "
              leaveFrom={`translate-x-0 opacity-100`}
              leaveTo={
                moving === "right"
                  ? `-translate-x-96 opacity-0`
                  : `translate-x-96 opacity-0`
              }
              className="w-0 overflow-visible"
              as="div"
            >
              <div
                className="dark:bg-slate-800 bg-gray-200/80 rounded-md p-3"
                style={{ width: `${wrapperWidth}px` }}
              >
                <FeeRecommend
                  feeOption={feeOption}
                  setFeeOption={setFeeOption}
                  onChange={handleChangeFeeOption}
                />
                <Bills networkFee={feeOption} pricing={inscriptionPricing} />
              </div>
            </Transition>

            <Transition
              appear={false}
              unmount={false}
              show={currentStep === 3}
              enter="transform transition ease-in-out duration-500"
              enterFrom={
                moving === "right"
                  ? `translate-x-96 opacity-0`
                  : `-translate-x-96 opacity-0`
              }
              enterTo={`translate-x-0 opacity-100`}
              leave="transform transition ease-in-out duration-500 "
              leaveFrom={`translate-x-0 opacity-100`}
              leaveTo={
                moving === "right"
                  ? `-translate-x-96 opacity-0`
                  : `translate-x-96 opacity-0`
              }
              className="bg-blue-200 w-0 overflow-visible"
              as="div"
            >
              <div
                className="dark:bg-slate-800 bg-gray-200/80 rounded-md p-3"
                style={{ width: `${wrapperWidth}px` }}
              >
                <WaitingPayment networkFee={feeOption} order={order} />
              </div>
            </Transition>
          </div>
        </div>
        <div className={`mt-2`}>
          <p className="text-sm font-medium mb-1 mt-3 text-center">
            Step {steps.findIndex((step) => step.status === "current") + 1} of{" "}
            {steps.length}
          </p>
          <nav
            className="flex items-center justify-center"
            aria-label="Progress"
          >
            <button
              className="main_btn rounded-md p-2 w-full float-left"
              disabled={currentStep === 0}
              onClick={() => prevStep()}
            >
              Prev
            </button>
            <ol className="mx-8 flex items-center space-x-5">
              {steps.map((step, i) => (
                <li key={`step_${i}`}>
                  {step.status === "complete" ? (
                    <a
                      href={step.href}
                      className="block w-2.5 h-2.5 bg-red-600 rounded-full hover:bg-red-900"
                    >
                      <span className="sr-only"></span>
                    </a>
                  ) : step.status === "current" ? (
                    <a
                      href={step.href}
                      className="relative flex items-center justify-center"
                      aria-current="step"
                    >
                      <span
                        className="absolute w-5 h-5 p-px flex"
                        aria-hidden="true"
                      >
                        <span className="w-full h-full rounded-full dark:bg-slate-800 bg-gray-200/80 " />
                      </span>
                      <span
                        className="relative block w-2.5 h-2.5 bg-red-600 rounded-full"
                        aria-hidden="true"
                      />
                      <span className="sr-only"></span>
                    </a>
                  ) : (
                    <a
                      href={step.href}
                      className="block w-2.5 h-2.5 bg-gray-200 rounded-full hover:bg-gray-400"
                    >
                      <span className="sr-only"></span>
                    </a>
                  )}
                </li>
              ))}
            </ol>
            <button
              className="main_btn rounded-md p-2 w-full float-right flex justify-center items-center"
              disabled={
                currentStep === 3 ||
                (currentStep === 0 && !destAddress) ||
                (currentStep === 1 && !accuracyCheck)
              }
              onClick={() => {
                if (currentStep === 0) {
                  handleCreatePrice();
                } else if (currentStep === 1) {
                  handleCreateOrder();
                }
                nextStep();
              }}
            >
              {loading ? (
                <ImSpinner10 className="animate-spin text-lg" />
              ) : (
                "Next"
              )}
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default TextInscriptions;
