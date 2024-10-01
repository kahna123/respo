"use client"
import React, { useEffect, useState } from 'react';
import { ViewIcon, EditIcon, DeleteIcon , Trash, Eye} from 'lucide-react'; // Make sure to install lucide-react if not already done
import CallFor from '@/utilities/CallFor';
import Link from 'next/link';
import Deletecomp from '@/components/Deletecomp';
function Page() {
    const [waiters, setWaiters] = useState([]);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [deleteEndpoint, setDeleteEndpoint] = useState('');

    useEffect(() => {
        const fetchWaiters = async () => {
            try {

				const response = await CallFor("waiters","get","null","Auth")
                const data = await response.data
                setWaiters(data);
            } catch (error) {
                console.error("Error fetching waiters:", error);
            }
        };

        fetchWaiters();
    }, []);



    

    const handleOpenPopup = (endpoint) => {
        setDeleteEndpoint(endpoint); // Set the unique delete endpoint
        setIsPopupOpen(true); // Open the popup
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    // Example function to handle delete actions
    const handleDeleteAction = (itemId) => {
        // Replace with your actual delete endpoint, appending item ID if needed
        const endpoint = `http://localhost:5000/api/waiters/${itemId}`;
        handleOpenPopup(endpoint);
    };
    return (
		<>

<div className=' p-3'>
		<div className='flex justify-between my-3'>
			<h1 className='text-2xl font-bold text-orange-600'>Staff</h1>

            <button type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
            <Link href={"/admin/staff/addstaff"}> Add </Link>
            </button>


		</div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Mobile No</th>
                        <th scope="col" className="px-6 py-3">Aadhar Card No</th>
                        <th scope="col" className="px-6 py-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {waiters && waiters.map((waiter) => (
                        <tr key={waiter._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{waiter.name}</td>
                            <td className="px-6 py-4">{waiter.email}</td>
                            <td className="px-6 py-4">{waiter.mobileNo}</td>
                            <td className="px-6 py-4">{waiter.aadharCardNo}</td>
                            <td className="px-6 py-4 text-right">
                                <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                    <Eye size={20} />  
                                </button>
                                <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-2">
								<Link href={`/admin/staff/editstaff/${waiter._id}`}>    <EditIcon size={20} /> </Link>
                                </button>
                                <button className="font-medium text-red-600 dark:text-red-500 hover:underline" onClick={() => handleDeleteAction(waiter._id)}>
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
