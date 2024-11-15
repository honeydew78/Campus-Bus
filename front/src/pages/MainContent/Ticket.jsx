import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

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

                const response = await axios.get("http://localhost:4000/api/v1/admins/current-admin", config);
                if (response.data && response.data.data) {
                    setAdminEmail(response.data.data.email);
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

    // Send ticket details to admin email
    useEffect(() => {
        const sendTicketEmail = async () => {
            if (adminEmail && seatNumber) {
                try {
                    const accessToken = localStorage.getItem("accessToken"); // Use your token storage key
                    if (!accessToken) throw new Error("No access token found");

                    const config = {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    };

                    const emailData = {
                        to: adminEmail,
                        subject: "Your Confirmed Ticket",
                        body: `Hello,\n\nYour ticket from IIIT to Civil Lines has been confirmed.\n\nSeat Number: ${seatNumber}\nBooking Date: ${new Date().toLocaleDateString()}\n\nThank you.`,
                        seatNumber: seatNumber, // Add seatNumber here
                    };

                    await axios.post("http://localhost:4000/api/v1/admins/send-ticket-confirmation", emailData, config);
                } catch (err) {
                    console.error("Failed to send ticket email: ", err);
                }
            }
        };

        sendTicketEmail();
    }, [adminEmail, seatNumber]);

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
                        </>
                    )}
                </div>
                <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-md mt-8"
                    onClick={() => navigate("/home-admin")}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}
