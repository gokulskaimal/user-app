"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError } from "../store/slices/authSlice";
import Header from "./Header";
import { showToast, Notification } from "./Message";
import Loader from "./Loader";

const AuthForm = ({
  type = "login", // "login", "admin-login", or "register"
  title,
  fields,
  validateForm,
  submitAction,
  successRedirect = "/",
  links = [],
}) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [errors, setErrors] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [adminError, setAdminError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
    if (userInfo && type !== "admin-login") {
      showToast("Login successful", "success");
    } else if (userInfo && type === "admin-login" && userInfo.role === "admin") {
      showToast("Admin login successful", "success");
    } else if (type === "register" && userInfo) {
      showToast("Registration successful", "success");
    }
  }, [userInfo, type]);

  useEffect(() => {
    if (userInfo) {
      if (type === "admin-login" && userInfo.role !== "admin") {
        setAdminError("You do not have admin privileges");
      } else {
        showToast("Login successful", "success");
        navigate(successRedirect);
      }
    }
    return () => {
      dispatch(clearError());
    };
  }, [userInfo, navigate, dispatch, type, successRedirect]);



  useEffect(() => {
    if (error) {
      showToast(error, "error");
      dispatch(clearError());
    }
    if (adminError) {
      showToast(adminError, "error");
      setAdminError("");
    }
  }, [error, adminError, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAdminError("");
    if (validateForm(formData, setErrors)) {
      dispatch(submitAction(formData))
        .unwrap()
        .then((user) => {
          if (type === "admin-login" && user.role !== "admin") {
            setAdminError("You do not have admin privileges");
          }
        })
        .catch(() => {
          // Error handled by Redux state
        });
    }
  };

  return (
    <>
      <Header />
      <Notification />
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>

        {loading && <Loader />}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" noValidate>
          {fields.map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field.name}>
                {field.label}
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors[field.name] ? "border-red-500" : ""
                }`}
                id={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                required
                aria-describedby={`${field.name}-error`}
              />
              {errors[field.name] && (
                <p id={`${field.name}-error`} className="text-red-500 text-xs italic mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          {adminError && (
            <p className="text-red-500 text-sm italic mb-4 text-center">{adminError}</p>
          )}

          <div className="flex items-center justify-center">
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={loading}
            >
              {type === "register" ? "Register" : "Sign In"}
            </button>
          </div>
        </form>

        {links.map((link, index) => (
          <div key={index} className="text-center">
            <p>
              {link.text}{" "}
              <Link to={link.to} className="text-blue-500 hover:text-blue-700">
                {link.label}
              </Link>
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default AuthForm;