import React, { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard/PropertyCard";
import Layout from "../components/Layout/Layout";
import ProductServiceCard from "../components/ProductServiceCard/ProductServiceCard";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../Firebase/FirebaseConfig";
import ProductOverview from "../components/ProductServiceCard/ProductOverview";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const ProductFilter = ({ products, setFilteredProducts }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterProducts(searchTerm, minPrice, maxPrice);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
    filterProducts(searchTerm, e.target.value, maxPrice);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
    filterProducts(searchTerm, minPrice, e.target.value);
  };

  const filterProducts = (searchTerm, minPrice, maxPrice) => {
    const filteredProducts = products.filter((product) => {
      const productName = product.productName.toLowerCase();
      const price = parseFloat(product.price);
      const isInPriceRange =
        (!minPrice || price >= parseFloat(minPrice)) &&
        (!maxPrice || price <= parseFloat(maxPrice));
      const matchesSearchTerm =
        !searchTerm || productName.includes(searchTerm.toLowerCase());
      return isInPriceRange && matchesSearchTerm;
    });
    setFilteredProducts(filteredProducts);
  };

  return (
    <div className="space-y-2 ">
      <div className="bg-gray-50 flex items-center gap-4 rounded-md p-1">
        <label
          htmlFor="search"
          className="block text-xs font-medium text-gray-700"
        >
          Search
        </label>
        <input
          id="search"
          type="text"
          className="py-2 ml-3 rounded border-gray-300 text-sm"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder=" Search products..."
        />
      </div>
      <div className="bg-gray-50 flex items-center gap-4 rounded-md p-1">
        <label
          htmlFor="minPrice"
          className="block text-xs font-medium text-gray-700"
        >
          Min Price
        </label>
        <input
          id="minPrice"
          type="number"
          min="0"
          className=" rounded border-gray-300 py-2 text-sm"
          value={minPrice}
          onChange={handleMinPriceChange}
          placeholder=" Min price..."
        />
      </div>
      <div className="bg-gray-50 flex items-center gap-4 rounded-md p-1">
        <label
          htmlFor="maxPrice"
          className="block text-xs font-medium text-gray-700"
        >
          Max Price
        </label>
        <input
          id="maxPrice"
          type="number"
          min="0"
          className="py-2 rounded border-gray-300 text-sm"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          placeholder=" Max price..."
        />
      </div>
    </div>
  );
};

const ProductServicePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const productsRef = collection(fireDB, "products");
        const querySnapshot = await getDocs(productsRef);

        const allProducts = [];
        querySnapshot.forEach((doc) => {
          allProducts.push({ id: doc.id, ...doc.data() });
        });
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error("Error getting all products: ", error);
        return [];
      }
    };

    getAllProducts();
  }, []);

  return (
    <Layout>
      <section>
        <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <header className="flex justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                Products & Services
              </h2>

              <p className="mt-4 max-w-md text-gray-500">
                Browse our collection of agricultural land listings. Find the
                perfect plot for your farming needs.
              </p>
            </div>

            <div>
              <Link to={"/cart"}>
                <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
                  <button className="flex items-center gap-4 border-e px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50  focus:relative">
                    View Cart
                    <ShoppingCartIcon className="w-4" />
                  </button>
                </span>
              </Link>
            </div>
          </header>

          <div className="flex">
            <div className="mt-8 block">
              <div className="mb-4">Filters</div>
              <div>
                <ProductFilter
                  products={products}
                  setFilteredProducts={setFilteredProducts}
                />
              </div>
            </div>
              <div className="flex ">
                <ul className="flex flex-wrap gap-4 ml-4">
                  {filteredProducts.map((product) => (
                    <ProductServiceCard key={product.id} product={product} />
                  ))}
                </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductServicePage;
