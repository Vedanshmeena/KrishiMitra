import React, { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard/PropertyCard";
import Layout from "../components/Layout/Layout";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../Firebase/FirebaseConfig";

const PropertyFilter = ({ lands, setFilteredLands, loading }) => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('price-asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    filterLands(e.target.value, selectedDistrict, minPrice, maxPrice, selectedStatus, sortBy);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    filterLands(selectedState, e.target.value, minPrice, maxPrice, selectedStatus, sortBy);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
    filterLands(selectedState, selectedDistrict, e.target.value, maxPrice, selectedStatus, sortBy);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
    filterLands(selectedState, selectedDistrict, minPrice, e.target.value, selectedStatus, sortBy);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    filterLands(selectedState, selectedDistrict, minPrice, maxPrice, e.target.value, sortBy);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    filterLands(selectedState, selectedDistrict, minPrice, maxPrice, selectedStatus, e.target.value);
  };

  const filterLands = (state, district, min, max, status, sort) => {
    let filteredLands = [...lands];

    if (state) filteredLands = filteredLands.filter(land => land.state === state);
    if (district) filteredLands = filteredLands.filter(land => land.district === district);
    if (min) filteredLands = filteredLands.filter(land => land.price >= parseInt(min));
    if (max) filteredLands = filteredLands.filter(land => land.price <= parseInt(max));
    if (status !== 'all') filteredLands = filteredLands.filter(land => land.status === status);

    switch (sort) {
      case 'price-asc': filteredLands.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filteredLands.sort((a, b) => b.price - a.price); break;
      case 'area-asc': filteredLands.sort((a, b) => a.area - b.area); break;
      case 'area-desc': filteredLands.sort((a, b) => b.area - a.area); break;
      default: break;
    }

    setFilteredLands(filteredLands);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <select
            disabled={loading}
            className="rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option value="all">All Types</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>

          <select
            disabled={loading}
            className="rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="area-asc">Area: Small to Large</option>
            <option value="area-desc">Area: Large to Small</option>
          </select>
        </div>

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Advanced Filters
        </button>
      </div>

      {isFilterOpen && (
        <div className="p-4 bg-gray-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
              <select
                disabled={loading}
                className="w-full rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={selectedState}
                onChange={handleStateChange}
              >
                <option value="">All States</option>
                {Array.from(new Set(lands.map(land => land.state))).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">District</label>
              <select
                disabled={loading}
                className="w-full rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={selectedDistrict}
                onChange={handleDistrictChange}
              >
                <option value="">All Districts</option>
                {Array.from(new Set(lands.map(land => land.district))).map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Min Price (₹)</label>
              <input
                type="number"
                disabled={loading}
                className="w-full rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={minPrice}
                onChange={handleMinPriceChange}
                placeholder="Min Price"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Max Price (₹)</label>
              <input
                type="number"
                disabled={loading}
                className="w-full rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                placeholder="Max Price"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Property = () => {
  const [lands, setLands] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllLands = async () => {
      try {
        const landsRef = collection(fireDB, "lands");
        const querySnapshot = await getDocs(landsRef);
        const allLands = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFilteredLands(allLands);
        setLands(allLands);
      } catch (error) {
        console.error("Error getting all lands: ", error);
      } finally {
        setLoading(false);
      }
    };

    getAllLands();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Land Listings</h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredLands.length} properties available
              </p>
            </div>
          </div>

          <PropertyFilter
            lands={lands}
            setFilteredLands={setFilteredLands}
            loading={loading}
          />

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredLands.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
              {filteredLands.map((land) => (
                <PropertyCard key={land.id} land={land} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm mt-4">
              <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Property;
