import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import img from '../../assets/bus.png'
export default function BusSeatBooking() {
    const [selectedSeat, setSelectedSeat] = useState(null); // Only one selected 
    const [bookedSeats, setBookedSeats] = useState([]); // Initially no booked seats
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const rows = 4; // Set rows to 4 for multiple lines of seats
    const columns = 10; // Set columns to 10 for a horizontal layout with 4 rows

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
        <div className="flex sm:flex-row flex-col mx-auto w-full max-w-7xl p-4">
            
            <div className="w-3/7 flex items-center justify-center">
                <img
                    src={img} 
                    alt="Bus Interior"
                    className="max-w-full h-auto rounded-lg shadow-md"
                />
            </div>

            
            <div className="w-4/7">
                <h1 className="text-center text-3xl font-bold mb-8">Book your Seat here</h1>
                <p className="ml-16 text-lg"> <span className="text-lg font-medium">Booking from :</span> IIITA to Civil Lines </p>
                <p className="ml-16 text-lg"> <span className="text-lg font-medium">Timing :</span> 6:00 PM  </p>
                <br />
                <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 ml-16 ">
                    {[...Array(rows * columns)].map((_, index) => {
                        const seatNumber = index + 1;
                        const isSelected = selectedSeat === seatNumber;
                        const isBooked = bookedSeats.includes(seatNumber);

                        const isGapRow = Math.floor(index / columns) === 1;

                        return (
                            <div
                                key={seatNumber}
                                className={`cursor-pointer rounded-2xl w-10 h-10 flex items-center justify-center text-center shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl mb-${isGapRow ? 8 : 4} ${
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
                <div className="text-lg ml-16 ">
                    <div className="flex">
                    <div className="p-2 h-8 w-8  rounded-lg bg-gradient-to-br from-green-500 to-green-700 text-white shadow-lg hover:shadow-xl shadow-inner hover:bg-green-800"></div>

                        <p className="text-lg ml-4 pb-4">Available</p>
                    </div>
                    <div className="flex">
                    <div className="p-2 h-8 w-8 rounded-lg bg-gradient-to-br from-green-800 to-green-900 text-white shadow-2xl"></div>

                        <p className="text-lg ml-4 pb-4">Selected</p>
                    </div>
                    <div className="flex">
                    <div className="p-2 h-8 w-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 text-white cursor-not-allowed shadow-lg"></div>

                        <p className="text-lg ml-4 pb-4">Not Available</p>
                    </div>
                    <div className="text-center mt-16">
                    <button
                        className="bg-gradient-to-br from-green-800 to-green-900 text-white px-6 py-2 rounded-2xl shadow-lg hover:shadow-xl transform transition-transform duration-300 disabled:bg-gray-400"
                        onClick={handleConfirmBooking}
                        disabled={!selectedSeat}
                    >
                        Confirm Booking
                    </button>
                </div>
                </div>
                </div>
                <div className="ml-16 text-center mt-8 flex ">
                    <h2 className="text-lg font-medium text-center">Selected Seat:</h2>
                    <div>
                    {selectedSeat ? (
                        <p className="ml-8 text-xl text-green-800">{`Seat ${selectedSeat}`}</p>
                    ) : (
                        <p className="ml-8 ">No seat selected</p>
                    )}
                    </div>
                </div>
                {errorMessage && (
                    <div className="text-center mt-4 text-red-500">
                        {errorMessage}
                    </div>
                )}
                
            </div>
        </div>
    );
}
