import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationCircle } from 'react-icons/fa';

const BookingFailure = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center">
                    <div className="flex justify-center">
                        <FaExclamationCircle className="h-16 w-16 text-red-500" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Booking Failed
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        We couldn't process your booking at this time. Please try again or contact our support team for assistance.
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="bg-red-50 p-4 rounded-md">
                        <h3 className="text-lg font-medium text-red-800">What Happened?</h3>
                        <ul className="mt-2 text-sm text-red-700 space-y-2">
                            <li>• There might have been an issue with the payment processing</li>
                            <li>• The selected time slot might no longer be available</li>
                            <li>• There could be a temporary system issue</li>
                        </ul>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <Link
                            to="/book-cleaning"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Try Again
                        </Link>
                        <Link
                            to="/contact"
                            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingFailure; 