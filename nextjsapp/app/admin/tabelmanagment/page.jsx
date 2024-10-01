"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import CallFor from '@/utilities/CallFor';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

function StaffPage() {
    const router = useRouter();
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [guestName, setGuestName] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedChairs, setSelectedChairs] = useState([]);
    const [unbookedChairs, setUnbookedChairs] = useState([]);

    const fetchTables = async () => {
        try {
            const response = await CallFor("tables/booked", "get", "null", "Auth");
            setTables(response.data);
        } catch (error) {
            console.error("Error fetching tables:", error);
        }
    };

    useEffect(() => {
        fetchTables(); 
    }, []);

    const openPopup = (table) => {
        setSelectedTable(table);
        setIsPopupOpen(true);
        setSelectedChairs([]); 
        setUnbookedChairs([]); // Reset unbooked chairs when opening a new popup
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setGuestName("");
        setUnbookedChairs([]); // Reset unbooked chairs on close
    };

    const handleBooking = async () => {
        if (!guestName.trim()) {
            toast.error("Guest name is required.");
            return;
        }

        if (selectedChairs.length === 0) {
            toast.error("At least one chair must be selected.");
            return;
        }

        try {
            const response = await CallFor("tables/book", "post", {
                tableId: selectedTable.id,
                chairsToBook: selectedChairs.length,
                guestName: guestName,
            }, "Auth");

            console.log("Booking response:", response.data);

            if (response.data) {
                closePopup();
                fetchTables();
                router.push("/admin/tabelmanagment");
            }
        } catch (error) {
            console.error("Error booking chairs:", error);
        }
    };

    const handleUnbooking = async () => {
        if (unbookedChairs.length === 0) {
            toast.error("At least one chair must be selected for unbooking.");
            return;
        }

        try {
            const response = await CallFor("tables/unbook", "post", {
                tableId: selectedTable.id,
                chairsToUnbook: unbookedChairs.length,
            }, "Auth");

            console.log("Unbooking response:", response.data);

            if (response.data) {
                closePopup();
                fetchTables();
            }
        } catch (error) {
            console.error("Error unbooking chairs:", error);
        }
    };

    return (
        <div className='p-3'>
            <Toaster position="top-center" reverseOrder={false} />
            <div className='flex justify-between my-3'>
                <h1 className='text-2xl font-bold text-orange-600'>Table Management</h1>
                <button
                    type="button"
                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                    <Link href={"/admin/tabel/addtabel"}> Add </Link>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables.map((table) => (
                    <TableWithChairs
                        key={table._id}
                        table={{
                            id: table._id,
                            tableNumber: table.tableNumber,
                            chairs: table.totalChairs,
                            bookedChairs: Array.from({ length: table.bookedChairs }, (_, index) => index),
                            bookedBy: table.bookedBy,
                            guestName: table.guestName
                        }}
                        openPopup={openPopup}
                    />
                ))}
            </div>

            {isPopupOpen && selectedTable && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-5 shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-bold mb-2">Manage Chairs for Table {selectedTable?.tableNumber}</h2>
                        <input
                            type="text"
                            placeholder="Guest Name"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            required
                            className="border border-gray-300 rounded-lg p-2 w-full mb-4"
                        />
                        
                        <div className="flex flex-col mb-4">
                            <span>Available Chairs:</span>
                            <div className="flex flex-wrap w-full">
                                {Array.from({ length: selectedTable.chairs }).slice(0, 30).map((_, index) => (
                                    <button
                                        key={index}
                                        className={`bg-gray-300 w-6 h-6 rounded-full m-1 flex items-center justify-center ${selectedTable.bookedChairs.includes(index) ? 'bg-red-500' : selectedChairs.includes(index) ? 'bg-yellow-500' : 'bg-green-500'}`}
                                        onClick={() => {
                                            if (!selectedTable.bookedChairs.includes(index)) {
                                                setSelectedChairs(prev =>
                                                    prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
                                                );
                                            }
                                        }}
                                        disabled={selectedTable.bookedChairs.includes(index)}
                                    >
                                        {selectedTable.bookedChairs.includes(index) ? "X" : index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col mb-4">
                            <span>Selected Chairs:</span>
                            <div className="flex">
                                {selectedChairs.map((index) => (
                                    <span key={index} className="bg-yellow-500 w-6 h-6 rounded-full m-1 flex items-center justify-center">
                                        {index + 1}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col mb-4">
                            <span>Chairs to Unbook:</span>
                            <div className="flex flex-wrap w-full">
                                {selectedTable.bookedChairs.map((index) => (
                                    <button
                                        key={index}
                                        className={`bg-gray-300 w-6 h-6 rounded-full m-1 flex items-center justify-center ${unbookedChairs.includes(index) ? 'bg-blue-500' : 'bg-red-500'}`}
                                        onClick={() => {
                                            setUnbookedChairs(prev =>
                                                prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
                                            );
                                        }}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex">
                            <button
                                onClick={handleBooking}
                                className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
                            >
                                Book Chairs
                            </button>
                            <button
                                onClick={handleUnbooking}
                                className="text-white bg-purple-500 hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
                            >
                                Unbook Chairs
                            </button>
                            <button
                                onClick={closePopup}
                                className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const TableWithChairs = ({ table, openPopup }) => (
    <div
        className="relative w-full h-56 border-2 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer"
        onClick={() => openPopup(table)}
    >
        <div className="absolute top-0 left-0 m-1 text-xs font-bold ">
            Table {table.tableNumber} {table.guestName && <span>(Booked by: {table.guestName})</span>} <br />
            Table {table.tableNumber} {table?.bookedBy == null ? table.guestName == null ? '' : 'Waiter Name:Owner' : <span>(Waiter Name:{table?.bookedBy.name})</span>}


        </div>
        
        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center ">
            <span className="text-xl font-bold">{table.chairs}</span>
        </div>
        {Array.from({ length: table.chairs }).map((_, index) => (
            <button
                key={index}
                className={`absolute w-6 h-6 m-1 rounded-full ${table.bookedChairs.includes(index) ? 'bg-red-500' : 'bg-green-500'}`}
                style={{
                    top: `${Math.sin((2 * Math.PI * index) / table.chairs) * 40 + 50}%`,
                    left: `${Math.cos((2 * Math.PI * index) / table.chairs) * 40 + 50}%`,
                    transform: 'translate(-50%, -50%)'
                }}
                disabled={table.bookedChairs.includes(index)}
            >
                {table.bookedChairs.includes(index) ? "X" : index + 1}
            </button>
        ))}
        <div className="absolute bottom-0 left-0 m-1 text-xs font-bold">
            Booked: {table.bookedChairs.length}/{table.chairs}
        </div>
    </div>
);

export default StaffPage;
