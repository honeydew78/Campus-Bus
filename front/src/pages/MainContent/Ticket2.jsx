import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Ticket2(){
    const location = useLocation();
    const navigate = useNavigate();
    const { seatNumber } = location.state || {};

    if (!seatNumber) {
        return (
            <div className="text-center mt-20">
                <h1 className="text-3xl font-bold mb-4">No Ticket Available</h1>
                <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-md mt-4"
                    onClick={() => navigate('/home-admin')}
                >
                    Back to Booking
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-7xl p-4">
            <div className="text-center mt-20">
                <h1 className="text-3xl font-bold mb-8">Ticket Booked from Civil lines to IIIT</h1>
                <div className="border rounded-lg p-6 max-w-md mx-auto bg-gray-100">
                    <h2 className="text-2xl font-medium mb-4">Your Ticket Details</h2>
                    <p className="text-xl mb-2">Seat Number: <span className="font-bold">{seatNumber}</span></p>
                    <p className="text-lg">Booking Date: <span className="font-bold">{new Date().toLocaleDateString()}</span></p>
                </div>
                <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-md mt-8"
                    onClick={() => navigate('/home-admin')}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}
