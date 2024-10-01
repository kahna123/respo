"use client"
import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import CallFor from '@/utilities/CallFor';
import { useRouter } from 'next/navigation';

function AddTablePage() {
  const [tableNumber, setTableNumber] = useState('');
  const [totalChairs, setTotalChairs] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

	const response =  await CallFor("tables","post" , {
        tableNumber,
        totalChairs,
      } , "Auth" )

	  if(response)
	  {

		toast.success('Table added successfully!');
		router.push('/admin/tabelmanagment/tabel');
	  }

    } catch (error) {
      toast.error('Failed to add table. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center  bg-gray-100">
      <Toaster />
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center">Add Table</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700">
              Table Number
            </label>
            <input
              type="text"
              id="tableNumber"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="totalChairs" className="block text-sm font-medium text-gray-700">
              Total Chairs
            </label>
            <input
              type="number"
              id="totalChairs"
              value={totalChairs}
              onChange={(e) => setTotalChairs(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Table
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTablePage;
