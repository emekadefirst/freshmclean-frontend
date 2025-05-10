import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const DayTimeSelector = ({ onDayTimeSelected, initialDays = [], initialTime = '11:00' }) => {
    const [selectedDays, setSelectedDays] = useState(initialDays);
    const [selectedTime, setSelectedTime] = useState(initialTime);
    const [availableTimes] = useState([
        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
    ]);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    useEffect(() => {
        // Ensure onDayTimeSelected sends the correct data
        const formattedDays = selectedDays.map((day) => day.toUpperCase().substring(0, 3));
        onDayTimeSelected(formattedDays, selectedTime);
    }, [selectedDays, selectedTime]);

    const handleDayClick = (day) => {
        setSelectedDays(prevDays => {
            if (prevDays.includes(day)) {
                return prevDays.filter(d => d !== day);
            }
            return [...prevDays, day].sort((a, b) => weekDays.indexOf(a) - weekDays.indexOf(b));
        });
    };

    const handleTimeChange = (time) => {
        if (selectedTime === time) {
            setSelectedTime('11:00'); // Reset to default instead of empty
        } else {
            setSelectedTime(time);
        }
    };

    return (
        <div className="mt-8">
            <h3 className="font-medium mb-3">Select cleaning days</h3>
            <div className="grid grid-cols-7 gap-2 mb-6">
                {weekDays.map((day) => (
                    <button
                        key={day}
                        type="button"
                        onClick={() => handleDayClick(day)}
                        className={`p-2 text-sm border rounded-md text-center ${
                            selectedDays.includes(day)
                                ? 'bg-blue-50 border-blue-600 text-blue-600'
                                : 'border-gray-200 hover:border-blue-600'
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            <h3 className="font-medium mb-3">Select cleaning time</h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {availableTimes.map((time) => (
                    <button
                        key={time}
                        type="button"
                        onClick={() => handleTimeChange(time)}
                        className={`p-2 text-sm border rounded-md ${
                            selectedTime === time
                                ? 'bg-blue-50 border-blue-600 text-blue-600'
                                : 'border-gray-200 hover:border-blue-600'
                        }`}
                    >
                        {time}
                    </button>
                ))}
            </div>
            
            {/* Selected days summary */}
            {selectedDays.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                        <span className="font-medium">Selected days:</span> {selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''}
                    </p>
                </div>
            )}
        </div>
    );
};

export default DayTimeSelector;