"use client";

import { register } from "../store/slices/authSlice";
import AuthForm from "../components/AuthForm";

const RegisterPage = () => {
  const fields = [
    { name: "username", label: "Username", type: "text", placeholder: "Username" },
    { name: "email", label: "Email", type: "email", placeholder: "Email" },
    { name: "password", label: "Password", type: "password", placeholder: "Password" },
    { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Confirm Password" },
  ];

  const validateForm = (formData, setErrors) => {
    let tempErrors = { username: "", email: "", password: "", confirmPassword: "" };
    let isValid = true;

    if (!formData.username) {
      tempErrors.username = "Username is required";
      isValid = false;
    } else if (formData.username.length < 3) {
      tempErrors.username = "Username must be at least 3 characters long";
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      tempErrors.username = "Username can only contain letters, numbers, and underscores";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(formData.password)) {
      tempErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(tempErrors);
    if (!isValid) {
      const firstError = Object.values(tempErrors).find((err) => err);
      showToast(firstError, "error");
    }
    return isValid;
  };

  const submitAction = (formData) =>
    register({ username: formData.username, email: formData.email, password: formData.password });

  const links = [
    { text: "Already have an account?", to: "/login", label: "Login here" },
  ];

  return (
    <AuthForm
      type="register"
      title="Create an Account"
      fields={fields}
      validateForm={validateForm}
      submitAction={submitAction}
      successRedirect="/login"
      links={links}
    />
  );
};

export default RegisterPage;