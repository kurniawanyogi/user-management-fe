import React, {useState} from "react";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
    });

    const [showPassword, setShowPassword] = useState(false); // Untuk mengontrol apakah password terlihat atau tidak
    const [error, setError] = useState(""); // Untuk menampilkan error
    const [validationErrors, setValidationErrors] = useState({}); // Untuk menampilkan validasi error dari server
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Untuk mengontrol tampilan modal
    const navigate = useNavigate();

    // Handle the success response from the registration
    const handleShowSuccessModal = () => {
        setShowSuccessModal(true);
        console.log(showSuccessModal);
    };
    const handleCloseModal = () => {
        setShowSuccessModal(false);
    };
    const handleRedirectToLogin = () => {
        setShowSuccessModal(false);
        navigate("/login");
    };

    // Validasi Frontend (Client-side validation)
    const validateForm = () => {
        const errors = {};
        if (!user.username) errors.username = "Username is required";
        if (!user.password) errors.password = "Password is required";
        if (!user.firstName) errors.firstName = "First Name is required";
        if (!user.email) errors.email = "Email is required";
        if (user.username && user.username.length > 32) errors.username = "Username must be less than or equal to 32 characters";
        if (user.password && user.password.length < 8) errors.password = "Password must be more than or equal to 8 characters";
        if (user.password && user.password.length > 32) errors.password = "Password must be less than or equal to 32 characters";
        if (user.firstName && user.firstName.length > 100) errors.firstName = "First Name must be less than or equal to 100 characters";
        if (user.lastName && user.lastName.length > 100) errors.lastName = "Last Name must be less than or equal to 100 characters";
        if (user.email && user.email.length > 100) errors.email = "Email must be less than or equal to 100 characters";
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return; // Jika ada error, tidak melanjutkan ke proses submit
        }

        setValidationErrors({}); // Reset errors jika tidak ada error

        try {
            const response = await axios.post(import.meta.env.VITE_SERVER_HOST + "/registration", user);
            if (response.data.status === "success") {
                handleShowSuccessModal();
            }
        } catch (err) {
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
                setError("Something went wrong. Please try again.");
            }
        }
    };

    const handleModalClose = () => {
        // Ketika modal ditutup, arahkan ke halaman login
        navigate("/login");
        setShowSuccessModal(false);
    };

    return (
        <div className="d-flex justify-content-center align-items-center mt-3">
            <div className="p-3 rounded w-50 border">
                <h3 className="text-center">Registration User</h3>
                <form className="row g-1" onSubmit={handleSubmit}>
                    <div className="col-12">
                        <label htmlFor="inputUsername" className="form-label">
                            Username
                        </label>
                        <input
                            type="text"
                            className={`form-control rounded-0 ${validationErrors.username ? "is-invalid" : ""}`}
                            id="inputUsername"
                            placeholder="Enter Username"
                            onChange={(e) => setUser({...user, username: e.target.value})}
                        />
                        {validationErrors.username && (
                            <div className="invalid-feedback">{validationErrors.username}</div>
                        )}
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputEmail" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            className={`form-control rounded-0 ${validationErrors.email ? "is-invalid" : ""}`}
                            id="inputEmail"
                            placeholder="Enter Email"
                            autoComplete="off"
                            onChange={(e) => setUser({...user, email: e.target.value})}
                        />
                        {validationErrors.email && (
                            <div className="invalid-feedback">{validationErrors.email}</div>
                        )}
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputPassword" className="form-label">
                            Password
                        </label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`form-control rounded-0 ${validationErrors.password ? "is-invalid" : ""}`}
                                id="inputPassword"
                                placeholder="Enter Password"
                                onChange={(e) => setUser({...user, password: e.target.value})}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash/> : <FaEye/>}
                            </button>
                        </div>
                        {validationErrors.password && (
                            <div className="invalid-feedback">{validationErrors.password}</div>
                        )}
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputFirstName" className="form-label">
                            First Name
                        </label>
                        <input
                            type="text"
                            className={`form-control rounded-0 ${validationErrors.firstName ? "is-invalid" : ""}`}
                            id="inputFirstName"
                            placeholder="Enter First Name"
                            autoComplete="off"
                            onChange={(e) => setUser({...user, firstName: e.target.value})}
                        />
                        {validationErrors.firstName && (
                            <div className="invalid-feedback">{validationErrors.firstName}</div>
                        )}
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputLastName" className="form-label">
                            Last Name
                        </label>
                        <input
                            type="text"
                            className={`form-control rounded-0 ${validationErrors.lastName ? "is-invalid" : ""}`}
                            id="inputLastName"
                            placeholder="Enter Last Name"
                            autoComplete="off"
                            onChange={(e) => setUser({...user, lastName: e.target.value})}
                        />
                        {validationErrors.lastName && (
                            <div className="invalid-feedback">{validationErrors.lastName}</div>
                        )}
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary w-100">
                            Register
                        </button>
                    </div>
                </form>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>

            {/* Modal untuk konfirmasi sukses */}
            {showSuccessModal && (
                <div className="modal-container" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
                        <div className="modal-header">
                            <h3>Registration Successful</h3>
                        </div>
                        <div className="modal-body">
                            <p>Your registration was successful! You can now log in to your account.</p>
                        </div>
                        <div>
                            <button className="modal-ok-btn" onClick={handleRedirectToLogin}>OK</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;
