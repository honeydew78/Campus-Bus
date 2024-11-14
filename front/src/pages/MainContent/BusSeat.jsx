import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function BusSeatBooking() {
    const [selectedSeat, setSelectedSeat] = useState(null); // Only one selected 
    const [bookedSeats, setBookedSeats] = useState([]); // Initially no booked seats
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const rows = 10; // Number of rows in the bus
    const columns = 4; // Number of seats per row

    useEffect(() => {
        // Fetch all seats from the API
        const fetchSeats = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/v1/seats/get-seats"); // Replace with actual endpoint
                setBookedSeats(response.data.data.filter(seat => seat.isBooked).map(seat => seat.seatNumber));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching seats:", error);
                setLoading(false);
            }
        };

        fetchSeats();
    }, []);

    const handleSeatClick = (seatNumber) => {
        if (!bookedSeats.includes(seatNumber)) {
            setSelectedSeat(seatNumber === selectedSeat ? null : seatNumber); // Deselect if clicked again
        }
    };

    const handleConfirmBooking = async () => {
        if (selectedSeat) {
            try {
                const response = await axios.post("http://localhost:4000/api/v1/seats/book-seat", {
                    seatNumber: selectedSeat
                });
                if (response.status === 200) {
                    setBookedSeats([...bookedSeats, selectedSeat]);
                    navigate('/home-admin/ticket', { state: { seatNumber: selectedSeat } });
                }
            } catch (error) {
                console.error("Error booking seat:", error);
                setErrorMessage("There was an error booking the seat. Please try again.");
            }
        }
    };

    if (loading) {
        return <div className="text-center mt-20">Loading seats...</div>;
    }

    return (
        <div className="mx-auto w-full max-w-7xl p-4">
            <h1 className="text-center text-3xl font-bold mb-8">Bus Booking</h1>
            <div className="grid grid-rows-10 md:grid-rows-[repeat(10,_minmax(0,_1fr))] row-start-[2-1] grid-cols-4 gap-y-2 gap-x-1 max-w-3xl mx-auto">
                {[...Array(rows * columns)].map((_, index) => {
                    const seatNumber = index + 1;
                    const isSelected = selectedSeat === seatNumber;
                    const isBooked = bookedSeats.includes(seatNumber);

                    return (
                        <div
                            key={seatNumber}
                            className={`cursor-pointer rounded-2xl  w-12 h-12 flex items-center justify-center text-center shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl ${
                                isBooked ? "bg-gradient-to-br from-red-600 to-red-800 text-white cursor-not-allowed shadow-lg" :
                                isSelected ? "bg-gradient-to-br from-green-800 to-green-900 text-white shadow-2xl" : "bg-gradient-to-br from-green-500 to-green-700 text-white shadow-lg hover:shadow-xl shadow-inner hover:bg-green-800"
                            }`}
                            onClick={() => handleSeatClick(seatNumber)}
                        >
                            {seatNumber}
                        </div>
                    );
                })}
            </div>
            <div className="text-center mt-8">
                <h2 className="text-xl font-medium">Selected Seat:</h2>
                {selectedSeat ? (
                    <p>{`Seat ${selectedSeat}`}</p>
                ) : (
                    <p>No seat selected</p>
                )}
            </div>
            {errorMessage && (
                <div className="text-center mt-4 text-red-500">
                    {errorMessage}
                </div>
            )}
            <div className="text-center mt-4">
                <button
                    className="bg-gradient-to-br from-green-800 to-green-900 text-white px-6 py-2 rounded-2xl shadow-lg hover:shadow-xl transform transition-transform duration-300 disabled:bg-gray-400"
                    onClick={handleConfirmBooking}
                    disabled={!selectedSeat}
                >
                    Confirm Booking
                </button>
            </div>
        </div>
    );
}

