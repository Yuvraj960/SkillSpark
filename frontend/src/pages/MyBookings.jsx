// import { useEffect, useState } from "react";
// import { getMyBookings, createBooking } from "../services/api";

// const MyBookings = () => {
//     const [bookings, setBookings] = useState([]);

//     useEffect(() => {
//         const fetchBookings = async () => {
//             try {
//                 const res = await getMyBookings();
//                 setBookings(res.data);
//             } catch (error) {
//                 console.error("Error fetching bookings:", error);
//             }
//         };
//         fetchBookings();
//     }, []);

//     const handleCreateBooking = async () => {
//         try {
//             const newBooking = {
//                 skillId: "<SOME_SKILL_ID>",
//                 sessionDate: new Date().toISOString(),
//                 paymentAmount: 50,
//             };
//             await createBooking(newBooking);
//             alert("Booking created!");
//         } catch (error) {
//             console.error("Booking creation error:", error);
//         }
//     };

//     return (
//         <div style={{ padding: "1rem" }}>
//             <h2>My Bookings</h2>
//             <button onClick={handleCreateBooking}>Create a Test Booking</button>
//             <ul style={{ marginTop: "1rem" }}>
//                 {bookings.map((booking) => (
//                     <li key={booking._id}>
//                         <p>Skill: {booking.skill?.title}</p>
//                         <p>Status: {booking.status}</p>
//                         <p>
//                             Session Date:{" "}
//                             {new Date(booking.sessionDate).toLocaleString()}
//                         </p>
//                         <hr />
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default MyBookings;

import { useEffect, useState } from "react";
import { getMyBookings, createBooking } from "../services/api";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [skillId, setSkillId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getMyBookings();
                setBookings(res.data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                setError("Failed to fetch bookings. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleCreateBooking = async () => {
        if (!skillId) {
            alert("Please enter a valid skill ID.");
            return;
        }

        try {
            const newBooking = {
                skillId: skillId, // Dynamically use input skill ID
                sessionDate: new Date().toISOString(), // Current date as session date
                paymentAmount: 50, // Test payment amount
            };
            await createBooking(newBooking);
            alert("Booking created!");

            const res = await getMyBookings();
            setBookings(res.data);
        } catch (error) {
            console.error("Booking creation error:", error);
            alert("Failed to create booking. Please try again.");
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>My Bookings</h2>

            <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="skillId">Skill ID:</label>
                <input
                    type="text"
                    id="skillId"
                    value={skillId}
                    onChange={(e) => setSkillId(e.target.value)}
                    placeholder="Enter Skill ID"
                    style={{
                        marginLeft: "0.5rem",
                        padding: "0.5rem",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                    }}
                />
                <button
                    onClick={handleCreateBooking}
                    style={{
                        marginLeft: "1rem",
                        padding: "0.5rem 1rem",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Create Booking
                </button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {loading ? (
                <p>Loading bookings...</p>
            ) : (
                <ul style={{ marginTop: "1rem" }}>
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <li
                                key={booking._id}
                                style={{ marginBottom: "1rem" }}
                            >
                                <p>
                                    <strong>Skill:</strong>{" "}
                                    {booking.skill?.title || "N/A"}
                                </p>
                                <p>
                                    <strong>Status:</strong> {booking.status}
                                </p>
                                <p>
                                    <strong>Session Date:</strong>{" "}
                                    {new Date(
                                        booking.sessionDate
                                    ).toLocaleString()}
                                </p>
                                <hr />
                            </li>
                        ))
                    ) : (
                        <p>No bookings found.</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default MyBookings;
