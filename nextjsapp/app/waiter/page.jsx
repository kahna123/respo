"use client";
import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, CreditCard } from 'lucide-react';

const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
];

const userActivityData = [
  { name: 'Week 1', active: 500 },
  { name: 'Week 2', active: 750 },
  { name: 'Week 3', active: 1000 },
  { name: 'Week 4', active: 1250 },
];

export default function Page() {
  const [currentTime, setCurrentTime] = useState('');
  const [userData, setUserData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();

    // Set the initial time and start the interval
    setCurrentTime(new Date().toLocaleString());
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...userData].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setUserData(sortedData);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-medium">Total Revenue</h3>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">$45,231.89</div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-medium">New Customers</h3>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">+2350</div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-medium">Sales</h3>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">+12,234</div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-medium">Active Now</h3>
              </div>
              <div className="text-2xl font-bold">+573</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-medium">Monthly Sales</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-medium">User Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="active" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Data Table */}
          <div className="bg-white shadow-md rounded-lg mt-4 p-4">
            <h3 className="text-lg font-medium">User Data</h3>
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left cursor-pointer" onClick={() => sortData('id')}>ID</th>
                  <th className="py-2 px-4 border-b text-left cursor-pointer" onClick={() => sortData('name')}>Name</th>
                  <th className="py-2 px-4 border-b text-left cursor-pointer" onClick={() => sortData('username')}>Username</th>
                  <th className="py-2 px-4 border-b text-left cursor-pointer" onClick={() => sortData('email')}>Email</th>
                  <th className="py-2 px-4 border-b text-left cursor-pointer" onClick={() => sortData('phone')}>Phone</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{user.id}</td>
                    <td className="py-2 px-4 border-b">{user.name}</td>
                    <td className="py-2 px-4 border-b">{user.username}</td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">{user.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white shadow-md mt-8">
          <div className="max-w-7xl mx-auto py-4 px-4 flex justify-between items-center">
            <p className="text-gray-500 text-sm">© 2024 Your Company. All rights reserved.</p>
            <p className="text-gray-500 text-sm">{currentTime}</p>
          </div>
        </footer>
      </main>
    </div>
  );
}