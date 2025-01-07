import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SkillList from "./pages/SkillList";
import SkillCreate from "./pages/SkillCreate";
import MyBookings from "./pages/MyBookings";

const App = () => {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/skills" element={<SkillList />} />

                <Route
                    path="/create-skill"
                    element={
                        <ProtectedRoute>
                            <SkillCreate />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-bookings"
                    element={
                        <ProtectedRoute>
                            <MyBookings />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<h3>Page Not Found</h3>} />
            </Routes>
        </Router>
    );
};

export default App;
