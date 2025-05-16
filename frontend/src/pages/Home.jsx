import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">All Blogs</h1>
      {blogs.length === 0 && <p>No blogs available.</p>}
      <div className="space-y-6">        {blogs.map((blog) => (
          <div key={blog._id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="text-gray-600 line-clamp-3">
              {blog.content.length > 150 
                ? `${blog.content.substring(0, 150)}...` 
                : blog.content}
            </p>
            <Link
              to={`/blogs/${blog._id}`}
              className="inline-block mt-2 text-blue-600 hover:underline"
            >
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
