import { useState } from 'react';

function FilterBar({ onFilterChange, categories }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    onFilterChange({
      category: category === 'all' ? null : category,
      sortBy: sortBy
    });
  };

  const handleSortChange = (e) => {
    const sort = e.target.value;
    setSortBy(sort);
    onFilterChange({
      category: selectedCategory === 'all' ? null : selectedCategory,
      sortBy: sort
    });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="w-full md:w-auto mb-4 md:mb-0">
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Filter by Category
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      <div className="w-full md:w-auto">
        <label htmlFor="sort-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Sort by
        </label>
        <select
          id="sort-filter"
          value={sortBy}
          onChange={handleSortChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="a-z">Title (A-Z)</option>
          <option value="z-a">Title (Z-A)</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
