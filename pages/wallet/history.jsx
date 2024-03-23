import Layout from "@/components/sections/layouts/Layout";
import Tabs from "@/components/UI/Tabs";
import History from "@/components/sections/History";
import Head from "next/head";

export default function WalletHistory() {
  return (
    <Layout>
      <Head>
        <title>DPAY - Wallet</title>
        <meta
          name="description"
          content="DPAY - wallet history and inscriptions"
        />
      </Head>

      <h1 className="text-3xl font-semibold my-16 text-center">My Wallet</h1>

      <div className="flex justify-center sm:justify-between w-full container mx-auto">
        <Tabs type={"history"} loading={false} />
      </div>

      <History />
    </Layout>
  );
}
