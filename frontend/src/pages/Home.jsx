import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import BlogCard from "../components/BlogCard";
import FilterBar from "../components/FilterBar";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    category: null,
    sortBy: 'newest'
  });
  const blogsPerPage = 9; // Number of blogs to display per page
  // Fetch blogs with pagination and optional search
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        let url = `/blogs?page=${currentPage}&limit=${blogsPerPage}`;
        
        // Add search parameter if a search query exists
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }
        
        // Add category filter if selected
        if (activeFilters.category) {
          url += `&category=${encodeURIComponent(activeFilters.category)}`;
        }
        
        // Add sort parameter
        if (activeFilters.sortBy) {
          url += `&sort=${encodeURIComponent(activeFilters.sortBy)}`;
        }
        
        const res = await axios.get(url);
        
        // Extract categories from blogs for filter options (if backend doesn't provide this)
        if (!categories.length) {
          const allBlogs = Array.isArray(res.data) ? res.data : (res.data.blogs || []);
          const uniqueCategories = new Set();
          
          allBlogs.forEach(blog => {
            if (blog.category) {
              uniqueCategories.add(blog.category);
            }
          });
          
          if (uniqueCategories.size > 0) {
            setCategories(Array.from(uniqueCategories));
          } else {
            // Default categories if none found in blogs
            setCategories(['technology', 'programming', 'design', 'career', 'other']);
          }
        }
        
        // If the backend returns paginated data with metadata
        if (res.data.blogs && res.data.totalPages) {
          setBlogs(res.data.blogs);
          setTotalPages(res.data.totalPages);
          setTotalBlogs(res.data.totalBlogs || res.data.blogs.length);
        } else {
          // Handle case where backend doesn't support pagination yet
          let filteredBlogs = res.data;
            // If search is active and backend doesn't support search, perform client-side filtering
          if (searchQuery && !url.includes('search=')) {
            const query = searchQuery.toLowerCase();
            filteredBlogs = res.data.filter(blog => 
              blog.title.toLowerCase().includes(query) || 
              blog.content.toLowerCase().includes(query)
            );
          }
          
          // Apply category filter if backend doesn't support it
          if (activeFilters.category && !url.includes('category=')) {
            filteredBlogs = filteredBlogs.filter(blog => 
              blog.category === activeFilters.category
            );
          }
          
          // Apply sorting if backend doesn't support it
          if (activeFilters.sortBy && !url.includes('sort=')) {
            filteredBlogs = [...filteredBlogs].sort((a, b) => {
              switch (activeFilters.sortBy) {
                case 'newest':
                  return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                  return new Date(a.createdAt) - new Date(b.createdAt);
                case 'a-z':
                  return a.title.localeCompare(b.title);
                case 'z-a':
                  return b.title.localeCompare(a.title);
                default:
                  return 0;
              }
            });
          }
          
          setTotalBlogs(filteredBlogs.length);
          setTotalPages(Math.ceil(filteredBlogs.length / blogsPerPage));
          
          // Client-side pagination
          const startIndex = (currentPage - 1) * blogsPerPage;
          const endIndex = startIndex + blogsPerPage;
          setBlogs(filteredBlogs.slice(startIndex, endIndex));
        }
        
        setIsSearching(false);
        setError(null);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
        setIsSearching(false);
      } finally {
        setLoading(false);
      }
    };
    
    // Reset to first page when search query changes
    if (searchQuery !== '') {
      setCurrentPage(1);    }
    
    fetchBlogs();
  }, [currentPage, blogsPerPage, searchQuery, activeFilters.category, activeFilters.sortBy]);
  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(!!query);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to the top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to DevLog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore insightful articles on programming, technology, and development from our community.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <SearchBar 
              onSearch={handleSearch} 
              initialValue={searchQuery}
              placeholder="Search blogs by title or content..."
            />
          </div>        </div>

        {/* Filter Options */}
        {!loading && !error && blogs.length > 0 && (
          <div className="mb-6">
            <FilterBar 
              onFilterChange={handleFilterChange} 
              categories={categories} 
            />
          </div>
        )}

        {/* Blog Posts */}
        <div className="mb-8">          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery ? 'Search Results' : 'Latest Posts'}
            </h2>
            <div className="flex items-center space-x-2">
              {activeFilters.category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Category: {activeFilters.category}
                  <button 
                    onClick={() => handleFilterChange({...activeFilters, category: null})}
                    className="ml-1.5 text-blue-500 hover:text-blue-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              {totalBlogs > 0 && (
                <span className="text-sm text-gray-500">
                  {searchQuery ? (
                    <span>
                      Found {totalBlogs} {totalBlogs === 1 ? 'result' : 'results'} for "{searchQuery}"
                    </span>
                  ) : (
                    <span>{totalBlogs} {totalBlogs === 1 ? 'post' : 'posts'}</span>
                  )}
                </span>
              )}
            </div>
          </div>{loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          ) : blogs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              {searchQuery ? (
                <div>
                  <p className="text-gray-600 mb-2">No results found for "{searchQuery}"</p>
                  <button 
                    onClick={() => handleSearch('')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <p className="text-gray-600">No blogs available. Be the first to create a post!</p>
              )}
            </div>
          ) : (            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <BlogCard 
                  key={blog._id} 
                  blog={blog} 
                  formatDate={formatDate} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

