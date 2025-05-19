import React, { useState } from 'react';
import ProductOverview from './ProductOverview';
import { addDoc, collection, doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
import { fireDB } from '../../Firebase/FirebaseConfig';

const ProductServiceCard = ({ product }) => {
  const [showOverview, setShowOverview] = useState(false);

  const toggleOverview = () => {
    setShowOverview(!showOverview);
  };

  const handleClick = async () => {
    try {
      const clicksCollection = collection(fireDB, "ViewButtonclicks");
      await addDoc(clicksCollection, { timestamp: serverTimestamp() });
      toggleOverview();
    } catch (error) {
      console.error('Error writing to Firestore:', error);
    }
  };

  return (
    <>
      <div className={`group my-10 flex w-[20rem] max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md `}>
        <a className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl" href="#">
          <img
            className="peer absolute top-0 right-0 h-full w-full object-cover"
            src={product.imageUrl || 'https://via.placeholder.com/500'}
            alt="product image"
          />
        </a>
        <div className="mt-4 px-5 pb-5">
          <a href="#">
            <h5 className="text-xl tracking-tight text-slate-900">{product.productName.slice(0,20)+"..."}</h5>
          </a>
          <div className="mt-2 mb-5 flex items-center justify-between">
            <p>
              <span className="text-2xl font-bold text-slate-900">₹{product.price}</span>
            </p>
          </div>
          <button
            className="flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white bg-[#FF5139] hover:bg-white hover:text-[#FF5139] hover:border hover:border-[#FF5139]"
            onClick={handleClick}
          >
            View
          </button>
        </div>
        
      </div>
      {showOverview && <ProductOverview product={product} onClose={toggleOverview} />}
    </>
  );
};

export default ProductServiceCard;
