import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth(); 
  console.log("USER IN NAVBAR:", user); 

  return (
    <nav className="flex justify-between p-4 bg-gray-800 text-white">
      <div>
        <Link to="/" className="mr-4">
          Home
        </Link>
        {user ? (
          <>
            <Link to="/profile" className="mr-4">
              Profile
            </Link>
            <button onClick={logout} className="mr-4">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">
              Login
            </Link>
            <Link to="/register" className="mr-4">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
