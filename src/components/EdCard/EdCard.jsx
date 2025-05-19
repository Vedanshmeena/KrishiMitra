// EdCard.jsx
import React, { useState } from "react";
import EdModal from "./EdModal";

const EdCard = ({ title, description, instructor, level, enrolled, imageUrl }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="">
      <div className="group mx-2 mt-10 grid max-w-screen-lg grid-cols-1 space-x-8 overflow-hidden rounded-lg border text-gray-700 shadow transition hover:shadow-lg sm:mx-auto sm:grid-cols-5">
        <div className="col-span-2 text-left text-gray-600 hover:text-gray-700">
          {/* Image Section */}
          <div className="group relative h-full w-full overflow-hidden">
            {/* Image */}
            <img src={imageUrl} alt="" className="h-full w-full border-none object-cover text-gray-700 transition group-hover:scale-125" />
          </div>
        </div>
        {/* Course Details Section */}
        <div className="col-span-3 flex flex-col space-y-3 pr-8 text-left">
          <a href="#" className="mt-3 overflow-hidden text-2xl font-semibold">{title}</a>
          <p className="overflow-hidden text-sm">{description}</p>
          <a href="#" className="text-sm font-semibold text-gray-500 hover:text-gray-700">{instructor}</a>
          {/* Additional Info */}
          <div className="flex flex-col text-gray-700 sm:flex-row">
            <div className="flex h-fit space-x-2 text-sm font-medium">
              {/* Level Badge */}
              <div className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">{level}</div>
              {/* Enrolled Count Badge */}
              <div className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">{enrolled} Enrolled</div>
            </div>
            {/* Enroll Button */}
            <button onClick={openModal} className="my-5 rounded-md px-5 py-2 text-center transition hover:scale-105 bg-orange-600 text-white sm:ml-auto">Enroll Now</button>
          </div>
        </div>
      </div>
      {modalOpen && <EdModal closeModal={closeModal} title={title} description={description} instructor={instructor} level={level} enrolled={enrolled} imageUrl={imageUrl} />}
    </div>
  );
};

export default EdCard;
