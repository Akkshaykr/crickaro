import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import axios from "axios";

const LoginPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        domain: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password, name, confirmPassword, domain } = formData;

        try {
            if (isSignUp) {
                if (password !== confirmPassword) {
                    alert("Passwords do not match. Please try again.");
                    return;
                }

                // Attempt registration
                const response = await axios.post(`${import.meta.env.VITE_SERVER_APP_URL}/api/register`, { name, email, password, domain });
                alert("Sign-up successful!");
                handleNavigation(response.data.domain);
            } else {
                // Login logic with domain validation
                const response = await axios.post(`${import.meta.env.VITE_SERVER_APP_URL}/api/login`, { email, password });
                const { token, domain: userDomain } = response.data;
                console.log(response.data)

                if (domain !== userDomain) {
                    alert(`You have registered with the domain "${userDomain}". Please sign in with that domain.`);
                    return;
                }

                localStorage.setItem("token", token);
                alert("Sign-in successful!");
                handleNavigation(userDomain);
            }
        } catch (error) {
            console.error("Error during authentication:", error.response?.data || error.message);
            alert(error.response?.data?.message || "An error occurred during authentication.");
        }
    };

    const handleSignUpToggle = () => {
        setIsSignUp(!isSignUp);
    };

    const handleForgotPassword = async () => {
        const { email } = formData;
        if (!email) {
            alert("Please enter your email address.");
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_SERVER_APP_URL}/forgot-password`, { email });
            alert("Password reset link has been sent to your email.");
        } catch (error) {
            console.error("Error sending password reset email:", error.response?.data || error.message);
            alert("Error sending password reset email.");
        }
    };

    const handleNavigation = (domain) => {
        if (domain === "Upload") {
            navigate("/upload");
        } else if (domain === "User") {
            navigate("/district");
        } else {
            alert("Please select a valid domain.");
        }
    };

    return (
        <div className="login-page-background">
            <div className="login-container">
                <div className="login-image">
                    <img src="/src/assets/log.png" alt="Side Image" className="image" />
                </div>
                <div className="login-content">
                    <h1 className="title">Welcome to Crickaro!!!</h1>
                    <form className="login-form" onSubmit={handleSubmit}>
                        {isSignUp && (
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Name"
                                required
                                className="form-input"
                            />
                        )}
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email ID"
                            required
                            className="form-input"
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                            className="form-input"
                        />
                        {isSignUp && (
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                required
                                className="form-input"
                            />
                        )}
                        <select
                            name="domain"
                            value={formData.domain}
                            onChange={handleChange}
                            required
                            className="form-input"
                        >
                            <option value="">Select Domain</option>
                            <option value="Upload">Upload</option>
                            <option value="User">User</option>
                        </select>
                        <button type="submit" className="form-button">
                            {isSignUp ? "Sign Up" : "Sign In"}
                        </button>
                    </form>
                    <div className="auth-buttons">
                        {!isSignUp && (
                            <p>
                                Don't have an account?{" "}
                                <button onClick={handleSignUpToggle} className="toggle-button">
                                    Sign Up
                                </button>
                            </p>
                        )}
                        {isSignUp && (
                            <p>
                                Already have an account?{" "}
                                <button onClick={handleSignUpToggle} className="toggle-button">
                                    Sign In
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
