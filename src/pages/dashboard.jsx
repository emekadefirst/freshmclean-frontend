import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/overlaymodal";

const Dashboard = () => {
  const navigate = useNavigate();
  // Tab state
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Home", "Addresses", "Booking History"];

  // Modal states
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Example data
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      city: "Berlin",
      street: "Main Street",
      streetNumber: "123",
      building: "Building A",
      apartmentNumber: "4B",
      postalCode: "10115",
      isDefault: true,
    },
    {
      id: 2,
      city: "Munich",
      street: "Park Avenue",
      streetNumber: "45",
      building: "Tower B",
      apartmentNumber: "12C",
      postalCode: "80331",
      isDefault: false,
    },
  ]);

  const bookings = [
    {
      id: "CLN-12345",
      date: "2025-05-01",
      time: "10:00 AM",
      address: "Main Street 123, Berlin",
      status: "Completed",
      service: "Standard Cleaning",
      price: "€80",
    },
    {
      id: "CLN-12346",
      date: "2025-05-10",
      time: "2:00 PM",
      address: "Park Avenue 45, Munich",
      status: "Scheduled",
      service: "Deep Cleaning",
      price: "€120",
    },
    {
      id: "CLN-12347",
      date: "2025-04-20",
      time: "9:00 AM",
      address: "Main Street 123, Berlin",
      status: "Canceled",
      service: "Window Cleaning",
      price: "€60",
    },
  ];

  // Form state for address
  const initialAddressForm = {
    city: "",
    street: "",
    streetNumber: "",
    building: "",
    apartmentNumber: "",
    postalCode: "",
    isDefault: false,
  };
  const [addressForm, setAddressForm] = useState(initialAddressForm);

  // Booking filter state
  const [bookingSearch, setBookingSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Handle address form changes
  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Add new address
  const handleAddAddress = (e) => {
    e.preventDefault();
    const newAddress = {
      ...addressForm,
      id: Date.now(), // Simple ID generation
    };

    // If this is set as default, update other addresses
    if (newAddress.isDefault) {
      setAddresses(
        addresses.map((addr) => ({
          ...addr,
          isDefault: false,
        }))
      );
    }

    setAddresses([...addresses, newAddress]);
    setAddressForm(initialAddressForm);
    setShowAddAddressModal(false);
  };

  // Edit address
  const handleEditAddress = (e) => {
    e.preventDefault();

    // If setting this address as default, update other addresses
    if (addressForm.isDefault && !selectedAddress.isDefault) {
      setAddresses(
        addresses.map((addr) => ({
          ...addr,
          isDefault: false,
        }))
      );
    }

    setAddresses(
      addresses.map((addr) =>
        addr.id === selectedAddress.id ? addressForm : addr
      )
    );
    setShowEditAddressModal(false);
  };

  // Delete address
  const handleDeleteAddress = () => {
    setAddresses(addresses.filter((addr) => addr.id !== selectedAddress.id));
    setShowDeleteConfirmationModal(false);
  };

  // Start edit process
  const startEditAddress = (address) => {
    setSelectedAddress(address);
    setAddressForm(address);
    setShowEditAddressModal(true);
  };

  // Start delete process
  const startDeleteAddress = (address) => {
    setSelectedAddress(address);
    setShowDeleteConfirmationModal(true);
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    // Search filter
    const searchMatch =
      booking.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      booking.address.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      booking.service.toLowerCase().includes(bookingSearch.toLowerCase());

    // Date from filter
    const fromDateMatch =
      !dateFrom || new Date(booking.date) >= new Date(dateFrom);

    // Date to filter
    const toDateMatch = !dateTo || new Date(booking.date) <= new Date(dateTo);

    // Status filter
    const statusMatch =
      statusFilter === "all" ||
      booking.status.toLowerCase() === statusFilter.toLowerCase();

    return searchMatch && fromDateMatch && toDateMatch && statusMatch;
  });

  // Get status class
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Customer Dashboard
          </h1>
        </div>

        {/* Custom Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`whitespace-nowrap border-b-2 px-4 py-4 text-sm font-medium ${
                  activeTab === index
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 shadow sm:rounded-lg">
          {/* Home Tab */}
          {activeTab === 0 && (
            <div className="space-y-6">
              <div className="rounded-lg bg-blue-50 p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                  Welcome to your Dashboard!
                </h2>
                <p className="mb-6 text-gray-600">
                  Manage your cleaning bookings, saved addresses, and view your
                  booking history all in one place.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-white p-4 shadow">
                    <div className="mb-2 text-sm font-medium text-gray-500">
                      Total Bookings
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {bookings.length}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-4 shadow">
                    <div className="mb-2 text-sm font-medium text-gray-500">
                      Saved Addresses
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {addresses.length}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-4 shadow">
                    <div className="mb-2 text-sm font-medium text-gray-500">
                      Next Booking
                    </div>
                    <div className="text-lg font-medium text-gray-900">
                      {bookings.some((b) => b.status === "Scheduled")
                        ? bookings.find((b) => b.status === "Scheduled").date
                        : "No upcoming bookings"}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="mb-3 text-lg font-medium text-gray-900">
                    Quick Actions
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate("/book-cleaning")}
                      className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Book Cleaning
                    </button>
                    <button
                      onClick={() => setActiveTab(1)}
                      className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Manage Addresses
                    </button>
                    <button
                      onClick={() => setActiveTab(2)}
                      className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      View History
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  Recent Bookings
                </h3>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Booking
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Date & Time
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {bookings.slice(0, 3).map((booking) => (
                        <tr key={booking.id}>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.service}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {booking.date}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.time}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusClass(
                                booking.status
                              )}`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                            <button className="mr-2 text-blue-600 hover:text-blue-900">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {bookings.length > 3 && (
                    <div className="flex justify-center border-t border-gray-200 px-4 py-3 sm:px-6">
                      <button
                        onClick={() => setActiveTab(2)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        View all bookings
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 1 && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Saved Addresses
                </h2>
                <button
                  onClick={() => {
                    setAddressForm(initialAddressForm);
                    setShowAddAddressModal(true);
                  }}
                  className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No addresses
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding a new address.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        setAddressForm(initialAddressForm);
                        setShowAddAddressModal(true);
                      }}
                      className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Add Address
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Address
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          City
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Postal Code
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Default
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {addresses.map((address) => (
                        <tr key={address.id}>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {address.street} {address.streetNumber}
                            </div>
                            {(address.building || address.apartmentNumber) && (
                              <div className="text-sm text-gray-500">
                                {address.building}
                                {address.building &&
                                  address.apartmentNumber &&
                                  ", "}
                                {address.apartmentNumber}
                              </div>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {address.city}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {address.postalCode}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {address.isDefault && (
                              <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                                Default
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <button
                              onClick={() => startEditAddress(address)}
                              className="mr-3 text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => startDeleteAddress(address)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Booking History Tab */}
          {activeTab === 2 && (
            <div>
              <h2 className="mb-6 text-lg font-medium text-gray-900">
                Booking History
              </h2>

              {/* Filters */}
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div>
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Search
                  </label>
                  <input
                    type="text"
                    id="search"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Search bookings"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="date-from"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date From
                  </label>
                  <input
                    type="date"
                    id="date-from"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="date-to"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date To
                  </label>
                  <input
                    type="date"
                    id="date-to"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
              </div>

              {/* Bookings Table */}
              {filteredBookings.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <p className="text-sm text-gray-500">
                    No bookings found matching your filters.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Booking
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Date & Time
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Service
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Address
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                            {booking.id}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {booking.date}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.time}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {booking.service}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {booking.address}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusClass(
                                booking.status
                              )}`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {booking.price}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <button className="mr-3 text-blue-600 hover:text-blue-900">
                              View
                            </button>
                            {booking.status === "Scheduled" && (
                              <button className="text-red-600 hover:text-red-900">
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      {/* <Modal
        isOpen={showAddAddressModal}
        onClose={() => setShowAddAddressModal(false)}
        title="Add New Address"
      >
        <form onSubmit={handleAddAddress}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={addressForm.city}
                onChange={handleAddressFormChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700"
              >
                Street
              </label>
              <input
                type="text"
                name="street"
                id="street"
                value={addressForm.street}
                onChange={handleAddressFormChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="streetNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Street Number
              </label>
              <input
                type="text"
                name="streetNumber"
                id="streetNumber"
                value={addressForm.streetNumber}
                onChange={handleAddressFormChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-gray-700"
              >
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                id="postalCode"
                value={addressForm.postalCode}
                onChange={handleAddressFormChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="building"
                className="block text-sm font-medium text-gray-700"
              >
                Building (Optional)
              </label>
              <input
                type="text"
                name="building"
                id="building"
                value={addressForm.building}
                onChange={handleAddressFormChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="apartmentNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Apartment Number (Optional)
              </label>
              <input
                type="text"
                name="apartmentNumber"
                id="apartmentNumber"
                value={addressForm.apartmentNumber}
                onChange={handleAddressFormChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                checked={addressForm.isDefault}
                onChange={handleAddressFormChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="isDefault"
                className="ml-2 block text-sm text-gray-900"
              >
                Set as default address
              </label>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowAddAddressModal(false)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Address
            </button>
          </div>
        </form>
      </Modal> */}

      {/* Edit Address Modal */}
      {/* <Modal
        isOpen={showEditAddressModal}
        onClose={() => setShowEditAddressModal(false)}
        title="Edit Address"
      >
        <form onSubmit={handleEditAddress}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                name="city"
                id="edit-city"
                value={addressForm.city}
                onChange={handleAddressFormChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="edit-street"
                className="block text-sm font-medium text-gray-700"
              >
                Street
              </label>
              <input
                type="text"
                name="street"
                id="edit-street"
                value={addressForm.street}
                onChange={handleAddressFormChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="edit-streetNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Street Number
              </label>
              <input
                type="text"
                name="streetNumber"
                id="edit-streetNumber"
                value={addressForm.streetNumber}
                onChange={handleAddressFormChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="edit-postalCode"
                className="block text-sm font-medium text-gray-700"
              >
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                id="edit-postalCode"
                value={addressForm.postalCode}
                onChange={handleAddressFormChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="edit-building"
                className="block text-sm font-medium text-gray-700"
              >
                Building (Optional)
              </label>
              <input
                type="text"
                name="building"
                id="edit-building"
                value={addressForm.building}
                onChange={handleAddressFormChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="edit-apartmentNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Apartment Number (Optional)
              </label>
              <input
                type="text"
                name="apartmentNumber"
                id="edit-apartmentNumber"
                value={addressForm.apartmentNumber}
                onChange={handleAddressFormChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                id="edit-isDefault"
                checked={addressForm.isDefault}
                onChange={handleAddressFormChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="edit-isDefault"
                className="ml-2 block text-sm text-gray-900"
              >
                Set as default address
              </label>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowEditAddressModal(false)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal> */}

      {/* Delete Confirmation Modal */}
      {/* <Modal
        isOpen={showDeleteConfirmationModal}
        onClose={() => setShowDeleteConfirmationModal(false)}
        title="Delete Address"
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this address? This action cannot be
            undone.
          </p>
        </div>
        <div className="mt-5 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setShowDeleteConfirmationModal(false)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteAddress}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </Modal> */}
    </div>
  );
};

export default Dashboard;