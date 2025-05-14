import { useEffect, useState } from "react";
import axios from "../api/axios";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/blogs");
        setBlogs(res.data);
      } catch (err) {
        setError("Failed to fetch blogs");
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Blog Posts</h1>
      {error && <p className="text-red-500">{error}</p>}
      {blogs.length === 0 ? (
        <p>No blog posts yet.</p>
      ) : (
        blogs.map((post) => (
          <div
            key={post._id}
            className="mb-6 p-4 border rounded shadow-sm bg-white"
          >
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-700">{post.content}</p>
            <p className="text-sm text-gray-400">
              by {post.author.username} |{" "}
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;