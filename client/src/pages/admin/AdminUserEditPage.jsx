"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getUserById, updateUser, clearError, resetSuccess, resetUser } from "../../store/slices/userSlice"
import Header from "../../components/Header"
import { showToast, Notification } from "../../components/Message"
import Loader from "../../components/Loader"

const AdminUserEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("user")
  const [password, setPassword] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    role: "",
    password: ""
  })

  const { user, loading, error, success } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(getUserById(id))
    return () => {
      dispatch(clearError())
      dispatch(resetSuccess())
      dispatch(resetUser())
    }
  }, [dispatch, id])

  useEffect(() => {
    if (user) {
      setUsername(user.username || "")
      setEmail(user.email || "")
      setRole(user.role || "user")
    }
  }, [user])

  useEffect(() => {
    if (error) showToast(error, "error")
  }, [error])

  useEffect(() => {
    if (success) {
      setSuccessMessage("User updated successfully")
      showToast("User updated successfully", "success")
      
      const timer = setTimeout(() => {
        setSuccessMessage("")
        dispatch(resetSuccess())
        navigate("/admin")
      }, 3000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [success, dispatch])

  const validateForm = () => {
    let tempErrors = {
      username: "",
      email: "",
      role: "",
      password: ""
    }
    let isValid = true

    // Username validation
    if (!username) {
      tempErrors.username = "Username is required"
      isValid = false
    } else if (username.length < 3) {
      tempErrors.username = "Username must be at least 3 characters long"
      isValid = false
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      tempErrors.username = "Username can only contain letters, numbers, and underscores"
      isValid = false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      tempErrors.email = "Email is required"
      isValid = false
    } else if (!emailRegex.test(email)) {
      tempErrors.email = "Please enter a valid email address"
      isValid = false
    }

    // Role validation
    if (!["user", "admin"].includes(role)) {
      tempErrors.role = "Role must be either 'user' or 'admin'"
      isValid = false
    }

    // Password validation (only if provided)
    if (password) {
      if (password.length < 8) {
        tempErrors.password = "Password must be at least 8 characters long"
        isValid = false
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
        tempErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        isValid = false
      }
    }

    setErrors(tempErrors)
    const firstError = Object.values(tempErrors).find(err => err !== "")
    if (firstError) {
      showToast(firstError, "error")
    }

    return isValid
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const userData = {
        username,
        email,
        role,
      }

      if (password) {
        userData.password = password
      }

      dispatch(updateUser({ id, userData }))
    }
  }

  const handleGoBack = () => {
    navigate("/admin")
  }

  return (
    <>
      <Header />
      <Notification />
      <div className="container mx-auto px-4 py-8 max-w-md">
        <button 
          onClick={handleGoBack} 
          className="mb-4 flex items-center text-blue-500 hover:text-blue-700"
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold mb-6">Edit User</h1>

        {loading && <Loader />}

        {user && (
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" noValidate>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.username ? "border-red-500" : ""
                }`}
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                required
                aria-describedby="username-error"
              />
              {errors.username && (
                <p id="username-error" className="text-red-500 text-xs italic mt-1">
                  {errors.username}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.email ? "border-red-500" : ""
                }`}
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                required
                aria-describedby="email-error"
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-xs italic mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                Role
              </label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.role ? "border-red-500" : ""
                }`}
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                aria-describedby="role-error"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p id="role-error" className="text-red-500 text-xs italic mt-1">
                  {errors.role}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.password ? "border-red-500" : ""
                }`}
                id="password"
                type="password"
                placeholder="Leave blank to keep current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby="password-error"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
              {errors.password && (
                <p id="password-error" className="text-red-500 text-xs italic mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={loading}
              >
                Update User
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}

export default AdminUserEditPage