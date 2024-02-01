"use client";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "tailwindcss/tailwind.css";
import NextNProgress from "nextjs-progressbar";
import Head from "next/head";
import WalletContext from "@/context/wallet";
import InscribeDpayContext from "@/context/inscribeDpay";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { makeStore } from "./../store/store";
import { useRef } from "react";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import { ThemeContextProvider } from "../context/ThemeContext";
import { ThemeProvider } from "next-themes";
import Script from "next/script";

function App({ Component, pageProps }) {
  const storeRef = useRef();
  let persistor;
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    persistor = persistStore(storeRef.current);
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
          crossOrigin="anonymous"
        />
        <link
          href="/assets/libs/tiny-slider/tiny-slider.css"
          rel="stylesheet"
        />
        <link
          href="/assets/libs/_mdi/font/css/materialdesignicons.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <link rel="stylesheet" href="/assets/css/tailwind.min.css" />
      </Head>

      <Provider store={storeRef.current}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeContextProvider>
            <ThemeProvider attribute="class">
              <InscribeDpayContext>
                <WalletContext>
                  <NextNProgress color="#185380" />
                  <Component {...pageProps} />
                  <ToastContainer />
                </WalletContext>
              </InscribeDpayContext>
            </ThemeProvider>
          </ThemeContextProvider>
        </PersistGate>
      </Provider>
      <Toaster position="bottom-right" reverseOrder={false} />

      <Script src="/assets/libs/tiny-slider/min/tiny-slider.js"></Script>
      <Script src="/assets/libs/feather-icons/feather.min.js"></Script>
      <Script src="/assets/js/plugins.init.js"></Script>
      <Script src="/assets/js/app.js"></Script>
    </>
  );
}

export default App;
