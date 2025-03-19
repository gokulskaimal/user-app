"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsers,
  deleteUser,
  searchUsers,
  clearError,
  resetSuccess,
  createUser, // Add this import for the new feature
} from "../../store/slices/userSlice";
import Header from "../../components/Header";
import { showToast,Notification } from "../../components/Message";
import Loader from "../../components/Loader";

const AdminDashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchError, setSearchError] = useState("");
  // Add new state for add user modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });
  const [addUserErrors, setAddUserErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error, success } = useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is admin
    if (userInfo && userInfo.role !== "admin") {
      navigate("/login");
      showToast("Admin access required", "error");
    } else if (userInfo) {
      dispatch(getUsers());
    }

    return () => {
      dispatch(clearError());
      dispatch(resetSuccess());
    };
  }, [dispatch, userInfo, navigate]);

  useEffect(() => {
    if (error) showToast(error, "error");
  }, [error]);

  useEffect(() => {
    if (success) {
      showToast("Operation completed successfully", "success");
      setShowDeleteModal(false);
      setDeleteUserId(null);
      setShowAddModal(false); // Close add modal on success
      setNewUser({ username: "", email: "", password: "", role: "user" }); // Reset form
      dispatch(getUsers()); // Refresh user list
      dispatch(resetSuccess());
    }
  }, [success, dispatch]);

  const validateSearch = () => {
    if (searchTerm.trim().length > 0 && searchTerm.trim().length < 3) {
      setSearchError("Search term must be at least 3 characters long");
      showToast("Search term must be at least 3 characters long", "error");
      return false;
    }
    setSearchError("");
    return true;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (validateSearch()) {
      if (searchTerm.trim()) {
        dispatch(searchUsers(searchTerm.trim()));
      } else {
        dispatch(getUsers());
      }
    }
  };

  const handleDeleteClick = (userId) => {
    if (userId === userInfo?._id) {
      showToast("Cannot delete your own account", "error");
      return;
    }
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteUserId) {
      dispatch(deleteUser(deleteUserId));
    }
  };

  const cancelDelete = () => {
    setDeleteUserId(null);
    setShowDeleteModal(false);
  };

  // Add new function to handle input changes for new user
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new function to validate new user form
  const validateNewUser = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!newUser.username.trim()) errors.username = "Username is required";
    if (!newUser.email.trim()) errors.email = "Email is required";
    else if (!emailRegex.test(newUser.email)) errors.email = "Invalid email format";
    if (!newUser.password) errors.password = "Password is required";
    else if (newUser.password.length < 6) errors.password = "Password must be at least 6 characters";
    
    setAddUserErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add new function to handle form submission
  const handleAddUser = (e) => {
    e.preventDefault();
    if (validateNewUser()) {
      dispatch(createUser(newUser));
    }
  };

  return (
    <>
      <Header />
      <Notification />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add User
          </button>
        </div>

        {/* Search Form */}
        <div className="mb-6 flex justify-center">
          <form onSubmit={handleSearch} className="flex gap-3 w-full max-w-lg">
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Search users by username or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  searchError ? "border-red-500" : ""
                }`}
                disabled={loading}
                aria-describedby="search-error"
              />
              {searchError && (
                <p id="search-error" className="text-red-500 text-xs italic mt-1 absolute">
                  {searchError}
                </p>
              )}
            </div>
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              Search
            </button>
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSearchError("");
                  dispatch(getUsers());
                }}
                className={`bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* User Table */}
        {loading ? (
          <Loader />
        ) : (
          <div className="bg-white shadow-md rounded overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user._id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.profileImage || "/placeholder.svg"}
                              alt={user.username}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/admin/users/${user._id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </Link>
                        {userInfo?._id !== user._id && (
                          <button
                            onClick={() => handleDeleteClick(user._id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md mx-auto">
              <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
              <p className="mb-6">
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={cancelDelete}
                  className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md mx-auto w-full">
              <h2 className="text-xl font-bold mb-4">Add New User</h2>
              <form onSubmit={handleAddUser}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={newUser.username}
                    onChange={handleNewUserChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      addUserErrors.username ? "border-red-500" : ""
                    }`}
                  />
                  {addUserErrors.username && (
                    <p className="text-red-500 text-xs italic mt-1">{addUserErrors.username}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      addUserErrors.email ? "border-red-500" : ""
                    }`}
                  />
                  {addUserErrors.email && (
                    <p className="text-red-500 text-xs italic mt-1">{addUserErrors.email}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      addUserErrors.password ? "border-red-500" : ""
                    }`}
                  />
                  {addUserErrors.password && (
                    <p className="text-red-500 text-xs italic mt-1">{addUserErrors.password}</p>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={newUser.role}
                    onChange={handleNewUserChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboardPage;