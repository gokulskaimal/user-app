"use client";

import { login } from "../../store/slices/authSlice";
import AuthForm from "../../components/AuthForm";
import { showToast } from "../../components/Message";

const AdminLoginPage = () => {
  const fields = [
    { name: "email", label: "Email", type: "email", placeholder: "Admin Email" },
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
    }
    // Remove complex password validation for admin login
    
    setErrors(tempErrors);
    if (!isValid) {
      const firstError = Object.values(tempErrors).find((err) => err);
      showToast(firstError, "error");
    }
    return isValid;
  };

  const submitAction = (formData) => login({ email: formData.email, password: formData.password });

  const links = [
    { text: "User?", to: "/login", label: "Click here" },
  ];

  return (
    <AuthForm
      type="admin-login"
      title="Admin Login"
      fields={fields}
      validateForm={validateForm}
      submitAction={submitAction}
      successRedirect="/admin"
      links={links}
    />
  );
};

export default AdminLoginPage;