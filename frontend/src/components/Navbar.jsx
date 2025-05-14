import { Link } from "react-router-dom"; // Navbar component

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        MyBlog
      </Link>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/create" className="hover:underline">
          Create
        </Link>
        <Link to="/login" className="hover:underline">
          Login
        </Link>
        <Link to="/register" className="hover:underline">
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
