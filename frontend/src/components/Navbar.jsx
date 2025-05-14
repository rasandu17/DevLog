import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  useEffect(() => {
    console.log("USER FROM CONTEXT:", user);
  }, [user]);

  return (
    <nav className="flex justify-between bg-gray-800 p-4 text-white">
      <h1 className="text-xl font-bold">My Blog</h1>

      <div className="flex gap-4">
        <a href="/">Home</a>
        {!user && (
          <>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </>
        )}
        {user && (
          <>
            <a href="/create">Create Post</a>
            <button onClick={logout}>Logout</button>
          </>
        )}
        {user && (
          <>
            <a href="/profile">Profile</a>
          </>
        )}
        

      </div>
    </nav>
  );
}

export default Navbar;
