import React, { useState, useEffect } from "react";
import Countdown from "react-countdown";

export default function CountDownComponent() {
  const endTime = new Date(
    new Date("04/25/2024 01:37:00 AM UTC").toString()
  ).getTime();

  const empty = () => {
    return (
      <div className="flex gap-1 mx-auto">
        <span className="cs-shadow2 p-2 dark:bg-black/80 bg-gray-800 text-lg text-orange-500 font-bold rounded-lg w-[40px] h-[40px] flex justify-center items-center">
          00
        </span>
        <span className="flex items-center font-extrabold text-xl text-orange-500">
          :
        </span>
        <span className="cs-shadow2 p-2 dark:bg-black/80 bg-gray-800 text-lg text-orange-500 font-bold rounded-lg w-[40px] h-[40px] flex justify-center items-center">
          00
        </span>
        <span className="flex items-center font-extrabold text-xl text-orange-500">
          :
        </span>
        <span className="cs-shadow2 p-2 dark:bg-black/80 bg-gray-800 text-lg text-orange-500 font-bold rounded-lg w-[40px] h-[40px] flex justify-center items-center">
          00
        </span>
        <span className="flex items-center font-extrabold text-xl text-orange-500">
          :
        </span>
        <span className="cs-shadow2 p-2 dark:bg-black/80 bg-gray-800 text-lg text-orange-500 font-bold rounded-lg w-[40px] h-[40px] flex justify-center items-center">
          00
        </span>
      </div>
    );
  };

  const renderer = ({ completed, formatted }) => {
    const { days, hours, minutes, seconds } = formatted;

    if (completed) {
      return empty();
    } else {
      return (
        <>
          <div className="flex gap-1 mx-auto">
            <span className="cs-shadow2 p-2 dark:bg-black/80 bg-gray-800 text-lg text-orange-500 font-bold rounded-lg w-[40px] h-[40px] flex justify-center items-center">
              {days}
            </span>
            <span className="flex items-center font-extrabold text-xl text-orange-500">
              :
            </span>
            <span className="cs-shadow2 p-2 dark:bg-black/80 bg-gray-800 text-lg text-orange-500 font-bold rounded-lg w-[40px] h-[40px] flex justify-center items-center">
              {hours}
            </span>
            <span className="flex items-center font-extrabold text-xl text-orange-500">
              :
            </span>
            <span className="cs-shadow2 p-2 dark:bg-black/80 bg-gray-800 text-lg text-orange-500 font-bold rounded-lg w-[40px] h-[40px] flex justify-center items-center">
              {minutes}
            </span>
            <span className="flex items-center font-extrabold text-xl text-orange-500">
              :
            </span>
            <span className="cs-shadow2 p-2 dark:bg-black/80 bg-gray-800 text-lg text-orange-500 font-bold rounded-lg w-[40px] h-[40px] flex justify-center items-center">
              {seconds}
            </span>
          </div>
        </>
      );
    }
  };

  return (
    <div className="text-[40px] mb-[10px]">
      {renderer ? (
        <Countdown date={endTime} renderer={renderer} autoStart />
      ) : (
        empty()
      )}
    </div>
  );
}
