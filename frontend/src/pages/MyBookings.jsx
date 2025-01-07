import { useEffect, useState } from "react";
import { getMyBookings, createBooking } from "../services/api";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await getMyBookings();
                setBookings(res.data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };
        fetchBookings();
    }, []);

    const handleCreateBooking = async () => {
        try {
            const newBooking = {
                skillId: "<SOME_SKILL_ID>",
                sessionDate: new Date().toISOString(),
                paymentAmount: 50,
            };
            await createBooking(newBooking);
            alert("Booking created!");
        } catch (error) {
            console.error("Booking creation error:", error);
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>My Bookings</h2>
            <button onClick={handleCreateBooking}>Create a Test Booking</button>
            <ul style={{ marginTop: "1rem" }}>
                {bookings.map((booking) => (
                    <li key={booking._id}>
                        <p>Skill: {booking.skill?.title}</p>
                        <p>Status: {booking.status}</p>
                        <p>
                            Session Date:{" "}
                            {new Date(booking.sessionDate).toLocaleString()}
                        </p>
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyBookings;
