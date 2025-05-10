import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const BookingSuccess = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center">
                    <div className="flex justify-center">
                        <FaCheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Booking Successful!
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Your cleaning service has been booked successfully. We've sent a confirmation email with all the details.
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="bg-blue-50 p-4 rounded-md">
                        <h3 className="text-lg font-medium text-blue-800">What's Next?</h3>
                        <ul className="mt-2 text-sm text-blue-700 space-y-2">
                            <li>• You'll receive a confirmation email shortly</li>
                            <li>• Our cleaning team will contact you before the service</li>
                            <li>• You can view your booking details in your dashboard</li>
                        </ul>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <Link
                            to="/dashboard"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            View in Dashboard
                        </Link>
                        <Link
                            to="/"
                            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess; 