import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const Dashboard = () => {
    const location = useLocation();
    const userFirstName = localStorage.getItem("userFirstName");

    // Hanya tampilkan sidebar jika URL bukan /login
    if (location.pathname === "/login") {
        return <Outlet />;
    }

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                        <Link to="/dashboard" className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none">
                            <span className="fs-5 fw-bolder d-none d-sm-inline">
                                Hi, {userFirstName}
                            </span>
                        </Link>
                        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                            <li className="w-100">
                                <Link to="/dashboard" className="nav-link text-white px-0 align-middle">
                                    <i className="fs-4 bi-speedometer2 ms-2"></i>
                                    <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                                </Link>
                            </li>
                            <li className="w-100">
                                <Link to="/dashboard/users" className="nav-link px-0 align-middle text-white">
                                    <i className="fs-4 bi-people ms-2"></i>
                                    <span className="ms-2 d-none d-sm-inline">Manage users</span>
                                </Link>
                            </li>
                            <li className="w-100">
                                <Link to="/dashboard/profile" className="nav-link px-0 align-middle text-white">
                                    <i className="fs-4 bi-person ms-2"></i>
                                    <span className="ms-2 d-none d-sm-inline">Profile</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col p-0 m-0">
                    <div className="p-2 d-flex justify-content-center shadow">
                        <h4>User Management System</h4>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
