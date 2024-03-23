import React from "react";
import Head from "next/head";
import Layout from "@/components/sections/layouts/Layout";

const Market = () => {
  return (
    <Layout>
      <Head>
        <title>DPAY - market</title>
        <meta name="description" content="DPAY - DPAY market" />
      </Head>

      <div className="h-full flex flex-col items-center justify-center mt-32">
        <h1 className="text-5xl font-bold mb-8 animate-pulse">
          Market - Coming Soon.
        </h1>
        <p className="text-lg mb-8 text-center">
          We are working hard to give you something cool!
        </p>
      </div>
    </Layout>
  );
};

export default Market;
