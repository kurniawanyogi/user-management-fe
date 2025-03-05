import React, {useState, useEffect, useCallback} from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomModal from './CustomModal'; // Import CustomModal component

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);  // State for confirmation modal
    const [showSuccessModal, setShowSuccessModal] = useState(false);  // State for success modal
    const [modalClosed, setModalClosed] = useState(false); // untuk handle ketika modal berhasil di close, akan trigger useEffect

    const navigate = useCallback((url) => {
        // your navigate logic here, for example with useNavigate() from react-router-dom
        // navigate(url);
    }, []);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("authToken");

        if (userId && token) {
            axios.get(import.meta.env.VITE_SERVER_HOST + `/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    setUser(res.data.data);
                    setFormValues({
                        firstName: res.data.data.firstName,
                        lastName: res.data.data.lastName,
                    });
                })
                .catch(err => {
                    if (err.response) {
                        if (err.response.data.message === 'Authorization token is missing') {
                            setError('Token is missing. Please log in again.');
                        } else if (err.response.data.message === 'invalid token') {
                            setError('Invalid token. Please log in again.');
                        } else {
                            setError('Failed to fetch user data.');
                        }
                    } else {
                        setError('Network error. Please check your connection.');
                    }
                })
                .finally(() => {
                    setLoading(false);
                    setModalClosed(false); // Reset modalClosed setelah useEffect selesai
                });
        } else {
            setError("Users Not Authenticate");
            navigate("/login");
        }
    }, [navigate, modalClosed]); // Tetap menjaga modalClosed sebagai dependensi


    // Validasi Frontend untuk First Name dan Last Name
    const validateForm = () => {
        const errors = {};

        // Validasi First Name
        if (!formValues.firstName) {
            errors.firstName = "First Name is required";
        } else if (formValues.firstName.length > 100) {
            errors.firstName = "First Name must be less than or equal to 100 characters";
        }

        // Validasi Last Name
        if (formValues.lastName.length > 100) {
            errors.lastName = "Last Name must be less than or equal to 100 characters";
        }

        return errors;
    };

    // Handle changes in input fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle the submit (Save Changes)
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasi form
        const errors = validateForm();
        setValidationErrors(errors);
        if (Object.keys(errors).length > 0) return; // Jika ada error, tidak melanjutkan ke proses submit

        // Show confirmation modal
        setShowConfirmModal(true);
    };

    // Handle cancel action (revert changes)
    const handleCancel = () => {
        setFormValues({
            firstName: user.firstName,
            lastName: user.lastName
        });
    };

    // Handle Confirm Modal
    const handleConfirmUpdate = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('authToken');

        if (userId && token) {
            try {
                const response = await axios.put(
                    `${import.meta.env.VITE_SERVER_HOST}/${userId}`,
                    {
                        firstName: formValues.firstName,
                        lastName: formValues.lastName
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data.status === 'success') {
                    setUser(response.data.data); // Update user data in state
                    setShowSuccessModal(true); // Show success modal
                } else {
                    setError('Failed to update user data');
                }
            } catch (err) {
                if (err.response) {
                    setError(err.response.data.message); // Server error message
                } else {
                    setError('Network error. Please check your connection.');
                }
            }
        }
        setShowConfirmModal(false); // Close confirmation modal after update attempt
    };

    // Handle Success Modal
    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        setModalClosed(true); // Menandai bahwa modal telah ditutup
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="d-flex justify-content-center align-items-center mt-3">
            <div className="p-3 rounded w-50 border">
                <h3 className="text-center">Profile</h3>

                {user && (
                    <div>
                        <form className="row g-1" onSubmit={handleSubmit}>
                            <div className="col-12">
                                <label htmlFor="inputUsername" className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control rounded-0"
                                    id="inputUsername"
                                    value={user.username}
                                    disabled
                                />
                            </div>
                            <div className="col-12">
                                <label htmlFor="inputEmail" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control rounded-0"
                                    id="inputEmail"
                                    value={user.email}
                                    disabled
                                />
                            </div>
                            <div className="col-12">
                                <label htmlFor="inputFirstName" className="form-label">First Name</label>
                                <input
                                    type="text"
                                    className={`form-control rounded-0 ${validationErrors.firstName ? "is-invalid" : ""}`}
                                    id="inputFirstName"
                                    placeholder="Enter First Name"
                                    value={formValues.firstName}
                                    name="firstName"
                                    onChange={handleInputChange}
                                />
                                {validationErrors.firstName && (
                                    <div className="invalid-feedback">{validationErrors.firstName}</div>
                                )}
                            </div>
                            <div className="col-12">
                                <label htmlFor="inputLastName" className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    className={`form-control rounded-0 ${validationErrors.lastName ? "is-invalid" : ""}`}
                                    id="inputLastName"
                                    placeholder="Enter Last Name"
                                    value={formValues.lastName}
                                    name="lastName"
                                    onChange={handleInputChange}
                                />
                                {validationErrors.lastName && (
                                    <div className="invalid-feedback">{validationErrors.lastName}</div>
                                )}
                            </div>
                            <div className="col-12 mt-3">
                                <button type="submit" className="btn btn-primary w-100">Save Changes</button>
                            </div>
                            <div className="col-12 mt-2">
                                <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* Modal Konfirmasi */}
            <CustomModal
                show={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title="Confirm Update"
                message="Are you sure you want to update your profile?"
                onConfirm={handleConfirmUpdate}
                confirmText="Yes"
                cancelText="No"
            />

            {/* Modal Sukses */}
            <CustomModal
                show={showSuccessModal}
                onClose={handleCloseSuccessModal}
                title="Success"
                message="Profile updated successfully!"
                onConfirm={handleCloseSuccessModal} // Close the success modal
                confirmText="OK"
            />
        </div>
    );
};

export default Profile;
