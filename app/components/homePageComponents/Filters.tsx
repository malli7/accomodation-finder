import React, { ChangeEvent } from "react";
import { Filters } from "./Home";

interface FiltersProps {
  showFilters: boolean;
  filters: Filters;
  handleFilterChange: (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void;
  applyFilters: () => void;
  hasActiveFilters: boolean;
}
const FiltersPage = ({
  showFilters,
  filters,
  handleFilterChange,
  applyFilters,
  hasActiveFilters,
}: FiltersProps) => {
  return (
    <>
      {showFilters && (
        <div className="mt-4 p-4 bg-white rounded-md shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Bedrooms Filter */}
            <div>
              <label
                htmlFor="bedrooms"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bedrooms
              </label>
              <select
                id="bedrooms"
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Bathrooms Filter */}
            <div>
              <label
                htmlFor="bathrooms"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bathrooms
              </label>
              <select
                id="bathrooms"
                name="bathrooms"
                value={filters.bathrooms}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label
                htmlFor="priceRange"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Max Price
              </label>
              <input
                type="number"
                id="priceRange"
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                placeholder="Enter max price"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Availability Dates */}
            <div>
              <label
                htmlFor="availabilityStart"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Available From
              </label>
              <input
                type="date"
                id="availabilityStart"
                name="availabilityStart"
                value={filters.availabilityStart}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="availabilityEnd"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Available Until
              </label>
              <input
                type="date"
                id="availabilityEnd"
                name="availabilityEnd"
                value={filters.availabilityEnd}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* People Living Filter */}
            <div>
              <label
                htmlFor="peopleLiving"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                People Living
              </label>
              <select
                id="peopleLiving"
                name="peopleLiving"
                value={filters.peopleLiving}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Amenities Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amenities
              </label>
              <div className="space-y-2">
                {[
                  "wifi",
                  "tv",
                  "kitchen",
                  "parking",
                  "Dryer",
                  "Air Conditioning",
                  "Heating",
                  "Washer",
                  "Essentials",
                  "Smoke Detector",
                ].map((amenity) => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      name="amenities"
                      value={amenity}
                      checked={filters.amenities.includes(amenity)}
                      onChange={handleFilterChange}
                      className="mr-2"
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={applyFilters}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Apply Filters
          </button>
        </div>
      )}

      {/* Applied Filters Section */}
      {hasActiveFilters && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Applied Filters:</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (value && (Array.isArray(value) ? value.length > 0 : true)) {
                return (
                  <span
                    key={key}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                  >
                    {key}: {Array.isArray(value) ? value.join(", ") : value}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </section>
      )}
    </>
  );
};

export default FiltersPage;
