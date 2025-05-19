import { LockClosedIcon, XMarkIcon } from "@heroicons/react/16/solid";
import React from "react";

const EdModal = ({
  closeModal,
  title,
  description,
  instructor,
  level,
  enrolled,
  imageUrl,
}) => {
  return (
    <section className="fixed inset-0 z-50 mx-auto bg-white py-12 overflow-y-auto text-black sm:py-16 lg:py-20">
      <div className="flex justify-end px-4">
        <button onClick={closeModal}>
          <XMarkIcon className="w-8 h-8" />
        </button>
      </div>
      <div className="mx-auto px-6 sm:px-8 lg:px-12">
        <div className="row-gap-12 grid grid-cols-1 lg:grid-cols-2">
          <div className="flex flex-col">
            <div className="">
              <h2 className="font-sans text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                <span className="leading-snug">{title}</span>
              </h2>
              <p className="mt-6 text-lg text-gray-700">{description}</p>
            </div>

            <div className="group relative mt-8 w-full overflow-hidden rounded-xl">
              <div className="inset-0 bg-blue-700">
                <img
                  className="max-w-full object-cover opacity-10 transition-all duration-300 ease-in-out group-hover:opacity-80"
                  src={imageUrl}
                  alt=""
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <a
                  href="#"
                  title=""
                  className="inline-flex cursor-pointer items-center justify-center rounded-md border-2 border-white px-1 text-xs font-semibold text-white transition-all duration-200 ease-in-out hover:bg-white hover:text-black focus:shadow-md sm:py-2 sm:px-5 sm:text-base"
                  role="button"
                >
                  <svg
                    className="mr-2 h-6 w-6 "
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8.0416 4.9192C7.37507 4.51928 6.5271 4.99939 6.5271 5.77669L6.5271 18.2232C6.5271 19.0005 7.37507 19.4806 8.0416 19.0807L18.4137 12.8574C19.061 12.469 19.061 11.5308 18.4137 11.1424L8.0416 4.9192Z"
                      className=""
                    ></path>
                  </svg>
                  Watch Intro
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 lg:pl-16">
            <div className="text-white">
              <div className="group relative mb-4 overflow-hidden rounded-md border bg-white py-10 px-8 text-black shadow-lg transition-all duration-200 ease-in-out">
                <h3 className="text-xs uppercase">Instructor</h3>
                <p className="mt-2 font-sans text-3xl font-bold">
                  {instructor}
                </p>
                <p className="mt-4">
                  Even the clinic, the restaurant is in the cartoon. My
                  massauris amet lorem fusce. It's aimed at the kids as always.
                </p>
                <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-white px-10 text-black opacity-0 transition group-hover:opacity-100">
                  <h3 className="text-5xl select-none font-bold">
                    Get Better!
                  </h3>
                </div>
              </div>

              <div className="group relative mb-4 overflow-hidden rounded-md border bg-gray-500 py-10 px-8 shadow-lg transition-all duration-200 ease-in-out">
                <h3 className="text-xs uppercase">Advanced</h3>
                <p className="mt-2 font-sans text-3xl font-bold">
                  Second Month
                </p>
                <p className="mt-4">
                  Even the clinic, the restaurant is in the cartoon. My
                  massauris amet lorem fusce. It's aimed at the kids as always.
                </p>
                <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-white px-10 text-black opacity-0 transition group-hover:opacity-100">
                  <h3 className="text-5xl select-none font-bold">
                    Get Smarter!
                  </h3>
                </div>
              </div>

              <div className="group relative mb-4 overflow-hidden hover:scale-110 rounded-md border bg-black py-10 px-8 shadow-lg transition-all duration-200 ease-in-out">
                <h3 className="text-xs uppercase">Advanced</h3>
                <p className="mt-2 font-sans text-3xl font-bold">Third Month</p>
                <p className="mt-4">
                  Even the clinic, the restaurant Lorem, ipsum dolor sit amet
                  consectetur adipisicing elit. Facere ducimus dolorum
                  molestiae? Rerum culpa id vitae adipisci qui suscipit
                  inventore, labore quis, praesentium autem cupiditate. is in
                  the cartoon. My massauris amet lorem fusce. It's aimed at the
                  kids as always.
                </p>
                <div className="group-hover:cursor-pointer absolute top-0 left-0 flex h-full w-full items-center justify-center bg-blue-700 px-10 text-white opacity-0 transition group-hover:opacity-100">
                  <a href="#" className="text-5xl font-bold">
                    Get Started!
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EdModal;
