/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"; 
import axios from "../api/axiosConfig"; 
import "../styles/Userpage.css";
import { NavLink } from "react-router-dom";
 
const Userpage = () => { 
  const [user, setUser] = useState(null); 
  const [bookings, setBookings] = useState([]); 
  const [linkedGitHub, setLinkedGitHub] = useState(false); 
 
  useEffect(() => { 
    fetchUserData(); 
    fetchBookings(); 
  }, []); 
 
  const fetchUserData = async () => { 
    try { 
      const response = await axios.get("/api/user"); 
      setUser(response.data); 
      setLinkedGitHub(!!response.data.githubUrl); 
    } catch (error) { 
      console.error("Error fetching user data:", error); 
    } 
  }; 
 
  const fetchBookings = async () => { 
    try { 
      const response = await axios.get("/api/bookings"); 
      setBookings(response.data); 
    } catch (error) { 
      console.error("Error fetching bookings:", error); 
    } 
  }; 
 
  // const handleMarkFulfilled = async (bookingId) => { 
  //   try { 
  //     await axios.post(`/api/bookings/${bookingId}/fulfill`); 
  //     fetchBookings(); 
  //     alert("Booking marked as fulfilled!"); 
  //   } catch (error) { 
  //     console.error("Error marking booking as fulfilled:", error); 
  //   } 
  // }; 
 
  // const handleLinkGitHub = () => { 
  //   window.location.href = "/auth/github"; 
  // }; 
 
  return ( 
    <div className="dashboard-container"> 
      <h1>Welcome to SkillSpark</h1> 

      {/* Dashboard Cards */} 
      <div className="cards-container"> 
        <div className="card"> 
          <h2>View your Skills</h2> 
          <p>Add more skills to have more chances to get booked!</p> 
          <NavLink className="btn-primary dashbuttons" to={`/yourskills`}>See Skills!</NavLink>
          {/* <button className="btn-primary">Book Now</button>  */}
        </div> 
 
        <div className="card"> 
          <h2>Sparky Profile Check</h2> 
          <p>Check other Sparky's profile for your project booking!</p> 
          <NavLink className="btn-primary dashbuttons" to={`/sparkies`}>See Sparkies!</NavLink>
          {/* <button className="btn-primary">Check Profile</button>  */}
        </div> 
 
        <div className="card"> 
          <h2>Review and Ratings System Check</h2> 
          <p>View your ratings and reviews from other users.</p> 
          <button className="btn-primary">Check Reviews</button> 
        </div> 
 
        <div className="card"> 
          <h2>Progress of Sparky Check</h2> 
          <p>Track the progress of your Sparky profile and achievements.</p> 
          <button className="btn-primary">Check Progress</button> 
        </div> 
      </div> 
 
      {/* Booking Section */} 
      {/* <h2>Your Bookings</h2> 
      {bookings.length > 0 ? ( 
        <div className="booking-list"> 
          {bookings.map((booking) => ( 
            <div key={booking.id} className="booking-card"> 
              <h3>{booking.clientName}</h3> 
              <p>{booking.projectDetails}</p> 
              <p>Status: {booking.status}</p> 
              {booking.status === "Pending" && ( 
                <button 
                  className="btn-success" 
                  onClick={() => handleMarkFulfilled(booking.id)} 
                > 
                  Mark as Fulfilled 
                </button> 
              )} 
            </div> 
          ))} 
        </div> 
      ) : ( 
        <p></p> 
      )}  */}
    </div> 
  ); 
}; 
 
export default Userpage;


// import { useEffect, useState } from "react";

// const Userpage = () => {
//   const [userData, setUserData] = useState(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const email = localStorage.getItem("email");
//       if (!email) {
//         setError("User email not found in localStorage");
//         return;
//       }

//       try {
//         const response = await fetch(`http://localhost:5000/dashboard-data`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email }),
//         });

//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.error);
//         }

//         setUserData(data[0]); // Assuming only one user will match the email
//       } catch (err) {
//         setError(err.message || "Failed to fetch user data");
//       }
//     };

//     fetchUserData();
//   }, []);

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!userData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h2>Welcome, {userData.name}!</h2>
//       <p>Email: {userData.email}</p>
//       <p>GitHub: {userData.gitHub}</p>
//     </div>
//   );
// };

// export default Userpage;
