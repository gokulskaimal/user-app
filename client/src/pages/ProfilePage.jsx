"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUserProfile, uploadProfileImage, clearError, resetSuccess } from "../store/slices/authSlice"
import Header from "../components/Header"
import { showToast, Notification } from "../components/Message"
import Loader from "../components/Loader"

const ProfilePage = () => {
  const [image, setImage] = useState("")
  const [uploading, setUploading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [imageError, setImageError] = useState("")

  const dispatch = useDispatch()
  const { userInfo, loading, error, success } = useSelector((state) => state.auth)

  // Maximum file size in MB
  const MAX_FILE_SIZE = 5 // 5MB

  useEffect(() => {
    dispatch(getUserProfile())
    return () => {
      dispatch(clearError())
      dispatch(resetSuccess())
    }
  }, [dispatch])

  useEffect(() => {
    if (success) {
      setSuccessMessage("Profile image updated successfully")
      showToast(successMessage, "success")
      const timer = setTimeout(() => {
        setSuccessMessage("")
        dispatch(resetSuccess())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, dispatch])

  useEffect(() => {
    if (error) showToast(error, "error")
  }, [error])

  const validateImage = (file) => {
    // Allowed file types
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]
    
    if (!file) {
      setImageError("Please select an image")
      return false
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      setImageError("Only JPEG, PNG, and GIF images are allowed")
      return false
    }

    // Check file size (converted to MB)
    const fileSizeMB = file.size / 1024 / 1024
    if (fileSizeMB > MAX_FILE_SIZE) {
      setImageError(`Image size must be less than ${MAX_FILE_SIZE}MB`)
      return false
    }

    return true
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImageError("") // Clear previous errors

    if (file && validateImage(file)) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setImage(reader.result)
      }
    } else if (file) {
      showToast(imageError, "error")
      e.target.value = "" // Clear the input
    }
  }

  const handleUpload = () => {
    if (image) {
      setUploading(true)
      dispatch(uploadProfileImage(image))
        .then(() => {
          setImage("") // Clear preview after successful upload
        })
        .catch(() => {
          showToast("Failed to upload image", "error")
        })
        .finally(() => {
          setUploading(false)
        })
    } else {
      setImageError("Please select an image to upload")
      showToast("Please select an image to upload", "error")
    }
  }

  return (
    <>
      <Header />
      <Notification />
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>

        {loading && <Loader />}

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {userInfo && (
            <div className="flex flex-col items-center mb-6">
              <img
                src={userInfo.profileImage || "/placeholder.svg"}
                alt={userInfo.username}
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <h2 className="text-xl font-semibold">{userInfo.username}</h2>
              <p className="text-gray-600">{userInfo.email}</p>
              <p className="text-gray-500 text-sm">Role: {userInfo.role}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Update Profile Image</h3>
            <div className="mb-4">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageChange}
                className={`block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100 ${
                    imageError ? "border-red-500" : ""
                  }`}
              />
              {imageError && (
                <p className="text-red-500 text-xs italic mt-1">{imageError}</p>
              )}
            </div>

            {image && !imageError && (
              <div className="mb-4 flex flex-col items-center">
                <p className="text-sm text-gray-500 mb-2">Preview:</p>
                <img src={image} alt="Preview" className="w-32 h-32 rounded-full object-cover" />
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!image || uploading || imageError}
              className={`w-full py-2 px-4 rounded font-bold ${
                !image || uploading || imageError
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700 text-white"
              }`}
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Max file size: {MAX_FILE_SIZE}MB. Accepted formats: JPG, PNG, GIF
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage