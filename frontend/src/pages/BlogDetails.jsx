import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../components/ToastManager";

function BlogDetails() {
  const { id } = useParams(); // Get blog ID from URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/blogs/${id}`);
        setBlog(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load the blog. It may have been removed or you don't have permission to view it.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Blog</h2>
        <p className="text-red-600">{error}</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <h2 className="text-xl font-bold text-gray-700 mb-2">Blog Not Found</h2>
        <p className="text-gray-600">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }  
  const isAuthor = user && blog.author && user.id === blog.author._id;

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/blogs/${blog._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      addToast("Blog post deleted successfully", "success");
      navigate('/');
    } catch (err) {
      console.error("Error deleting blog:", err);
      addToast(err.response?.data?.message || "Failed to delete the blog post", "error");
    }
  };

  const handleDeleteBlog = () => {
    setShowDeleteModal(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      {/* Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Blog Post"
          message="Are you sure you want to delete this blog post? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      )}

      <article className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">        {/* Blog Header */}
        <div className="px-6 py-8 border-b border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{blog.title}</h1>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-800 font-medium">
                  {blog.author && blog.author.name ? blog.author.name.charAt(0).toUpperCase() : '?'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {blog.author && blog.author.name ? blog.author.name : 'Unknown Author'}
                </p>
                {blog.createdAt && (
                  <p className="text-xs text-gray-500">
                    {formatDate(blog.createdAt)}
                    {blog.updatedAt && blog.updatedAt !== blog.createdAt && ' (edited)'}
                  </p>
                )}
              </div>
            </div>
              {isAuthor && (
              <div className="flex space-x-2">
                <Link
                  to={`/edit/${blog._id}`}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Link>
                <button
                  onClick={handleDeleteBlog}
                  className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded text-red-700 bg-white hover:bg-red-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
          {/* Blog Content */}
        <div className="p-6 sm:p-8">
          {blog.image && (
            <div className="mb-6">
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-auto rounded-lg shadow-sm max-h-96 object-cover"
              />
            </div>
          )}
          <div className="prose prose-blue max-w-none">
            {blog.content ? (
              <p className="whitespace-pre-wrap text-gray-700">{blog.content}</p>
            ) : (
              <p className="italic text-gray-500">No content available for this post.</p>
            )}
          </div>
        </div>
      </article>
      
      {/* Navigation */}
      <div className="max-w-3xl mx-auto mt-6 px-4 flex justify-between">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to all posts
        </Link>
      </div>
    </div>
  );
}

export default BlogDetails;


