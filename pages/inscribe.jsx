import React, { useState } from "react";
import Head from "next/head";
import Layout from "@/components/sections/layouts/Layout";
import TextInscriptions from "@/components/inscriptionComponents/TextInscriptions";
import Drc20Inscriptions from "@/components/inscriptionComponents/Drc20Inscriptions";
import FileInscriptions from "@/components/inscriptionComponents/FileInscriptions";

const Inscribe = () => {
  const [type, setType] = useState("text");

  const renderContent = () => {
    if (type === "text") {
      return <TextInscriptions />;
    } else if (type === "drc20") {
      return <Drc20Inscriptions />;
    } else if (type === "file") {
      return <FileInscriptions />;
    } else {
      return (
        <div className="dark:bg-slate-800 bg-gray-200/80 rounded-md p-3 h-[150px] flex justify-center items-center">
          Coming Soon
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
          <div className="mx-auto">
            <div className="my-3 flex gap-2 p-2 rounded-md dark:bg-slate-800 bg-gray-200/80 mx-1">
              <button
                onClick={() => setType("text")}
                className={`px-4 py-2 rounded-md focus:outline-none w-full text-center ${
                  type === "text" ? "main_btn" : ""
                }`}
              >
                Text
              </button>
              <button
                onClick={() => setType("drc20")}
                className={`px-4 py-2 rounded-md focus:outline-none w-full text-center ${
                  type === "drc20" ? "main_btn" : ""
                }`}
              >
                Drc-20
              </button>
              <button
                onClick={() => setType("file")}
                className={`px-4 py-2 rounded-md focus:outline-none w-full text-center ${
                  type === "file" ? "main_btn" : ""
                }`}
              >
                Files
              </button>
              <button
                onClick={() => setType("dunes")}
                className={`px-4 py-2 rounded-md focus:outline-none w-full text-center ${
                  type === "dunes" ? "main_btn" : ""
                }`}
              >
                Dunes
              </button>
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
};

export default Inscribe;
