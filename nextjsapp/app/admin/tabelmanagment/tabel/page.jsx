"use client";
import React, { useEffect, useState } from 'react';
import { EditIcon, Trash, Eye, ArrowUp, ArrowDown } from 'lucide-react'; // Ensure you have the correct icons imported
import CallFor from '@/utilities/CallFor';
import Link from 'next/link';
import Deletecomp from '@/components/Deletecomp';

function Page() {
    const [tables, setTables] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [deleteEndpoint, setDeleteEndpoint] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await CallFor("tables/booked", "get", "null", "Auth");
                const data = await response.data;
                setTables(data);
            } catch (error) {
                console.error("Error fetching tables:", error);
            }
        };

        fetchTables();
    }, []);

    const handleOpenPopup = (endpoint) => {
        setDeleteEndpoint(endpoint); // Set the unique delete endpoint
        setIsPopupOpen(true); // Open the popup
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    // Example function to handle delete actions
    const handleDeleteAction = (tableId) => {
        // Replace with your actual delete endpoint, appending table ID if needed
        const endpoint = `http://localhost:5000/api/tables/${tableId}`;
        handleOpenPopup(endpoint);
    };

    // Sorting handler
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedTables = React.useMemo(() => {
        let sortableTables = [...tables];
        if (sortConfig.key !== null) {
            sortableTables.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableTables;
    }, [tables, sortConfig]);

    return (
        <>
            <div className='p-3'>
                <div className='flex justify-between my-3'>
                    <h1 className='text-2xl font-bold text-orange-600'>Tables</h1>
                    <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        <Link href={"/admin/tabelmanagment/tabel/addtabel"}> Add Table </Link>
                    </button>
                </div>

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {['createddate', 'tableNumber', 'totalChairs', 'bookedChairs', 'bookedBy', 'guestName', 'bookingTime'].map((key) => (
                                    <th
                                        key={key}
                                        scope="col"
                                        className="px-6 py-3 cursor-pointer"
                                        onClick={() => handleSort(key)}
                                    >
                                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                        {sortConfig.key === key && (
                                            sortConfig.direction === 'ascending' ? <ArrowUp size={16} className="inline-block ml-1" /> : <ArrowDown size={16} className="inline-block ml-1" />
                                        )}
                                    </th>
                                ))}
                                <th scope="col" className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTables && sortedTables.map((table) => (
                                <tr key={table._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">{table.createddate ? new Date(table.createddate).toLocaleString() : 'N/A'}</td>
                                    <td className="px-6 py-4">{table.tableNumber}</td>
                                    <td className="px-6 py-4">{table.totalChairs}</td>
                                    <td className="px-6 py-4">{table.bookedChairs}</td>
                                    <td className="px-6 py-4">{table.bookedBy?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">{table.guestName}</td>
                                    <td className="px-6 py-4">{new Date(table.bookingTime).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        {/* <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            <Eye size={20} />
                                        </button> */}
                                        <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-2">
                                            <Link href={`/admin/tabelmanagment/tabel/edittabel/${table._id}`}><EditIcon size={20} /></Link>
                                        </button>
                                        <button className="font-medium text-red-600 dark:text-red-500 hover:underline" onClick={() => handleDeleteAction(table._id)}>
                                            <Trash size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Deletecomp
                    isOpen={isPopupOpen}
                    onClose={handleClosePopup}
                    deleteEndpoint={deleteEndpoint}
                />
            </div>
        </>
    );
}

export default Page;
