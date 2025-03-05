import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import CustomModal from "./CustomModal"; // Mengimpor modal reusable

const User = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        if (userId && token) {
            setLoading(true);
            axios
                .get(import.meta.env.VITE_SERVER_HOST, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setUsers(res.data.data);
                })
                .catch((err) => {
                    console.log(err);
                    if (err.response) {
                        if (err.response.data.message === "Authorization token is missing") {
                            setError("Token is missing. Please log in again.");
                        } else if (err.response.data.message === "invalid token") {
                            setError("Invalid token. Please log in again.");
                        } else {
                            setError("Failed to fetch user data.");
                        }
                    } else {
                        setError("Network error. Please check your connection.");
                    }
                })
                .finally(() => setLoading(false));
        } else {
            setError("Users Not Authenticate");
            navigate("/login");
        }
    }, [navigate]);

    const handleDeleteClick = (id) => {
        setSelectedUserId(id);
        setShowConfirmModal(true); // Tampilkan modal konfirmasi
    };

    const handleDelete = () => {
        if (!selectedUserId) return;

        axios
            .delete(import.meta.env.VITE_SERVER_HOST + "/" + selectedUserId, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((result) => {
                    setShowConfirmModal(false); // Menutup modal konfirmasi setelah klik Yes
                    setShowSuccessModal(true); // Tampilkan modal sukses
                    setTimeout(() => {
                        // Reload setelah modal sukses
                        setShowSuccessModal(false); // Menutup modal sukses
                        window.location.reload(); // Reload data setelah sukses
                    }, 1500); // Tutup modal sukses setelah 1.5 detik
            })
            .catch((err) => {
                console.log(err);
                setError("Failed to delete user.");
                setShowConfirmModal(false); // Menutup modal konfirmasi jika error
            });
    };

    return (
        <div className="px-5 mt-3">
            <div className="d-flex justify-content-center">
                <h3>User List</h3>
            </div>

            <div className="mt-3">
                <table className="table">
                    <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((e) => (
                        <tr key={e.id}>
                            <td>{e.firstName}</td>
                            <td>{e.lastName}</td>
                            <td>{e.email}</td>
                            <td>{e.status}</td>
                            <td>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteClick(e.id)} // Buka modal konfirmasi
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Konfirmasi Penghapusan */}
            <CustomModal
                show={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title="Confirm Deletion"
                message="Are you sure you want to delete this user?"
                onConfirm={handleDelete} // Menjalankan handleDelete saat klik Yes
                confirmText="Yes, Delete"
                cancelText="No"
            />

            {/* Modal Sukses Penghapusan */}
            <CustomModal
                show={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Success"
                message="User deleted successfully!"
                onConfirm={() => setShowSuccessModal(false)} // Hanya tutup modal
                confirmText="Close"
            />
        </div>
    );
};

export default User;
