import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./components/Login.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard.jsx";
import Profile from "./components/Profile.jsx";
import Register from "./components/Register.jsx";
import User from "./components/User.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rute untuk login dan register */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Rute untuk Dashboard yang akan menampilkan Sidebar */}
                <Route path="/dashboard" element={<Dashboard />}>
                    {/* Halaman yang akan dirender di dalam <Outlet /> */}
                    <Route index element={<h1></h1>} /> {/* Halaman utama dashboard */}
                    <Route path="users" element={<User />} /> {/* Halaman User */}
                    <Route path="profile" element={<Profile />} /> {/* Halaman Profile */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
