"use client";

import { login } from "../store/slices/authSlice";
import AuthForm from "../components/AuthForm";
import { showToast } from "../components/Message";

const LoginPage = () => {
  const fields = [
    { name: "email", label: "Email", type: "email", placeholder: "Email" },
    { name: "password", label: "Password", type: "password", placeholder: "Password" },
  ];

  const validateForm = (formData, setErrors) => {
    let tempErrors = { email: "", password: "" };
    let isValid = true;

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

    setErrors(tempErrors);
    if (!isValid) {
      const firstError = Object.values(tempErrors).find((err) => err);
      showToast(firstError, "error");
    }
    return isValid;
  };

  const submitAction = (formData) => login({ email: formData.email, password: formData.password });

  const links = [
    { text: "Don't have an account?", to: "/register", label: "Register here" },
    { text: "Admin?", to: "/admin/login", label: "Click here" },
  ];

  return (
    <AuthForm
      type="login"
      title="User Login"
      fields={fields}
      validateForm={validateForm}
      submitAction={submitAction}
      links={links}
    />
  );
};

export default LoginPage;