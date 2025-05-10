import React from "react";
import { useNavigate } from "react-router-dom";

// Individual Pricing Card Component
const PricingCard = ({ type, image, price, desc1 }) => {
  const navigate = useNavigate();

  // Function to generate slug
  const generateSlug = (str) => str.toLowerCase().replace(/\s+/g, "-");

  const handleLearnMore = () => {
    const slug = generateSlug(type);
    navigate(`/pricing/${slug}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center transition-all hover:shadow-md">
      <div className="flex flex-col items-center">
        <img src={image} alt={type} className="w-[80px] h-[80px] object-contain" />
        <p className="font-medium mt-4 mb-2 text-lg">{type}</p>
        <p className="inline-block text-3xl flex items-center font-bold">
          <span className="text-[24px] font-normal mr-1">€</span>
          <span>{price}</span>
          <span className="text-base font-normal text-gray-500 ml-1">/Hour</span>
        </p>
      </div>
      
      <div className="text-base font-normal my-6 w-full">
        {desc1.map((item, index) => (
          <div key={index} className="flex justify-between items-center my-2 border-b border-gray-100 pb-2">
            <span>{item.name}</span>
            <span className="font-medium">${item.price}</span>
          </div>
        ))}
      </div>
      
      <button
        onClick={handleLearnMore}
        className="py-2.5 px-6 bg-primary-sky mt-auto w-full text-sm font-medium text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Learn more
      </button>
    </div>
  );
};

// Main Pricing Component
const Pricing = () => {
  // Sample pricing data
  const pricingOptions = [
    {
      type: "Standard Cleaning",
      image: "/path/to/standard-cleaning.png", // Replace with your actual image path
      price: 25,
      desc1: [
        { name: "Bathroom Cleaning", price: 15 },
        { name: "Kitchen Cleaning", price: 20 },
        { name: "Vacuuming", price: 10 },
        { name: "Dusting", price: 8 }
      ]
    },
    {
      type: "Deep Cleaning",
      image: "/path/to/deep-cleaning.png", // Replace with your actual image path
      price: 35,
      desc1: [
        { name: "Standard Cleaning", price: 25 },
        { name: "Cabinet Interior", price: 15 },
        { name: "Baseboards", price: 10 },
        { name: "Window Cleaning", price: 20 }
      ]
    },
    {
      type: "Move-In/Out Cleaning",
      image: "/path/to/move-in-cleaning.png", // Replace with your actual image path
      price: 45,
      desc1: [
        { name: "Deep Cleaning", price: 35 },
        { name: "Appliance Cleaning", price: 25 },
        { name: "Wall Cleaning", price: 15 },
        { name: "Carpet Cleaning", price: 30 }
      ]
    }
  ];

  return (
    <div className="py-16 font-helvetica-neue">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Pricing Plans</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the perfect cleaning package for your needs. All our services include professional staff, eco-friendly cleaning products, and a satisfaction guarantee.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {pricingOptions.map((option, index) => (
            <PricingCard key={index} {...option} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Need a custom cleaning plan?</p>
          <button className="py-3 px-8 bg-gray-100 text-gray-800 rounded-md font-medium hover:bg-gray-200 transition-colors">
            Contact Us for Custom Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;