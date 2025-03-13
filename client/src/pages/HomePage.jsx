"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getUserProfile, clearError } from "../store/slices/authSlice"
import Header from "../components/Header"
import { showToast, Notification } from "../components/Message"
import Loader from "../components/Loader"

const HomePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userInfo, loading, error } = useSelector((state) => state.auth)

  useEffect(() => {
    // Fetch user profile if not already loaded
    if (!userInfo) {
      dispatch(getUserProfile())
    }

    // Cleanup
    return () => {
      dispatch(clearError())
    }
  }, [dispatch, userInfo])

  useEffect(() => {
    // Show error toast if there's an error
    if (error) {
      showToast(error, "error")
    }
  }, [error])

  useEffect(() => {
    // Redirect to login if no user info after loading
    if (!loading && !userInfo) {
      navigate("/login")
    }
  }, [userInfo, loading, navigate])

  if (loading) {
    return (
      <>
        <Header />
        <Loader />
      </>
    )
  }

  if (!userInfo) {
    return null // Will redirect to login via useEffect
  }

  return (
    <>
      <Header />
      <Notification />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="text-2xl font-bold mb-4">
            Welcome, {userInfo.username}!
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Profile Information</h2>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> {userInfo.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Role:</span> {userInfo.role || "User"}
                </p>
              </div>
            </div>

            {userInfo.profileImage && (
              <div className="mb-4 flex justify-center md:justify-end">
                <div className="text-center">
                  <h2 className="text-lg font-semibold mb-2">Profile Picture</h2>
                  <img
                    src={userInfo.profileImage}
                    alt={`${userInfo.username}'s profile`}
                    className="w-32 h-32 rounded-full object-cover shadow-md"
                  />
                </div>
              </div>
            )}
          </div>

          {userInfo.role === "User" && (
            <div className="mt-6">
              <button
                onClick={() => navigate("/profile")}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Edit Profile
              </button>
            </div>
          )}
          
        </div>
      </div>
    </>
  )
}

export default HomePage