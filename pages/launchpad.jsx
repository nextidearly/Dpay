import React, { useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/sections/layouts/Layout";
import gsap from "gsap";
import imagesLoaded from "imagesloaded";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import CountDownComponent from "../components/Countdown";

const Launchpad = () => {
  useEffect(() => {
    const button1 = document.getElementById("btn-1");
    const button2 = document.getElementById("btn-2");

    button1.addEventListener("click", () => swapCards("right"));
    button2.addEventListener("click", () => swapCards("left"));

    const appBgContainerEl = document.querySelector(".app__bg");

    const changeInfo = (direction) => {
      let currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
      let previousInfoEl =
        cardInfosContainerEl.querySelector(".previous--info");
      let nextInfoEl = cardInfosContainerEl.querySelector(".next--info");

      gsap
        .timeline()
        .to([buttons.prev, buttons.next], {
          duration: 0.2,
          opacity: 0.5,
          pointerEvents: "none",
        })
        .to(
          currentInfoEl.querySelectorAll(".text"),
          {
            duration: 0.4,
            stagger: 0.1,
            translateY: "-120px",
            opacity: 0,
          },
          "-="
        )
        .call(() => {
          swapInfosClass(direction);
        })
        .call(() => initCardEvents())
        .fromTo(
          direction === "right"
            ? nextInfoEl.querySelectorAll(".text")
            : previousInfoEl.querySelectorAll(".text"),
          {
            opacity: 0,
            translateY: "40px",
          },
          {
            duration: 0.4,
            stagger: 0.1,
            translateY: "0px",
            opacity: 1,
          }
        )
        .to([buttons.prev, buttons.next], {
          duration: 0.2,
          opacity: 1,
          pointerEvents: "all",
        });

      function swapInfosClass() {
        currentInfoEl.classList.remove("current--info");
        previousInfoEl.classList.remove("previous--info");
        nextInfoEl.classList.remove("next--info");

        if (direction === "right") {
          currentInfoEl.classList.add("previous--info");
          nextInfoEl.classList.add("current--info");
          previousInfoEl.classList.add("next--info");
        } else if (direction === "left") {
          currentInfoEl.classList.add("next--info");
          nextInfoEl.classList.add("previous--info");
          previousInfoEl.classList.add("current--info");
        }
      }
    };
    const swapCards = (direction) => {
      const currentCardEl = cardsContainerEl.querySelector(".current--card");
      const previousCardEl = cardsContainerEl.querySelector(".previous--card");
      const nextCardEl = cardsContainerEl.querySelector(".next--card");

      const currentBgImageEl =
        appBgContainerEl.querySelector(".current--image");
      const previousBgImageEl =
        appBgContainerEl.querySelector(".previous--image");
      const nextBgImageEl = appBgContainerEl.querySelector(".next--image");

      changeInfo(direction);
      swapCardsClass();

      removeCardEvents(currentCardEl);

      function swapCardsClass() {
        currentCardEl.classList.remove("current--card");
        previousCardEl.classList.remove("previous--card");
        nextCardEl.classList.remove("next--card");

        currentBgImageEl.classList.remove("current--image");
        previousBgImageEl.classList.remove("previous--image");
        nextBgImageEl.classList.remove("next--image");

        currentCardEl.style.zIndex = "50";
        currentBgImageEl.style.zIndex = "-2";

        if (direction === "right") {
          previousCardEl.style.zIndex = "20";
          nextCardEl.style.zIndex = "30";

          nextBgImageEl.style.zIndex = "-1";

          currentCardEl.classList.add("previous--card");
          previousCardEl.classList.add("next--card");
          nextCardEl.classList.add("current--card");

          currentBgImageEl.classList.add("previous--image");
          previousBgImageEl.classList.add("next--image");
          nextBgImageEl.classList.add("current--image");
        } else if (direction === "left") {
          previousCardEl.style.zIndex = "30";
          nextCardEl.style.zIndex = "20";

          previousBgImageEl.style.zIndex = "-1";

          currentCardEl.classList.add("next--card");
          previousCardEl.classList.add("current--card");
          nextCardEl.classList.add("previous--card");

          currentBgImageEl.classList.add("next--image");
          previousBgImageEl.classList.add("current--image");
          nextBgImageEl.classList.add("previous--image");
        }
      }
    };
    // useEffect(() => {
    const buttons = {
      prev: document.querySelector(".btn--left"),
      next: document.querySelector(".btn--right"),
    };
    const cardsContainerEl = document.querySelector(".cards__wrapper");
    const cardInfosContainerEl = document.querySelector(".info__wrapper");

    const updateCard = (e) => {
      const card = e.currentTarget;
      const box = card.getBoundingClientRect();
      const centerPosition = {
        x: box.left + box.width / 2,
        y: box.top + box.height / 2,
      };
      let angle = Math.atan2(e.pageX - centerPosition.x, 0) * (35 / Math.PI);
      gsap.set(card, {
        "--current-card-rotation-offset": `${angle}deg`,
      });
      const currentInfoEl =
        cardInfosContainerEl.querySelector(".current--info");
      gsap.set(currentInfoEl, {
        rotateY: `${angle}deg`,
      });
    };

    const resetCardTransforms = (e) => {
      const card = e.currentTarget;
      const currentInfoEl =
        cardInfosContainerEl.querySelector(".current--info");
      gsap.set(card, {
        "--current-card-rotation-offset": 0,
      });
      gsap.set(currentInfoEl, {
        rotateY: 0,
      });
    };

    const initCardEvents = () => {
      const currentCardEl = cardsContainerEl.querySelector(".current--card");
      currentCardEl.addEventListener("pointermove", updateCard);
      currentCardEl.addEventListener("pointerout", (e) => {
        resetCardTransforms(e);
      });
    };

    const removeCardEvents = (card) => {
      card.removeEventListener("pointermove", updateCard);
    };

    const init = () => {
      let tl = gsap.timeline();

      tl.to(cardsContainerEl.children, {
        delay: 0.15,
        duration: 0.5,
        stagger: {
          ease: "power4.inOut",
          from: "right",
          amount: 0.1,
        },
        "--card-translateY-offset": "0%",
      })
        .to(
          cardInfosContainerEl
            .querySelector(".current--info")
            .querySelectorAll(".text"),
          {
            delay: 0.5,
            duration: 0.4,
            stagger: 0.1,
            opacity: 1,
            translateY: 0,
          }
        )
        .to(
          [buttons.prev, buttons.next],
          {
            duration: 0.4,
            opacity: 1,
            pointerEvents: "all",
          },
          "-=0.4"
        );
    };

    const waitForImages = () => {
      const images = [...document.querySelectorAll("img")];
      const totalImages = images.length;
      let loadedImages = 0;
      const loaderEl = document.querySelector(".loader span");

      gsap.set(cardsContainerEl.children, {
        "--card-translateY-offset": "100vh",
      });
      gsap.set(
        cardInfosContainerEl
          .querySelector(".current--info")
          .querySelectorAll(".text"),
        {
          translateY: "40px",
          opacity: 0,
        }
      );
      gsap.set([buttons.prev, buttons.next], {
        pointerEvents: "none",
        opacity: "0",
      });

      images.forEach((image) => {
        imagesLoaded(image, (instance) => {
          if (instance.isComplete) {
            loadedImages++;
            let loadProgress = loadedImages / totalImages;

            gsap.to(loaderEl, {
              duration: 1,
              scaleX: loadProgress,
              backgroundColor: `hsl(${loadProgress * 120}, 100%, 50%)`,
            });

            if (totalImages === loadedImages) {
              gsap
                .timeline()
                .to(".loading__wrapper", {
                  duration: 0.8,
                  opacity: 0,
                  pointerEvents: "none",
                })
                .call(() => init());
            }
          }
        });
      });
    };

    waitForImages();

    // return () => {
    //   button1.removeEventListener("click", () => swapCards("right"));
    //   button2.removeEventListener("click", () => swapCards("left"));
    // };
  }, []);

  return (
    <Layout>
      <Head>
        <title>DPAY - Inscribe</title>
        <meta name="description" content="DPAY - DPAY inscribe" />
      </Head>

      <div className="app h-[600px] -mt-2">
        <div className="cardList">
          <button className="cardList__btn  btn--left" id="btn-1">
            <div className="icon text-wrounded-lg hover:bg-black/50 border border-dotted border-white rounded-md py-2 duration-100 bg-black/70">
              <BsChevronLeft className="text-8xl font-bold text-white" />
            </div>
          </button>

          <div className="cards__wrapper">
            <div className="card rounded-lg current--card">
              <div className="card__image">
                <img
                  className="rounded-lg border border-dotted border-white"
                  src="/assets/images/items/3.gif"
                  alt=""
                />
              </div>
            </div>

            <div className="card rounded-lg next--card">
              <div className="card__image">
                <img
                  className="rounded-lg border border-dotted border-white"
                  src="/assets/images/items/7.gif"
                  alt=""
                />
              </div>
            </div>

            <div className="card rounded-lg previous--card">
              <div className="card__image">
                <img
                  className="rounded-lg border border-dotted border-white"
                  src="/assets/images/items/5.jpg"
                  alt=""
                />
              </div>
            </div>
          </div>

          <button className="cardList__btn  btn--right" id="btn-2">
            <div className="icon text-wrounded-lg hover:bg-black/50 border border-dotted border-white rounded-md py-2 duration-100 bg-black/70">
              <BsChevronRight className="text-8xl font-bold  text-white" />
            </div>
          </button>
        </div>

        <div className="infoList">
          <div className="info__wrapper">
            <div className="info current--info">
              <h1 className="text name">BitX OG PASS</h1>
              <h4 className="text location">26/03/2024</h4>
              <p className="text description">Minting is live.</p>
            </div>

            <div className="info next--info">
              <h1 className="text name">RSIC</h1>
              <h4 className="text location">--</h4>
              <p className="text description">Ended</p>
            </div>

            <div className="info previous--info">
              <h1 className="text name">RuneStone</h1>
              <h4 className="text location">--</h4>
              <p className="text description">Ended</p>
            </div>
          </div>
        </div>

        <div className="app__bg">
          <div className="app__bg__image current--image">
            <img src="https://source.unsplash.com/Z8dtTatMVMw" alt="" />
          </div>
          <div className="app__bg__image next--image">
            <img src="https://source.unsplash.com/9dmycbFE7mQ" alt="" />
          </div>
          <div className="app__bg__image previous--image">
            <img src="https://source.unsplash.com/m7K4KzL5aQ8" alt="" />
          </div>
        </div>
      </div>

      <div className="loading__wrapper">
        <div className="loader--text">Loading...</div>
        <div className="loader">
          <span></span>
        </div>
      </div>

      <div className="container mx-auto my-6 px-2 sm:px-0">
        <p className="text-4xl font-bold mb-3">Live & Upcoming</p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 rounded-lg gap-2 lg:gap-8">
          <div className="mx-auto cs-shadow2 rounded-2xl w-full overflow-hidden">
            <div className="overflow-hidden rounded-t-2xl">
              <img
                src="/assets/images/items/3.gif"
                alt=""
                className="w-full rounded-t-2xl h-[300px] object-cover object-center hover:scale-105 duration-200"
              />
            </div>
            <div className="p-4 w-full dark:bg-slate-800 bg-gray-200  rounded-b-2xl">
              <p className="font-bold text-orange-500">OG PASS</p>
              <div className="flex-col justify-center items-center h-full w-full">
                <div className="flex justify-center">
                  <CountDownComponent />
                </div>

                <div className="border border-dotted border-black w-full p-1 rounded-lg grid grid-cols-3 gap-1 text-sm">
                  <div className="rounded-lg flex-col justify-center items-center dark:bg-black/80 bg-gray-800 text-white">
                    <div className="border border-dotted border-black rounded-lg p-1">
                      <p className="text-center">Price</p>
                      <p className="text-center">Free</p>
                    </div>
                  </div>
                  <div className="rounded-lg flex-col justify-center items-center dark:bg-black/80 bg-gray-800 text-white">
                    <div className="border border-dotted border-black rounded-lg p-1">
                      <p className="text-center">Minted</p>
                      <p className="text-center">2100000</p>
                    </div>
                  </div>
                  <div className="rounded-lg flex-col justify-center items-center dark:bg-black/80 bg-gray-800 text-white">
                    <div className="border border-dotted border-black rounded-lg p-1">
                      <p className="text-center">Supply</p>
                      <p className="text-center">21000000</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-dotted text-center p-1 w-full border-black mt-2 relative">
                  <p className="texxt-center text-orange-500 relative z-50">
                    2100000/2100000
                  </p>
                  <div className="w-[30%] h-full absolute top-0 left-0 rounded-l-lg rounded-r-lg animate-pulse p-1">
                    <div className="w-full h-full dark:bg-black/80 bg-gray-800 rounded-lg"></div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    // window.open("https://airdrop.bxdx.io/", "_blank");
                  }}
                  className="w-[100%!important] dark:bg-black/80 bg-gray-800 main_btn text-white text-center text-lg p-1 rounded-lg cursor-pointer mt-[16px!important]"
                >
                  Coming soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto my-6 px-2 sm:px-0F">
        <p className="text-4xl font-bold mb-3">Past</p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 rounded-lg gap-2 lg:gap-8">
          <div className="mx-auto cs-shadow2 rounded-2xl w-full overflow-hidden">
            <div className="overflow-hidden rounded-t-2xl">
              <img
                src="/assets/images/items/3.gif"
                alt=""
                className="w-full rounded-t-2xl h-[300px] object-cover object-center hover:scale-105 duration-200"
              />
            </div>
            <div className="p-4 w-full dark:bg-slate-800 bg-gray-200  rounded-b-2xl">
              <p className="font-bold text-orange-500">OG PASS</p>
              <div className="flex-col justify-center items-center h-full w-full">
                {/* <div className="flex justify-center">
                  <CountDownComponent />
                </div> */}

                <div className="border border-dotted border-black w-full p-1 rounded-lg grid grid-cols-3 gap-1 text-sm">
                  <div className="rounded-lg flex-col justify-center items-center dark:bg-black/80 bg-gray-800 text-white">
                    <div className="border border-dotted border-black rounded-lg p-1">
                      <p className="text-center">Price</p>
                      <p className="text-center">Free</p>
                    </div>
                  </div>
                  <div className="rounded-lg flex-col justify-center items-center dark:bg-black/80 bg-gray-800 text-white">
                    <div className="border border-dotted border-black rounded-lg p-1">
                      <p className="text-center">Minted</p>
                      <p className="text-center">2100000</p>
                    </div>
                  </div>
                  <div className="rounded-lg flex-col justify-center items-center dark:bg-black/80 bg-gray-800 text-white">
                    <div className="border border-dotted border-black rounded-lg p-1">
                      <p className="text-center">Supply</p>
                      <p className="text-center">21000000</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-dotted text-center p-1 w-full border-black mt-2 relative">
                  <p className="texxt-center text-orange-500 relative z-50">
                    2100000/2100000
                  </p>
                  <div className="w-[100%] h-full absolute top-0 left-0 rounded-l-lg rounded-r-lg animate-pulse p-1">
                    <div className="w-full h-full dark:bg-black/80 bg-gray-800 rounded-lg"></div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    // window.open("https://airdrop.bxdx.io/", "_blank");
                  }}
                  className="w-[100%!important] dark:bg-black/80 bg-gray-800 main_btn text-white text-center text-lg p-1 rounded-lg cursor-pointer mt-[16px!important]"
                >
                  Sold out
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Launchpad;
