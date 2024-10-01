"use client";
import CallFor from '@/utilities/CallFor';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobileNo: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile No must be exactly 10 digits") 
        .required('Mobile No is required'),
    aadharCardNo: Yup.string()
        .matches(/^[0-9]{12}$/, "Aadhar Card No must be exactly 12 digits") 
        .required('Aadhar Card No is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Page = ({ params }) => {
    const router = useRouter();
	console.log(params);
   // Get the waiter ID from the URL params
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

    // Fetch waiter details if in edit mode
    useEffect(() => {
        const fetchWaiter = async () => {
                try {
                    const response = await CallFor(`waiters/${params.id}`, "get", null, "Auth");
                    if (response.data) {
						console.log(response.data);
                        setFormData({
                            ...response.data,
                            owner: owner.data._id // Assuming this should come from the user session
                        });
                    } else {
                        toast.error('Could not fetch waiter details');
                    }
                } catch (error) {
                    console.error('Error fetching waiter details:', error);
                    toast.error('Error fetching waiter details');
            }
        };
        fetchWaiter();
    }, [params]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            const endpoint = `waiters/${params.id}` 
            const response = await CallFor(endpoint, "put", formData, "Auth");
            
            if (!response.data) {
                toast.error('Error adding/updating user');
            } else {
                toast.success('User added/updated successfully');
                router.push("/admin/staff");
            }

        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = {};
                error.inner.forEach(err => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            } else {
                console.error('Error:', error);
                alert('There was a problem with the submission.');
            }
        }
    };

    return (
        <div className="mx-4 mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-left text-orange-500 pb-5">Edit Staff </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    {/* Form Fields */}
                    {['name', 'email', 'mobileNo', 'aadharCardNo', 'password'].map((field) => (
                        <div className='flex' key={field}>
                            <label htmlFor={field} className="font-bold text-orange-500 pr-3">{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                            <input
                                type={field === 'password' ? 'password' : 'text'}
                                name={field}
                                id={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className={`border rounded-md w-full p-2 mt-1 ${errors[field] ? 'border-red-500' : ''}`}
                            />
                            {errors[field] && <p className="text-red-500">{errors[field]}</p>}
                        </div>
                    ))}
                </div>
                <div className='flex justify-end'>
                    <button type="submit" className="bg-blue-500 p-3 text-white font-bold py-2 rounded hover:bg-blue-600 transition">
                        Update User
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Page;
