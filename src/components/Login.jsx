import React from 'react';
import './style.css'
import axios from "axios";
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [values, setValues] = React.useState({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = React.useState(false); // Untuk password terlihat atau tidak
    const [error, setError] = React.useState(""); // Untuk menampilkan error
    const [loading, setLoading] = React.useState(false); // Status loading
    const [successMessage, setSuccessMessage] = React.useState(""); // Status sukses

    const navigate = useNavigate();
    const eventHandler = async (event) => {
        event.preventDefault();

        setLoading(true); // Set loading true ketika request dimulai
        setError(""); // Reset error setiap kali mencoba login

        try {
            const response = await axios.post(import.meta.env.VITE_SERVER_HOST + "/login", values);
            if (response.data.status === "success") {
                setSuccessMessage(response.data.message);
                localStorage.setItem('authToken', response.data.data.token);
                localStorage.setItem('userId', response.data.data.user.id);
                localStorage.setItem('userFirstName', response.data.data.user.firstName);

                navigate('/dashboard');
            }
        } catch (err) {
            // Menangani error API
            if (err.response) {
                console.log("error", err.response);
                // Error dari server
                if (err.response.data.status === "error") {
                    if (err.response.data.message === "Validation failed") {
                        const messages = err.response.data.data.map((item) => item.message).join(", ");
                        console.log("error" + messages);
                        setError(messages); // Set pesan error
                    } else {
                        setError(err.response.data.message);
                    }
                }
            } else {
                // Error lainnya (misalnya masalah jaringan)
                setError("Network error. Please check your connection.");
            }
        } finally {
            setLoading(false); // Set loading ke false setelah proses selesai
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
            <div className="p-3 rounded w-25 border loginForm">
                <h2> Login Page </h2>

                {/*form login*/}
                <form onSubmit={eventHandler}>
                    <div>
                        <label htmlFor="username"><strong>Username:</strong></label>
                        <input type="text" autoComplete="off" placeholder="Enter Username"
                               onChange={(e) => setValues({...values, username: e.target.value})}
                               className="form-control rounded-0"/>
                    </div>
                    <div>
                        <label htmlFor="password"><strong>Password:</strong></label>
                        <div className="input-group">
                            <input type={showPassword ? "text" : "password"} placeholder="Enter Password"
                                   onChange={(e) => setValues({...values, password: e.target.value})}
                                   className="form-control rounded-0"/>
                            <button type="button" className="btn-eye" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash/> : <FaEye/>} {/* Menampilkan ikon mata */}
                            </button>
                        </div>
                    </div>
                    <button className='btn btn-success w-100 rounded-0'><strong>Log in</strong></button>
                </form>

                {/*handle error*/}
                {error && (
                    <div className="alert alert-danger mt-3">
                        <strong>Error: </strong> {error}
                    </div>
                )}

                {/*register*/}
                <div className="d-flex justify-content-center align-items-center mt-3">
                    <span className="text-white">If you don't have an account?</span>
                    <button type="button" className="btn-register w-auto ml-2 rounded-0"
                            onClick={() => window.location.href = "/register"}>
                        Register
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login;