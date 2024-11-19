import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Ticket() {
    const location = useLocation();
    const navigate = useNavigate();
    const { seatNumber } = location.state || {};

    const [adminEmail, setAdminEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch the current admin's email
    useEffect(() => {
        const fetchAdminEmail = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken"); // Use your token storage key
                if (!accessToken) throw new Error("No access token found");

                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                };

                const response = await fetch("http://localhost:4000/api/v1/admins/current-admin", config);
                const data = await response.json();
                if (data && data.data) {
                    setAdminEmail(data.data.email); // Set admin email fetched from backend
                } else {
                    throw new Error("Invalid response format");
                }
            } catch (err) {
                setError("Failed to fetch admin details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchAdminEmail();
    }, []);

       // Function to handle booking the ticket
       const handleBookTicket = async () => {
        try {
            const email = adminEmail; // Assuming admin email as the logged-in user
            const date = new Date().toISOString().split('T')[0];
            const journey = "IIIT to Civil Lines"; // Assuming a static journey for now

            const response = await fetch("http://localhost:4000/api/v1/tickets/book-ticket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    seatNo: seatNumber,
                    date,
                    journey,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Ticket booked successfully: " + result.message);
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            alert("Failed to book ticket: " + err.message);
        }
    };

    if (!seatNumber) {
        return (
            <div className="text-center mt-20">
                <h1 className="text-3xl font-bold mb-4">No Ticket Available</h1>
                <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-md mt-4"
                    onClick={() => navigate("/home-admin")}
                >
                    Back to Booking
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-7xl p-4">
            <div className="text-center mt-20">
                <h1 className="text-3xl font-bold mb-8">Ticket Booked from IIIT to Civil Lines</h1>
                <div className="border rounded-lg p-6 max-w-md mx-auto bg-gray-100">
                    {loading ? (
                        <p className="text-lg">Loading admin details...</p>
                    ) : error ? (
                        <p className="text-lg text-red-500">{error}</p>
                    ) : (
                        <>
                            <h2 className="text-2xl font-medium mb-4">Your Ticket Details</h2>
                            <p className="text-lg mb-4">
                                Logged-in Admin: <span className="font-bold">{adminEmail}</span>
                            </p>
                            <p className="text-xl mb-2">
                                Seat Number: <span className="font-bold">{seatNumber}</span>
                            </p>
                            <p className="text-lg">
                                Booking Date: <span className="font-bold">{new Date().toLocaleDateString()}</span>
                            </p>

                            {/* Form to submit ticket details to admin email */}
                            <form 
                                action={`https://formsubmit.co/${adminEmail}`} 
                                method="POST"
                            >
                                <input type="hidden" name="_subject" value="New Ticket Confirmation" />
                                <input type="hidden" name="seatNumber" value={seatNumber} />
                                <input type="hidden" name="bookingDate" value={new Date().toLocaleDateString()} />
                                <input type="hidden" name="adminEmail" value={adminEmail} />

                                {/* This button triggers the form submission and sends the email */}
                                <button 
                                    type="submit" 
                                    className="bg-green-600 text-white px-6 py-2 rounded-md mt-4"
                                    onClick={handleBookTicket}
                                >
                                    Send Confirmation Email
                                </button>
                            </form>
                        </>
                    )}
                </div>
                <button
                    className="bg-yellow-500 text-black px-6 py-2 rounded-md mt-8"
                    onClick={() => navigate("/home-admin")}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}
