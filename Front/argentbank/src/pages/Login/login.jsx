// Login.jsx
// This page handles user authentication.
// It uses Redux to manage authentication state and errors.

import React, { useEffect, useState } from "react";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navigation from "../../components/Navigation/navigation";
import Footer from "../../components/Footer/footer";
import { useDispatch, useSelector } from "react-redux";
import { setUserToken } from "../../features/token";
import { setRemember } from "../../features/remember";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { remember } = useSelector((state) => state.remember);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // If user connected, navigate to their dashboard
    if (localStorage.getItem('token') !== null || sessionStorage.getItem('token') !== null) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false); // Reset error state

    try {
      const response = await loginUser({ email: username, password: password });
      if (response.status === 200) {
        const token = response.data.body.token;
        dispatch(setUserToken(token));

        // Save the token based on the remember me option
        if (remember) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }

        navigate("/profile");
      }
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Navigation />
      <main className="main">
        <section className="sign-in-content">
          <FontAwesomeIcon className="sign-in-icon" icon={faCircleUser} />
          <h1 style={{ fontSize: "25px" }}>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div id="error-message">
                <p className="form-message">Wrong username or password!</p>
              </div>
            )}
            <div className="input-remember">
              <input type="checkbox" id="remember-me" checked={remember} onChange={() => {
                dispatch(setRemember(!remember));
              }}/>
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <button type="submit" className="sign-in-button">
              Sign In
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
