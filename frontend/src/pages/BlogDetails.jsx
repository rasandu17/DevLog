import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

function BlogDetails() {
  const { id } = useParams(); // Get blog ID from URL
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) return <p className="text-center mt-10">Loading...</p>;
  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{blog.title}</h2>
      <div className="text-gray-700 whitespace-pre-wrap">
        {blog.content}
      </div>
      <p className="text-sm text-gray-500 mt-4">
        Author: {blog.author ? blog.author.name : 'Unknown'}
      </p>
    </div>
  );
}

export default BlogDetails;
