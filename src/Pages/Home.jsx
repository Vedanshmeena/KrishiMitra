import React from "react";
import Layout from "../components/Layout/Layout";
import Hero1 from "../assets/Hero1.gif";
import s2 from "../assets/s2.jpeg";
import s1 from "../assets/s1.jpeg";
import s3 from "../assets/s3.jpeg";

const Home = () => {
  return (
    <Layout>
      {/* section1 */}
      <div className="w-full">
        <img src={Hero1} alt="" className=" h-[32rem] w-full object-cover" />
      </div>

      {/* section2 */}
      <div className="mx-auto flex max-w-lg flex-col px-4 py-20 lg:max-w-screen-xl lg:flex-row">
        <div className="mb-10 max-w-lg lg:mb-0 lg:pr-16 xl:pr-20">
          <div className="mb-5 text-4xl font-bold text-black">
            Empowering Agriculture Through Innovation
          </div>
          <div className="mb-5 text-gray-600">
            Revolutionizing farming practices with cutting-edge technology and
            sustainable solutions for better yields and livelihoods.
          </div>
        </div>

        <div className="mr-10 mb-6 lg:mb-0">
          <img
            src={s1}
            alt="Who we are"
            className="shadow-black/10  w-[15rem] rounded-full object-left shadow-lg"
          />
          <div className="p-4">
            <p className="mb-1 font-medium uppercase text-black">Our Mission</p>
            <h5 className="text-gray-600">
              Empowering farmers with innovative solutions to enhance
              productivity and sustainability in agriculture.
            </h5>
            <div className="mt-2 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <img
            src={s2}
            alt="Our Practices"
            className="w-[15rem] rounded-full"
          />
          <div className="p-4">
            <p className="mb-1 font-medium uppercase text-black">
              Our Approach
            </p>
            <h5 className="text-gray-600">
              Integrating modern technology and sustainable practices to
              revolutionize agriculture and support farmers worldwide.
            </h5>
            <div className="mt-2 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* section3 */}
      <section class="flex flex-col rounded-3xl ml-[2rem] px-4 py-10 text-gray-700 sm:border-8 sm:border-t sm:border-b sm:px-10 lg:flex-row">
        <div class="mr-2">
          <h2 class="mb-4 text-4xl font-medium">
            Enhanced <span class="text-red-200">Farming Experience</span>
          </h2>
          <p class="mb-6">
            Discover a new approach to farming with our innovative app. Lorem
            ipsum dolor sit amet consectetur adipisicing elit. Earum nemo
            obcaecati commodi itaque aliquam.
          </p>
          <div class="mb-4 space-y-4">
            <div class="flex space-x-2">
              <span class="text-red-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  ></path>
                </svg>
              </span>
              <span class="font-medium">New Tips & Insights</span>
            </div>
            <div class="flex space-x-2">
              <span class="text-red-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  ></path>
                </svg>
              </span>
              <span class="font-medium">Crop Management Tools</span>
            </div>
            <div class="flex space-x-2">
              <span class="text-red-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  ></path>
                </svg>
              </span>
              <span class="font-medium">Weather Forecast Updates</span>
            </div>
            <div class="flex space-x-2">
              <span class="text-red-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  ></path>
                </svg>
              </span>
              <span class="font-medium">Market Trends Analysis</span>
            </div>
          </div>
          <div class="text-gray-400">and more...</div>
        </div>
        <div class="h-96">
          <img
            class="h-full w-full object-contain"
            src={s3}
            alt="Agriculture App"
          />
        </div>
      </section>

      {/* section4 */}
      <div class="relative ml-[3rem] my-10 flex flex-col justify-between px-10 lg:max-w-screen-2xl lg:flex-row">
        <div class="bg-slate-100 absolute left-0 h-full w-full lg:w-5/6 rounded-md border border-red-200"></div>
        <div class="relative py-10">
          <span class="rounded-full bg-red-200 px-2 py-1 text-xs text-white">
            HOT
          </span>
          <h2 class="text-slate-900 text-3xl font-bold lg:text-5xl">
            Freshly Harvested
          </h2>
          <p class="text-slate-700 mt-4 max-w-lg">
            Explore our latest batch of farm-fresh produce. Lorem ipsum dolor
            sit, amet consectetur adipisicing elit. Sequi id quaerat optio nisi
            cum?
          </p>
        </div>
        <div class="relative h-72 lg:w-72">
          <div class="bg-slate-50 shadow-slate-200 absolute h-56 w-56 translate-x-6 translate-y-6 rounded-2xl shadow-lg backdrop-blur-lg lg:h-60 lg:w-60"></div>
          <div class="shadow-slate-200 absolute flex h-56 w-56 translate-x-3 translate-y-3 flex-col items-center justify-center rounded-2xl bg-white shadow backdrop-blur-lg lg:h-60 lg:w-60">
            <div class="flex h-40 w-40 flex-col items-center justify-center rounded-full border-2 border-dashed">
              <p class="text-center text-5xl font-bold text-red-200 lg:text-6xl">
                38
              </p>
              <span class="text-center text-xs uppercase leading-4 text-red-200">
                Organic <br />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
