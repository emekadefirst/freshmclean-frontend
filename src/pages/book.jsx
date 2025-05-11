// import Navigation from "../components/nav";
import React, { useState, useEffect } from "react";
import DateTimeSelector from "../components/form/datecomponent";
import DayTimeSelector from "../components/form/daytimecomponent";
import AdditionalServices from "../components/form/additonalservices";
import Footer from "../components/footer";
import Modal from "../components/modal";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { FaSpinner } from "react-icons/fa";
import { format } from "date-fns";
import { API } from "../services/api";

const BookingPage = () => {
  const apiUrl = API;
  const customerId = localStorage.getItem("userId");
  const [searchParams] = useSearchParams();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState();
  const [frequencies, setFrequencies] = useState([]);
  const [userData, setUserData] = useState(null);

  const [spaces, setSpaces] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [cleaningType, setCleaningType] = useState("kitchen");
  const [frequency, setFrequency] = useState("one_time");
  const [selectedDays, setSelectedDays] = useState([]);

  const [selectedDateTime, setSelectedDateTime] = useState([]);
  const [additionalServicesPrice, setAdditionalServicesPrice] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);

  const [formData, setFormData] = useState({
    city: "",
    street: "",
    streetNumber: "",
    building: "",
    apartmentNumber: "",
    postalCode: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    additionalInfo: "",
  });

  // Base price and calculations
  const [basePrice, setBasePrice] = useState(54.0);
  const [spacePrice, setSpacePrice] = useState(13.6);
  const [bathroomPrice, setBathroomPrice] = useState(4.0);
  const [kitchenLivingRoomDiscount, setKitchenLivingRoomDiscount] =
    useState(6.0);
  const [paymentPrice, setPaymentPrice] = useState(basePrice);
  const [selectedCount, setSelectedCount] = useState(1);

  // Fetch frequencies on component mount
  useEffect(() => {
    const fetchFrequencies = async () => {
      try {
        const response = await fetch(`${apiUrl}/schedule/`);
        const data = await response.json();
        setFrequencies(data);

        // Get frequency from URL query parameters
        const frequencyParam = searchParams.get("frequency");
        if (frequencyParam) {
          const matchingFrequency = data.find((f) => f.type === frequencyParam);
          if (matchingFrequency) {
            setFrequency(frequencyParam);
          }
        }
      } catch (error) {
        console.error("Error fetching frequencies:", error);
      }
    };

    fetchFrequencies();
  }, [searchParams]);

  // Fetch user data if logged in
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const response = await fetch(`${apiUrl}/auth/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          console.log("User data from API:", data);
          setUserData(data);

          // Set form data with user details
          setFormData((prev) => ({
            ...prev,
            fullName: `${data.first_name} ${data.last_name}`,
            email: data.email,
            phoneNumber: data.phone || "",
          }));
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  // Calculate price based on selections
  const calculatePrice = () => {
    let price = basePrice;
    price += (spaces - 1) * spacePrice;
    price += (bathrooms - 1) * bathroomPrice;
    if (cleaningType === "kitchen-living") {
      price -= kitchenLivingRoomDiscount;
    }
    price += additionalServicesPrice;
    return price;
  };

  // Refactor useEffect hooks for price and discount calculations
  useEffect(() => {
    // Calculate base price and selected count
    const baseAmount = calculatePrice();
    let count = 1;

    if (frequency === "one_time" || frequency === "monthly") {
      count = Math.max(selectedDateTime.length, 1);
    } else if (frequency === "weekly" || frequency === "bi_weekly") {
      count = Math.max(selectedDays.length, 1);
    }

    setSelectedCount(count);

    // Calculate total base amount and discount
    const totalBaseAmount = baseAmount * count;
    const discount = calculateDiscount();

    // Update payment price
    setPaymentPrice(totalBaseAmount - discount);
  }, [
    spaces,
    bathrooms,
    cleaningType,
    additionalServicesPrice,
    frequency,
    selectedDateTime,
    selectedDays,
  ]);

  // Calculate discount based on frequency
  const calculateDiscount = () => {
    const baseAmount = calculatePrice() * selectedCount;
    const selectedFrequency = frequencies.find((f) => f.type === frequency);

    if (selectedFrequency && selectedFrequency.discount) {
      return baseAmount * (selectedFrequency.discount / 100);
    }
    return 0;
  };

  // Format price to 2 decimal places
  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  // Handle additional services changes
  const handleServiceChange = (totalPrice, services) => {
    setAdditionalServicesPrice(totalPrice);
    setSelectedServices(services);
  };

  const estimateDuration = () => {
    let duration = 3;

    // Add time for additional spaces
    duration += (spaces - 1) * 0.5;

    // Add time for additional bathrooms
    duration += (bathrooms - 1) * 0.5;

    // Add time for additional services
    selectedServices.forEach((service) => {
      switch (service.id) {
        case "oven":
        case "refrigerator":
          duration += 0.5 * service.count;
          break;
        case "extractor":
        case "kitchen-cabinets":
          duration += 0.75 * service.count;
          break;
        case "window":
          duration += 0.25 * service.count;
          break;
        default:
          duration += 0.3 * service.count;
      }
    });

    return duration;
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Fetch user addresses if logged in
  useEffect(() => {
    const fetchUserAddresses = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(
            `${apiUrl}/getAllAddressInformation/${customerId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const result = await response.json();
          console.log("Address fetch result:", result);

          // Check if AddressInformation exists and is an array
          if (
            result &&
            result.AddressInformation &&
            Array.isArray(result.AddressInformation)
          ) {
            setUserAddresses(result.AddressInformation);
          } else {
            console.log("No addresses found or invalid format:", result);
            setUserAddresses([]);
          }
        } catch (error) {
          console.error("Error fetching user addresses:", error);
          setUserAddresses([]);
        }
      }
    };

    fetchUserAddresses();
  }, [apiUrl, customerId]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setFormData((prev) => ({
      ...prev,
      city: address.city,
      street: address.streetName,
      streetNumber: address.houseNumber,
      building: address.building || "",
      apartmentNumber: address.entranceNumber,
      postalCode: address.postCode,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if user is logged in
    const token = localStorage.getItem("access_token");
    if (!token) {
      // Save form data to sessionStorage before showing login modal
      const bookingData = {
        formData,
        spaces,
        bathrooms,
        cleaningType,
        frequency,
        selectedDateTime,
        selectedDays,
        additionalServicesPrice,
        selectedServices,
      };
      sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
      setShowLoginModal(true);
      setLoading(false);
      return;
    }

    try {
      // Get the schedule ID based on selected frequency
      const selectedFrequency = frequencies.find((f) => f.type === frequency);
      if (!selectedFrequency) {
        throw new Error("Please select a cleaning frequency");
      }

      // Format dates or days based on frequency type
      let scheduleDays = [];
      let scheduleDates = [];

      if (frequency === "weekly" || frequency === "bi_weekly") {
        // Convert selected days to uppercase three-letter format
        scheduleDays = selectedDays.map((day) =>
          day.toUpperCase().substring(0, 3)
        );
      } else if (frequency === "one_time" || frequency === "monthly") {
        // Format dates to YYYY-MM-DD
        scheduleDates = selectedDateTime.map(
          (date) => date.toISOString().split("T")[0]
        );
      }

      // Format kitchen type
      const kitchenTypeFormatted =
        cleaningType === "kitchen"
          ? "In Kitchen"
          : "In Kitchen and Living Room";

      // Get user location
      let latitude = "";
      let longitude = "";
      if (navigator.geolocation) {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              latitude = position.coords.latitude;
              longitude = position.coords.longitude;
              resolve();
            },
            () => {
              resolve(); // Ignore location errors
            }
          );
        });
      }

      // Format the payload according to API requirements
      const formattedData = {
        service_type: "personal",
        schedule_id: selectedFrequency.id,
        number_of_room: spaces,
        number_of_bathroom: bathrooms,
        kitchen_type: kitchenTypeFormatted,
        schedule_days: scheduleDays,
        schedule_dates: scheduleDates,
        extra_spaces: selectedServices.map((service) => ({
          extra_id: service.id,
          quantity: service.count,
        })),
        discount_code: "",
        latitude: latitude.toString(),
        logitude: longitude.toString(),
        address: `${formData.street} ${formData.streetNumber}${formData.building ? `, ${formData.building}` : ''}${formData.apartmentNumber ? `, Apt ${formData.apartmentNumber}` : ''}, ${formData.postalCode} ${formData.city}`
      };

      console.log("Sending booking data:", formattedData);

      const response = await fetch(`${apiUrl}/bookings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();
      console.log("Booking response:", data);

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create booking");
      }

      // Show success message
      toast.success("Booking created successfully! Redirecting to payment...");

      // Redirect to Stripe payment URL immediately
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No payment link received");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.detail || "An error occurred while processing your request"
      );
      // Optionally redirect to failure page
      // window.location.href = "/booking/failure";
    } finally {
      setLoading(false);
    }
  };

  // Function to open authentication pages in new tabs
  const openAuthPage = (page) => {
    // Save form data to sessionStorage
    const bookingData = {
      formData,
      spaces,
      bathrooms,
      cleaningType,
      frequency,
      selectedDateTime: selectedDateTime.map((date) => date.toISOString()), // Convert dates to strings
      additionalServicesPrice,
      selectedServices,
    };
    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    // Navigate in the same tab instead of opening a new one
    window.location.href = `/${page}`;
  };

  // Store form data in session storage
  const storeFormData = () => {
    const formData = {
      spaces,
      bathrooms,
      cleaningType,
      frequency,
      selectedDateTime,
      selectedDays,
      additionalServicesPrice,
      basePrice,
      spacePrice,
      bathroomPrice,
      kitchenLivingRoomDiscount,
    };
    sessionStorage.setItem("bookingFormData", JSON.stringify(formData));
  };

  // Restore form data from session storage
  const restoreFormData = () => {
    const storedData = sessionStorage.getItem("bookingFormData");
    if (storedData) {
      const formData = JSON.parse(storedData);
      setSpaces(formData.spaces);
      setBathrooms(formData.bathrooms);
      setCleaningType(formData.cleaningType);
      setFrequency(formData.frequency);
      setSelectedDateTime(formData.selectedDateTime);
      setSelectedDays(formData.selectedDays || []);
      setAdditionalServicesPrice(formData.additionalServicesPrice);
      setBasePrice(formData.basePrice);
      setSpacePrice(formData.spacePrice);
      setBathroomPrice(formData.bathroomPrice);
      setKitchenLivingRoomDiscount(formData.kitchenLivingRoomDiscount);
    }
  };

  // Call restoreFormData when component mounts
  useEffect(() => {
    restoreFormData();
  }, []);

  // Store form data whenever it changes
  useEffect(() => {
    storeFormData();
  }, [
    spaces,
    bathrooms,
    cleaningType,
    frequency,
    selectedDateTime,
    selectedDays,
    additionalServicesPrice,
    basePrice,
    spacePrice,
    bathroomPrice,
    kitchenLivingRoomDiscount,
  ]);

  // Close the login modal
  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  // Handle date/time selection
  const handleDateTimeSelected = (dateTime) => {
    setSelectedDateTime(dateTime);
  };

  // Handle day and time selection for weekly/bi-weekly
  const handleDayTimeSelected = (days, time) => {
    setSelectedDays(days);
    // Create date objects for the selected days with the chosen time
    const dateTimeObjects = days.map((day) => {
      const date = new Date();
      // Set to next occurrence of the selected day
      const dayIndex = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
      ].indexOf(day);
      const currentDay = date.getDay();
      const daysUntilNext = (dayIndex - currentDay + 7) % 7;
      date.setDate(date.getDate() + daysUntilNext);
      if (time) {
        const [hours, minutes] = time.split(":");
        date.setHours(parseInt(hours), parseInt(minutes));
      }
      return date;
    });
    setSelectedDateTime(dateTimeObjects);
  };

  return (
    <div>
      {/* <Navigation /> */}

      <div className="max-w-7xl mx-auto px-4 pt-6">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 grid-cols-1 md:grid-cols-[1fr_24rem] 2xl:grid-cols-[1fr_28rem]"
        >
          {/* Left column - Form */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="py-6 px-0 md:px-6">
              <h1 className="text-2xl font-bold mb-6">
                Apartment cleaning Berlin
              </h1>

              {/* Client type selection */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <button
                  type="button"
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md font-medium"
                >
                  For private individuals
                </button>
                {/* <button className="flex-1 bg-white border border-gray-300 py-3 px-4 rounded-md font-medium">
                                    For companies
                                </button> */}
              </div>

              {/* Apartment configuration */}
              <div className="mb-8">
                <h2 className="text-lg text-gray-500 font-medium mb-6">
                  YOUR APARTMENT
                </h2>

                {/* Spaces counter */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="border border-gray-200 rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center text-lg bg-gray-100 rounded-md"
                        onClick={() => setSpaces(Math.max(1, spaces - 1))}
                      >
                        -
                      </button>
                      <span className="text-lg font-medium">
                        {spaces} Space{spaces !== 1 ? "s" : ""}
                      </span>
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center text-lg bg-gray-100 rounded-md"
                        onClick={() => setSpaces(spaces + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Bathrooms counter */}
                  <div className="border border-gray-200 rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center text-lg bg-gray-100 rounded-md"
                        onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                      >
                        -
                      </button>
                      <span className="text-lg font-medium">
                        {bathrooms} bathroom{bathrooms !== 1 ? "s" : ""}
                      </span>
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center text-lg bg-gray-100 rounded-md"
                        onClick={() => setBathrooms(bathrooms + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-gray-500 text-sm mb-6">
                  * Complete cleaning of the entire apartment, kitchen, toilet
                  and bathroom
                </p>

                {/* Kitchen options */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 border rounded flex items-center justify-center cursor-pointer ${
                        cleaningType === "kitchen"
                          ? "bg-white border-blue-600"
                          : "bg-gray-100 border-gray-200"
                      }`}
                      onClick={() => setCleaningType("kitchen")}
                    >
                      {cleaningType === "kitchen" && (
                        <span className="text-blue-600">✓</span>
                      )}
                    </div>
                    <span className="font-medium">Kitchen</span>
                  </div>

                  <span className="text-gray-400">Or</span>

                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 border rounded flex items-center justify-center cursor-pointer ${
                        cleaningType === "kitchen-living"
                          ? "bg-white border-blue-600"
                          : "bg-gray-100 border-gray-200"
                      }`}
                      onClick={() => setCleaningType("kitchen-living")}
                    >
                      {cleaningType === "kitchen-living" && (
                        <span className="text-blue-600">✓</span>
                      )}
                    </div>
                    <span className="font-medium">kitchen-living room</span>
                  </div>

                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
                    -6.00 EUR
                  </span>
                </div>

                {/* Cleaning frequency */}
                <div className="mt-8">
                  <h3 className="font-medium mb-3">Cleaning frequency</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {frequencies.map((freq) => (
                      <div
                        key={freq.id}
                        onClick={() => setFrequency(freq.type)}
                        className={`border rounded-md p-3 cursor-pointer ${
                          frequency === freq.type
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="font-medium capitalize">
                          {freq.type.replace("_", " ")}
                        </div>
                        <div className="text-sm text-gray-600">
                          Discount: {freq.discount}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conditional rendering for date/time selection */}
                {frequency === "one_time" || frequency === "monthly" ? (
                  <DateTimeSelector
                    onDateTimeSelected={handleDateTimeSelected}
                    initialDateTime={selectedDateTime}
                    frequency={frequency}
                  />
                ) : (
                  <DayTimeSelector
                    onDayTimeSelected={handleDayTimeSelected}
                    initialDays={selectedDays}
                    initialTime={
                      selectedDateTime.length > 0
                        ? format(selectedDateTime[0], "HH:mm")
                        : ""
                    }
                  />
                )}

                {/* Additional Roles */}
                <h2 className="text-lg text-gray-500 font-medium mb-4 mt-6">
                  ADDITIONAL ROLES
                </h2>
                <AdditionalServices
                  onServiceChange={handleServiceChange}
                  initialServices={selectedServices}
                />

                {/* Address and Contact*/}
                <div className="mt-8">
                  {/* Address Section */}
                  <h2 className="text-lg text-gray-500 font-medium mb-6">
                    ENTER YOUR ADDRESS
                  </h2>

                  {/* Address Selection for logged-in users */}
                  {userAddresses.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select a saved address
                      </label>
                      <select
                        value={selectedAddress?._id || ""}
                        onChange={(e) => {
                          const address = userAddresses.find(
                            (a) => a._id === e.target.value
                          );
                          if (address) handleAddressSelect(address);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select an address</option>
                        {userAddresses.map((address) => (
                          <option key={address._id} value={address._id}>
                            {`${address.streetName} ${address.houseNumber}, ${address.city}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="input-group mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter city"
                      />
                    </div>

                    <div className="input-group mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter street name"
                      />
                    </div>

                    <div className="input-group mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Number
                      </label>
                      <input
                        type="text"
                        name="streetNumber"
                        value={formData.streetNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 123"
                      />
                    </div>

                    <div className="input-group mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Building
                      </label>
                      <input
                        type="text"
                        name="building"
                        value={formData.building}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Building name/number (optional)"
                      />
                    </div>

                    <div className="input-group mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apartment Number
                      </label>
                      <input
                        type="text"
                        name="apartmentNumber"
                        value={formData.apartmentNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 4B"
                      />
                    </div>

                    <div className="input-group mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter postal code"
                      />
                    </div>
                  </div>

                  {/* Divider between Address and Contact */}
                  <hr className="my-8 border-t border-gray-300" />

                  {/* Contact Section */}
                  {/* <h2 className="text-lg text-gray-500 font-medium mb-6">
                      CONTACT INFORMATION
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="input-group mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="input-group mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div className="input-group mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+1 (123) 456-7890"
                        />
                      </div>

                      <div className="input-group mb-4 col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Additional Information
                        </label>
                        <textarea
                          name="additionalInfo"
                          value={formData.additionalInfo}
                          onChange={handleInputChange}
                          className="resize-none w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                          placeholder="Special instructions or information about your order..."
                          rows="4"
                        ></textarea>
                      </div>
                    </div> */}
                </div>

                <div className="mt-8 hidden md:block">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-5 rounded-lg text-lg font-semibold"
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <span>
                        Order now for {formatPrice(paymentPrice)} EUR{" "}
                        {calculateDiscount() > 0 && (
                          <span className="text-gray-300 line-through ml-2">
                            {formatPrice(calculatePrice() * selectedCount)} EUR
                          </span>
                        )}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Summary card */}
          <div className="relative">
            <div className="sticky top-4">
              <div className="bg-white rounded-lg border border-gray-100 p-6">
                <h2 className="font-semibold text-xl mb-3">
                  Cleaning of the apartment with {spaces} living room and{" "}
                  {bathrooms} bathroom{bathrooms !== 1 ? "s" : ""},
                  {cleaningType === "kitchen"
                    ? " kitchen"
                    : " kitchen-living room"}
                </h2>

                <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-md mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-yellow-600">
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      stroke="currentColor"
                      fill="none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">
                    Our partners bring all necessary cleaning supplies, tools
                    and vacuum cleaners
                  </p>
                </div>

                <p className="mb-4">
                  Duration approx.{" "}
                  <span className="font-medium">
                    {Math.floor(estimateDuration())} hours{" "}
                    {Math.round((estimateDuration() % 1) * 60)} minutes
                  </span>
                </p>

                <div className="flex gap-2 mb-6">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Enter promotion code"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Apply
                  </button>
                </div>

                {/* <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Referral program</span>
                                    <span className="text-sm text-blue-600">How does it work?</span>
                                </div> */}

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-end justify-between mb-1">
                    <span className="text-lg">To pay:</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold">
                        {formatPrice(paymentPrice)} EUR
                      </span>
                      {calculateDiscount() > 0 && (
                        <span className="text-gray-400 line-through ml-2">
                          {formatPrice(calculatePrice() * selectedCount)} EUR
                        </span>
                      )}
                    </div>
                  </div>

                  {calculateDiscount() > 0 && (
                    <p className="text-sm text-gray-600">
                      *Your{" "}
                      {frequencies.find((f) => f.type === frequency)?.discount}%
                      discount applied
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-medium mt-4"
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      "Order now"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <Modal onClose={closeLoginModal}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="mb-6">
              You need to be logged in to complete your booking. Please login or
              create an account to continue.
            </p>

            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={() => openAuthPage("login")}
                className="flex-1 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => openAuthPage("signup")}
                className="flex-1 py-2 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors"
              >
                Create Account
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={closeLoginModal}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BookingPage;