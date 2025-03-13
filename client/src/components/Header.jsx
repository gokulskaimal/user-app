"use client";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Auth App
        </Link>
        <nav className="flex items-center">
          <ul className="flex space-x-4 items-center">
            {userInfo ? (
              <>
                <li>
                  <span className="text-gray-300">
                    Welcome, {userInfo.username}
                  </span>
                </li>
                {userInfo.role === "user" && (
                  <li>
                    <Link to="/" className="hover:text-gray-300">
                      Home
                    </Link>
                  </li>
                )}
                {userInfo.role === "user" && (
                  <li>
                    <Link to="/profile" className="hover:text-gray-300">
                      Profile
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:text-gray-300"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;