import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { useToast } from "../components/ToastManager";
import ImageUploader from "../components/ImageUploader";

function EditBlog() {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", content: "", image: null });
  const [originalForm, setOriginalForm] = useState({ title: "", content: "", image: null });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formChanged, setFormChanged] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { addToast } = useToast();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/blogs/${id}`);
        const blogData = { 
          title: res.data.title, 
          content: res.data.content,
          image: res.data.image || null
        };
        setForm(blogData);
        setOriginalForm(blogData);
        setError("");
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Could not load the blog post. It may not exist or you don't have permission to edit it.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // Check if form has changed from original
  useEffect(() => {
    if (form.title !== originalForm.title || 
        form.content !== originalForm.content ||
        form.image !== originalForm.image) {
      setFormChanged(true);
    } else {
      setFormChanged(false);
    }
  }, [form, originalForm]);

  // Prompt before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formChanged) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formChanged]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (imageData) => {
    setForm({ ...form, image: imageData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await axios.put(`/blogs/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Show success notification using toast
      addToast("Blog post updated successfully", "success");
      
      // Wait a moment before navigating
      setTimeout(() => {
        navigate(`/blogs/${id}`);
      }, 1000);
      
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.response?.data?.message || "Failed to update the blog post. Please try again.");
      addToast(err.response?.data?.message || "Failed to update the blog post", "error");
      setSubmitting(false);
    }
  };
  
  const handleCancel = (e) => {
    if (formChanged) {
      if (!confirm("You have unsaved changes. Are you sure you want to leave?")) {
        e.preventDefault();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
          <p className="text-gray-600 mt-1">Update your blog post details</p>
        </div>
        
        {error && (
          <div className="mx-6 mt-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                className="input-field"
                required
              />            </div>
            
            {/* Image Uploader */}
            <ImageUploader 
              onImageSelect={handleImageSelect} 
              initialImage={form.image}
            />
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                rows="12"
                value={form.content}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <Link
                to={`/blogs/${id}`}
                className="btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </Link>
              <div className="flex items-center space-x-2">
                {formChanged && (
                  <span className="text-xs text-yellow-600">Unsaved changes</span>
                )}
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting || (!formChanged && !loading)}
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    "Update Post"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditBlog;
