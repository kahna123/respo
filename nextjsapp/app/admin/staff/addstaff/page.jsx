"use client";
import CallFor from '@/utilities/CallFor';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobileNo: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile No must be exactly 10 digits") // Match exactly 10 digits
        .required('Mobile No is required'),
    aadharCardNo: Yup.string()
        .matches(/^[0-9]{12}$/, "Aadhar Card No must be exactly 12 digits") // Match exactly 12 digits
        .required('Aadhar Card No is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Page = () => {
	const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNo: '',
        aadharCardNo: '',
        password: '',
        owner: ''
    });
    const [errors, setErrors] = useState({});
	const ownerid = sessionStorage.getItem('usedata');
	 const owner = JSON.parse(ownerid);
	 console.log();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setErrors({ ...errors, [name]: '' }); // Reset error for the field being edited
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate the form data
            await validationSchema.validate(formData, { abortEarly: false });

            const dataToSend = {
                ...formData,
                owner: owner.data._id, // Assuming this should come from the user session
            };

            const response = await CallFor("waiters", "post", dataToSend, "Auth");
            if (!response.data) {
                toast.error('error');
            }

            toast.success('add user');
			router.push("/admin/staff/")

           
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = {};
                error.inner.forEach(err => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors); // Set validation errors
            } else {
                console.error('Error:', error);
                alert('There was a problem with the submission.');
            }
        }
    };

    return (
        <div className="mx-4 mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg  dark:bg-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-left text-orange-500 pb-5">Add Staff</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className='flex'>
                        <label htmlFor="name" className="font-bold text-orange-500 pr-3">Name:</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            
                            className={`border rounded-md w-full p-2 mt-1 ${errors.name ? 'border-red-500' : ''}`}
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>
                    <div className='flex'>
                        <label htmlFor="email" className="font-bold text-orange-500 pr-3">Email:</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            
                            className={`border rounded-md w-full p-2 mt-1 ${errors.email ? 'border-red-500' : ''}`}
                        />
                        {errors.email && <p className="text-red-500">{errors.email}</p>}
                    </div>
                    <div className='flex'>
                        <label htmlFor="mobileNo" className="font-bold text-orange-500 pr-3">Mobile No:</label>
                        <input
                            type="text"
                            name="mobileNo"
                            id="mobileNo"
                            value={formData.mobileNo}
                            onChange={handleChange}
                            
                            className={`border rounded-md w-full p-2 mt-1 ${errors.mobileNo ? 'border-red-500' : ''}`}
                        />
                        {errors.mobileNo && <p className="text-red-500">{errors.mobileNo}</p>}
                    </div>
                    <div className='flex'>
                        <label htmlFor="aadharCardNo" className="font-bold text-orange-500 pr-3">Aadhar Card No:</label>
                        <input
                            type="text"
                            name="aadharCardNo"
                            id="aadharCardNo"
                            value={formData.aadharCardNo}
                            onChange={handleChange}
                            
                            className={`border rounded-md w-full p-2 mt-1 ${errors.aadharCardNo ? 'border-red-500' : ''}`}
                        />
                        {errors.aadharCardNo && <p className="text-red-500">{errors.aadharCardNo}</p>}
                    </div>
                    <div className='flex'>
                        <label htmlFor="password" className="font-bold text-orange-500 pr-3">Password:</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            
                            className={`border rounded-md w-full p-2 mt-1 ${errors.password ? 'border-red-500' : ''}`}
                        />
                        {errors.password && <p className="text-red-500">{errors.password}</p>}
                    </div>
                </div>
                <div className='flex justify-end'>
                    <button type="submit" className="bg-blue-500 p-3 text-white font-bold py-2 rounded hover:bg-blue-600 transition">
                        Add User
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Page;
