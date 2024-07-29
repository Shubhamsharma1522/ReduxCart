import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import classes from "./Register.module.css";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    state: "",
    zipcode: "",
    profilePhoto: null, // Changed to null for file
    error: "",
  });

  const {
    username,
    email,
    password,
    confirmPassword,
    city,
    state,
    zipcode,
    profilePhoto,
    error,
  } = formData;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !username.trim()) {
      setFormData({ ...formData, error: "Please enter your username." });
      return;
    }

    if (!email || !email.trim()) {
      setFormData({ ...formData, error: "Please enter your email." });
      return;
    }

    if (!password || !password.trim()) {
      setFormData({ ...formData, error: "Please enter your password." });
      return;
    }

    if (password !== confirmPassword) {
      setFormData({
        ...formData,
        error: "Passwords do not match.",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", username);
      formDataToSend.append("email", email);
      formDataToSend.append("password", password);
      formDataToSend.append("city", city);
      formDataToSend.append("state", state);
      formDataToSend.append("zipcode", zipcode);
      if (profilePhoto) {
        formDataToSend.append("profilePhoto", profilePhoto);
      }

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response, "register response");
      toast.success("Successfully Registered!");
      navigate("/login");
    } catch (error) {
      setFormData({
        ...formData,
        error: error.response ? error.response.data.message : error.message,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, error: "" });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePhoto: e.target.files[0], error: "" });
  };

  return (
    <div className={classes.register}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div className={classes.usernamediv}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={username}
            onChange={handleInputChange}
            className={classes.username}
          />
        </div>
        <div className={classes.emaildiv}>
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="E-Mail"
            value={email}
            onChange={handleInputChange}
            className={classes.email}
          />
        </div>
        <div className={classes.passworddiv}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleInputChange}
            className={classes.password}
          />
        </div>
        <div className={classes.passworddiv}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleInputChange}
            className={classes.password}
          />
        </div>
        <div className={classes.citydiv}>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="City"
            value={city}
            onChange={handleInputChange}
            className={classes.city}
          />
        </div>
        <div className={classes.statediv}>
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            name="state"
            placeholder="State"
            value={state}
            onChange={handleInputChange}
            className={classes.state}
          />
        </div>
        <div className={classes.zipcodediv}>
          <label htmlFor="zipcode">Zipcode</label>
          <input
            type="text"
            id="zipcode"
            name="zipcode"
            placeholder="Zipcode"
            value={zipcode}
            onChange={handleInputChange}
            className={classes.zipcode}
          />
        </div>
        <div className={classes.profilephotodiv}>
          <label htmlFor="profilePhoto">Profile Photo</label>
          <input
            type="file"
            id="profilePhoto"
            name="profilePhoto"
            onChange={handleFileChange}
            className={classes.profilePhoto}
          />
        </div>
        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
        )}
        <div className={classes.buttondiv}>
          <button className={classes.button}>Register</button>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
