
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TicketList() {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the current admin's email and tickets
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Use your token storage key
        if (!accessToken) throw new Error("No access token found");

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        // Fetch admin email
        const adminResponse = await fetch("http://localhost:4000/api/v1/admins/current-admin", config);
        const adminData = await adminResponse.json();
        if (adminData && adminData.data) {
          setAdminEmail(adminData.data.email);
        } else {
          throw new Error("Invalid admin response format");
        }

        // Fetch tickets for the admin
        const ticketsResponse = await fetch('http://localhost:4000/api/v1/tickets/get-ticket', config);
        const ticketsData = await ticketsResponse.json();
        if (ticketsData && ticketsData.data) {
          setTickets(ticketsData.data);
        } else {
          throw new Error("Invalid tickets response format");
        }
      } catch (err) {
        setError("Failed to fetch tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleDeleteTicket = async (seatNumber, journey) => {
    try {
      const accessToken = localStorage.getItem("accessToken"); // Use your token storage key
      if (!accessToken) throw new Error("No access token found");

      const config = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ seatNumber, journey }),
      };

      if(journey === "IIIT to Civil Lines"){
        const response = await fetch("http://localhost:4000/api/v1/tickets/delete-ticket", config);
        const data = await response.json();

        if (response.status !== 200) {
          throw new Error(data.message || "Failed to delete the ticket");
        }
      }
      else if(journey === "Civil Lines to IIIT"){
        const response = await fetch("http://localhost:4000/api/v1/tickets/delete-ticket2", config);
        const data = await response.json();

        if (response.status !== 200) {
          throw new Error(data.message || "Failed to delete the ticket");
        }
      }

      // Update the ticket list after deletion
      setTickets((prevTickets) => prevTickets.filter(ticket => !(ticket.seatNo === seatNumber && ticket.journey === journey)));
      alert("Ticket deleted successfully");
    } catch (error) {
      alert("Failed to delete ticket: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20">
        <p className="text-lg">Loading tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20">
        <p className="text-lg text-red-500">{error}</p>
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-md mt-4"
          onClick={() => navigate("/home-admin")}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-4">
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold mb-8">Your Booked Tickets</h1>
        <div className="border rounded-lg p-6 max-w-md mx-auto bg-gray-100">
          {tickets.length === 0 ? (
            <p className="text-lg">No tickets found.</p>
          ) : (
            <ul>
              {tickets.map((ticket, index) => (
                <li key={index} className="mb-4 border-b pb-2">
                  <p className="text-lg">
                    Journey: <span className="font-bold">{ticket.journey}</span>
                  </p>
                  <p className="text-lg">
                    Seat Number: <span className="font-bold">{ticket.seatNo}</span>
                  </p>
                  <p className="text-lg">
                    Booking Date: <span className="font-bold">{new Date(ticket.date).toLocaleDateString()}</span>
                  </p>
                  {new Date(ticket.date).toDateString() === new Date().toDateString() && (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
                      onClick={() => handleDeleteTicket(ticket.seatNo, ticket.journey)}
                    >
                      Delete Ticket
                    </button>
                  )}
                </li>
              ))}
            </ul>
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
