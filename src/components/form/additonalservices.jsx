import React, { useState, useEffect } from "react";

const AdditionalServices = ({ onServiceChange, initialServices }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch services on component mount only
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${apiUrl}/extra`);
        const result = await response.json();
        if (Array.isArray(result)) { // Changed from result.success to Array.isArray
          const servicesWithCount = result.map((service) => {
            const initialService =
              !isInitialized &&
              initialServices?.find((s) => s.id === service.id); // Changed _id to id
            return {
              ...service,
              count: initialService ? initialService.count : 0,
              regularPrice: service.price * 1.25, // Changed rolePrice to price
              roleName: service.name, // Map name to roleName
              rolePrice: service.price // Map price to rolePrice
            };
          });
          setServices(servicesWithCount);

          // If we have initial services and haven't initialized yet, update the total price
          if (!isInitialized && initialServices?.length > 0) {
            const totalAdditionalPrice = servicesWithCount.reduce(
              (sum, service) => {
                return sum + service.price * service.count; // Changed rolePrice to price
              },
              0
            );
            onServiceChange(
              totalAdditionalPrice,
              servicesWithCount.filter((s) => s.count > 0)
            );
            setIsInitialized(true);
          }
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Function to increment service count
  const incrementService = (id) => {
    const updatedServices = services.map((service) =>
      service.id === id ? { ...service, count: service.count + 1 } : service // Changed _id to id
    );
    setServices(updatedServices);
    updateTotalPrice(updatedServices);
  };

  // Function to decrement service count
  const decrementService = (id) => {
    const updatedServices = services.map((service) =>
      service.id === id && service.count > 0 // Changed _id to id
        ? { ...service, count: service.count - 1 }
        : service
    );
    setServices(updatedServices);
    updateTotalPrice(updatedServices);
  };

  // Calculate additional services total price
  const updateTotalPrice = (updatedServices) => {
    const totalAdditionalPrice = updatedServices.reduce((sum, service) => {
      return sum + service.price * service.count; // Changed rolePrice to price
    }, 0);

    // Notify parent component about the change
    onServiceChange(
      totalAdditionalPrice,
      updatedServices.filter((s) => s.count > 0)
    );
  };

  if (loading) {
    return <div className="text-center py-4">Loading services...</div>;
  }

  return (
    <div className="additional-services my-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="service-item border border-gray-300 rounded-lg p-4 flex flex-col h-full"
          >
            <div className="flex-grow">
              <div className="font-medium">{service.name}</div>
              <div className="flex items-center">
                <span className="font-bold text-blue-600">
                  {service.price.toFixed(2)} EUR
                </span>
              </div>
            </div>

            {service.count > 0 ? (
              <div className="counter-controls mt-2 flex items-center justify-center border rounded">
                <button
                  type="button"
                  className="px-4 py-2 text-lg font-bold text-blue-600"
                  onClick={() => decrementService(service.id)}
                >
                  -
                </button>
                <span className="px-4 py-2">{service.count}</span>
                <button
                  type="button"
                  className="px-4 py-2 text-lg font-bold text-blue-600"
                  onClick={() => incrementService(service.id)}
                >
                  +
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="mt-2 py-2 w-full bg-black text-white rounded font-medium transition-colors"
                onClick={() => incrementService(service.id)}
              >
                Add
              </button>
            )}
          </div>
        ))}
      </div>

      {services.some((service) => service.count > 0) && (
        <div className="selected-services mt-4 p-4 bg-gray-100 rounded">
          <h4 className="font-medium mb-2">Selected additional services:</h4>
          <ul>
            {services
              .filter((service) => service.count > 0)
              .map((service) => (
                <li
                  key={service.id}
                  className="flex justify-between items-center py-1"
                >
                  <span>
                    {service.name} (x{service.count}) {/* Changed roleName to name */}
                  </span>
                  <span className="font-semibold">
                    {(service.price * service.count).toFixed(2)} EUR {/* Changed rolePrice to price */}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdditionalServices;