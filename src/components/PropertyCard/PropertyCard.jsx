// PropertyCard.jsx
import React, { useState } from "react";
import RequestForm from "../RequestForm/RequestForm";

const PropertyCard = ({ land }) => {
  const [open, setOpen] = useState(false);
  
  const toggle = () => setOpen(!open);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Image with Status Badge */}
      <div className="relative h-48">
        <img
          src={land.imageUrl}
          alt={`Land in ${land.district}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${
          land.status === 'sale' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          For {land.status === 'sale' ? 'Sale' : 'Rent'}
        </span>
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-white font-medium truncate">{land.district}, {land.state}</p>
          <p className="text-white/90 text-sm">₹{land.price.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>{land.area} hectares</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{land.district}</span>
          </div>
        </div>

        {/* Features */}
        {land.features && land.features.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-1">
              {land.features.slice(0, 3).map((feature, index) => (
                <span 
                  key={index}
                  className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                >
                  {feature}
                </span>
              ))}
              {land.features.length > 3 && (
                <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                  +{land.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {land.description && (
          <p className="text-xs text-gray-600 mt-2 line-clamp-2">
            {land.description}
          </p>
        )}

        {/* Contact Button */}
        <button
          onClick={toggle}
          className="w-full mt-3 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded flex items-center justify-center gap-1.5 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Contact Owner
        </button>
      </div>

      {open && <RequestForm Close={toggle} landDetails={land} />}
    </div>
  );
};

export default PropertyCard;
