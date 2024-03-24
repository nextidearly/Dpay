import React, { useState, useRef, useEffect } from "react";
import WaitingPayment from "../WaitingPayment";
import AttachFileComponent from "../dropzone";
import Bills from "../UI/Bills";
import FeeRecommend from "../UI/FeeRecommend";
import { Transition } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { updateFeeRate } from "@/store/slices/inscribe";
import { Checkbox } from "pretty-checkbox-react";

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
  const [destAddress, setDestAddress] = useState("");
  const [feeOption, setFeeOption] = useState("1000000");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState();
  const [accuracyCheck, setAccuracyCheck] = useState(false);
  const [inscriptionPricing, setInscriptionPricing] = useState();
  const [order, setOrder] = useState();

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

  const handleCreatePrice = async () => {
    const formData = new FormData();
    formData.append("zippedInscribeSources", file);
    formData.append(
      "receiverConfigs",
      JSON.stringify([{ amount: 1, address: destAddress }])
    );
    formData.append("isPriority", true);

    try {
      const res = await fetch(`/drc20.explorer/inscribe/job/file/pricing`, {
        method: "POST",
        headers: {},
        body: formData,
      });

      const pricing = await res.json();
      setInscriptionPricing(pricing);
    } catch (error) {
      setCurrentStep(0);
      toast.error(
        "Something went wrong when creating pricing. Please try again."
      );
    }
  };

  const handleCreateOrder = async () => {
    const formData = new FormData();
    formData.append("zippedInscribeSources", file);
    formData.append(
      "receiverConfigs",
      JSON.stringify([{ amount: 1, address: destAddress }])
    );
    formData.append("isPriority", true);

    try {
      const res = await fetch(`/drc20.explorer/inscribe/job/file`, {
        method: "POST",
        headers: {},
        body: formData,
      });
      const order = await res.json();
      console.log(order);
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
                <AttachFileComponent
                  type="zip"
                  setFile={setFile}
                  fileName={fileName}
                  setFileName={setFileName}
                />

                <input
                  type="text"
                  placeholder="Input Receive Address"
                  className="w-full mt-3 mb-4 rounded-md p-2 dark:bg-gray-700 bg-gray-100 focus:outline-none"
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
                <div className="flex flex-col mt-2 items-center rounded w-full transition ease-in-out duration-150">
                  <div className="dark:bg-gray-700 bg-gray-100 rounded-md min-h-[100px] max-h-[200px] p-2 overflow-y-auto w-full">
                    {inscriptionPricing?.prices?.shibescriptionCostsBySize.map(
                      (data, key) => {
                        return (
                          <div
                            key={key}
                            className="flex p-2 dark:bg-gray-600 bg-gray-200 justify-between rounded-md w-full mb-2"
                          >
                            <div className="">{fileName}</div>
                            <div className="flex itmes-center gap-2">
                              <p className="text-sm font-semibold">
                                {data.size} B
                              </p>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Input Receive Address"
                    className="w-full mt-3 mb-4 rounded-md p-2 dark:bg-gray-700 bg-gray-100 focus:outline-none"
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
              className="main_btn rounded-md p-2 w-full float-right"
              disabled={
                currentStep === 3 ||
                (currentStep === 0 && (!file || !destAddress)) ||
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
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default TextInscriptions;
