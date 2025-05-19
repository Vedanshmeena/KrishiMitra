import React from "react";
import Layout from "../components/Layout/Layout";

import s5 from "../assets/s5.jpeg";
import report from "../assets/report.jpeg";
import ins from "../assets/ins.jpeg";
import cac from "../assets/cac.jpeg";
import weath from "../assets/weath.jpeg";
import tech from "../assets/tech.jpeg";
import stat from "../assets/stat.jpeg";

function Insurance() {
  return (
    <Layout>
      <div className="text-gray-900  pr-0 pb-14 pl-0 bg-white">
        <div className="w-full pt-4 pr-5 pb-6 pl-5 mt-0 mr-auto mb-0 ml-auto space-y-5 sm:py-8 md:py-12 sm:space-y-8 md:space-y-16 max-w-7xl">
          <div className="flex flex-col items-center sm:px-5 md:flex-row">
            <div className="flex flex-col items-start justify-center w-full h-full pt-6 pr-0 pb-6 pl-0 mb-6 md:mb-0 md:w-1/2">
              <div className="flex flex-col items-start justify-center h-full space-y-3 transform md:pr-10 lg:pr-16 md:space-y-5">
                <div className="text-4xl font-bold leading-none lg:text-5xl xl:text-6xl">
                  Explore Insurance Offers
                </div>
                <div className="pt-2 pr-0 pb-0 pl-0">
                  <p className="text-sm font-medium inline">
                    The Pradhan Mantri Fasal Bima Yojana (PMFBY) offers
                    comprehensive insurance coverage to farmers across India,
                    safeguarding their crops from various risks such as natural
                    calamities, pests, and diseases. Under PMFBY, farmers can
                    avail of affordable premium rates and receive timely
                    compensation for crop losses. The scheme aims to provide
                    financial stability to farmers and encourage agricultural
                    growth by mitigating the risks associated with crop
                    cultivation. Through PMFBY, farmers can protect their
                    livelihoods and ensure food security for the nation.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="block">
                <img
                  src={s5}
                  className="object-contain rounded-lg  w-full h-full"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 sm:px-5 gap-x-8 gap-y-16">
            
            <div className="flex flex-col items-start col-span-12 space-y-3 sm:col-span-6 xl:col-span-4">
              <a href="https://www.pmfby.gov.in/farmerRegistrationForm">
                <div className="relative ">
                  <img
                    src={ins}
                    className="object-cover w-full mb-2 overflow-hidden rounded-2xl shadow-sm btn-"
                    alt="Insurance"
                  />
                  <div className="absolute inset-0  rounded-2xl flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-75 transition duration-300">
                    <p className="text-white text-lg font-bold">
                      Apply for Crop Insurance by yourself
                    </p>
                  </div>
                </div>
              </a>
            </div>

              <div className="flex flex-col items-start col-span-12 space-y-3 sm:col-span-6 xl:col-span-4">
            <a href="https://www.pmfby.gov.in/">
                <div className="relative">
                  <img
                    src={report}
                    className="object-cover w-full mb-2 overflow-hidden rounded-lg shadow-sm btn-"
                    alt="Report"
                  />
                  <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-75 transition duration-300">
                    <p className="text-white text-lg font-bold">
                      Report Crop loss & Apply for Claim
                    </p>
                  </div>
                </div>
            </a>
              </div>

              <div className="flex flex-col items-start col-span-12 space-y-3 sm:col-span-6 xl:col-span-4">
            <a href="https://www.pmfby.gov.in/">
                <div className="relative">
                  <img
                    src={stat}
                    className="object-cover w-full mb-2 overflow-hidden rounded-lg shadow-sm btn-"
                    alt="Statistic"
                  />
                  <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-75 transition duration-300">
                    <p className="text-white text-lg font-bold">
                      Know your Application Status
                    </p>
                  </div>
                </div>
            </a>
              </div>

              <div className="flex flex-col items-start col-span-12 space-y-3 sm:col-span-6 xl:col-span-4">
            <a href="https://www.pmfby.gov.in/">
                <div className="relative">
                  <img
                    src={cac}
                    className="object-cover w-full mb-2 overflow-hidden rounded-lg shadow-sm btn-"
                    alt="CAC"
                  />
                  <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-75 transition duration-300">
                    <p className="text-white text-lg font-bold">
                      Know your Insurance Premium before
                    </p>
                  </div>
                </div>
            </a>
              </div>

              <div className="flex flex-col items-start col-span-12 space-y-3 sm:col-span-6 xl:col-span-4">
            <a href="https://pmfby.gov.in/winds/">
                <div className="relative">
                  <img
                    src={weath}
                    className="object-cover w-full mb-2 overflow-hidden rounded-lg shadow-sm btn-"
                    alt="Weather"
                  />
                  <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-75 transition duration-300">
                    <p className="text-white text-lg font-bold">
                      Know your Area's Weather Updates{" "}
                    </p>
                  </div>
                </div>
            </a>
              </div>

              <div className="flex flex-col items-start col-span-12 space-y-3 sm:col-span-6 xl:col-span-4">
            <a href="https://www.pmfby.gov.in/">
                <div className="relative">
                  <img
                    src={tech}
                    className="object-cover w-full mb-2 overflow-hidden rounded-lg shadow-sm btn-"
                    alt="Technology"
                  />
                  <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-75 transition duration-300">
                    <p className="text-white text-lg font-bold">
                      Tell us About your problems
                    </p>
                  </div>
                </div>
            </a>
              </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Insurance;
