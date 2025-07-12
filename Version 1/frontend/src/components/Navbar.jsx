/* eslint-disable react-hooks/exhaustive-deps */
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Logo from "../images/logo.png";

const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUsername = localStorage.getItem("username");
        if (token && savedUsername) {
            // const decoded = JSON.parse(atob(token.split(".")[1]));
            setLoggedIn(true);
            setUsername(username);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setLoggedIn(false);
        navigate("/login");
    };

    return (
        <nav className="navbar__container">
            <div className="navbar__logo">
                <h1>
                    {" "}
                    {!loggedIn ? (
                        <NavLink to={"/"}>
                            <img src={Logo} alt="logo" />
                        </NavLink>
                    ) : (
                        <NavLink to={`/${username}`}>
                            <img src={Logo} alt="logo" />
                        </NavLink>
                    )}
                </h1>
            </div>
            <div className="navbar__menu">
                <ul>
                    <li>
                        <NavLink to={`/about`}>About</NavLink>
                    </li>
                    <li>
                        <NavLink to={`/faq`}>FAQ</NavLink>
                    </li>
                    <li>
                        <NavLink to={`/contact`}>Contact Us</NavLink>
                    </li>

                    {loggedIn ? (
                        <>
                            <NavLink to={`/${username}`}>Dashboard</NavLink>
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <li>
                                <NavLink to={`/Signup`}>Signup</NavLink>
                            </li>
                            <li>
                                <NavLink to={`/Login`}>Login</NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
