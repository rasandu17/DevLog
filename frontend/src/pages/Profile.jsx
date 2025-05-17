import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../components/ToastManager";

function Profile() {
  const { user } = useAuth();
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const { addToast } = useToast();  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null); // Clear any previous errors
        
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token is missing");
        }
        
        const res = await axios.get("/blogs/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (Array.isArray(res.data)) {
          setUserBlogs(res.data);
        } else {
          console.warn("Expected array of blogs but received:", res.data);
          setUserBlogs([]); // Fallback to empty array
        }
      } catch (err) {
        console.error("Error fetching user blogs:", err);
        const errorMessage = err.response?.data?.message || 
                             err.message || 
                             "Failed to load your blogs. Please try again later.";
        setError(errorMessage);
        setUserBlogs([]); // Clear any partial data
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [user]);
  // Function to retry loading blogs
  const retryFetchBlogs = async () => {
    if (!user) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      
      const res = await axios.get("/blogs/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (Array.isArray(res.data)) {
        setUserBlogs(res.data);
      } else {
        console.warn("Expected array of blogs but received:", res.data);
        setUserBlogs([]); // Fallback to empty array
      }
      
      // Show success notification
      addToast("Blogs loaded successfully", "success");
    } catch (err) {
      console.error("Error fetching user blogs:", err);
      const errorMessage = err.response?.data?.message || 
                           err.message || 
                           "Failed to load your blogs. Please try again later.";
      setError(errorMessage);
      setUserBlogs([]); // Clear any partial data
      
      // Show error notification
      addToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/blogs/${blogToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Remove the deleted blog from state
      setUserBlogs(userBlogs.filter(blog => blog._id !== blogToDelete));
      
      // Show success toast
      addToast("Blog post deleted successfully", "success");
      
    } catch (err) {
      console.error("Error deleting blog:", err);
      
      // Show error toast
      addToast(err.response?.data?.message || "Failed to delete the blog post", "error");
    } finally {
      // Reset state
      setShowDeleteModal(false);
      setBlogToDelete(null);
    }
  };

  const handleDeleteBlog = (blogId) => {
    setBlogToDelete(blogId);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      {/* Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setBlogToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Blog Post"
          message="Are you sure you want to delete this blog post? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-20 w-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">{user.name || "User"}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Member since {user.createdAt ? formatDate(user.createdAt) : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Blog Posts</h2>
            <Link
              to="/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Post
            </Link>
          </div>          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="font-medium">Error loading blogs</p>
                  <p className="text-sm">{error}</p>
                </div>
                <button
                  onClick={retryFetchBlogs}
                  className="bg-red-200 hover:bg-red-300 text-red-800 font-semibold py-1 px-3 rounded text-sm transition-colors duration-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry
                </button>
              </div>
            </div>
          ) : userBlogs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">You haven't created any blog posts yet.</p>
              <Link
                to="/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
              >
                Create your first post
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {userBlogs.map((blog) => (                  <li key={blog._id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start space-x-4">
                          {blog.image && (
                            <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border border-gray-200">
                              <img 
                                src={blog.image} 
                                alt={blog.title} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-gray-900 truncate">{blog.title}</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {blog.createdAt ? formatDate(blog.createdAt) : "N/A"}
                              {blog.updatedAt && blog.updatedAt !== blog.createdAt && " (edited)"}
                            </p>
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                              {blog.content ? blog.content.substring(0, 150) + (blog.content.length > 150 ? '...' : '') : 'No content available'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        <Link
                          to={`/blogs/${blog._id}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                        >
                          View
                        </Link>
                        <Link
                          to={`/edit/${blog._id}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 transition-colors duration-200"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;


