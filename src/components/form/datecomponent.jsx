import React, { useState, useEffect } from 'react';
import { format, addDays, isBefore, isAfter, startOfDay, isValid, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

const DateTimeSelector = ({ onDateTimeSelected, initialDateTime, frequency }) => {
    // console.log('DateTimeSelector render - initialDateTime:', initialDateTime);
    
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedTime, setSelectedTime] = useState('11:00');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isUpdating, setIsUpdating] = useState(false);
    const [availableTimes] = useState([
        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
    ]);

    // Generate dates for the current month
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Add some days from previous/next month to fill the grid
    const firstDayOfMonth = monthStart.getDay();
    const lastDayOfMonth = monthEnd.getDay();
    
    const prevMonthDays = [];
    const nextMonthDays = [];
    
    // Add days from previous month
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        prevMonthDays.unshift(addDays(monthStart, -i - 1));
    }
    
    // Add days from next month
    for (let i = 1; i <= 6 - lastDayOfMonth; i++) {
        nextMonthDays.push(addDays(monthEnd, i));
    }
    
    const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];

    // Handle initial date setup
    useEffect(() => {
        if (initialDateTime && !isUpdating) {
            try {
                const initialDates = Array.isArray(initialDateTime) ? initialDateTime : [initialDateTime];
                const validDates = initialDates
                    .map(date => new Date(date))
                    .filter(date => isValid(date));
                
                if (validDates.length > 0) {
                    setIsUpdating(true);
                    setSelectedDates(validDates);
                    const firstDate = validDates[0];
                    setSelectedTime(format(firstDate, 'HH:mm') || '11:00');
                    setCurrentMonth(firstDate);
                    setIsUpdating(false);
                }
            } catch (error) {
                console.error('Error setting initial date:', error);
                setIsUpdating(false);
            }
        }
    }, [initialDateTime]);

    const handleDateClick = (date) => {
        if (!isValid(date) || isUpdating) return;

        setIsUpdating(true);
        setSelectedDates(prevDates => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const dateExists = prevDates.some(d => 
                format(d, 'yyyy-MM-dd') === dateStr
            );
            
            if (dateExists) {
                return prevDates.filter(d => 
                    format(d, 'yyyy-MM-dd') !== dateStr
                );
            } else {
                return [...prevDates, date].sort((a, b) => a - b);
            }
        });
        setIsUpdating(false);
    };

    const handleTimeChange = (time) => {
        if (isUpdating) return;
        
        setIsUpdating(true);
        if (selectedTime === time) {
            setSelectedTime('11:00');
        } else {
            setSelectedTime(time);
        }
        setIsUpdating(false);
    };

    // Debounced update to parent
    useEffect(() => {
        if (isUpdating || selectedDates.length === 0) return;

        // Ensure onDateTimeSelected sends the correct data
        const dateTimeObjects = selectedDates.map(date => {
            const dateTime = new Date(date);
            const [hours, minutes] = selectedTime.split(':');
            dateTime.setHours(parseInt(hours), parseInt(minutes));
            return dateTime.toISOString().split('T')[0]; // Send only the date part
        });
        onDateTimeSelected(dateTimeObjects);
    }, [selectedDates, selectedTime]);

    const goToPreviousMonth = () => {
        setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
    };

    const isDateSelectable = (date) => {
        const today = startOfDay(new Date());
        return !isBefore(date, today);
    };

    return (
        <div className="mt-8">
            <h3 className="font-medium mb-3">Select cleaning dates</h3>
            
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
                <button 
                    type="button" 
                    onClick={goToPreviousMonth}
                    className="p-2 rounded-md hover:bg-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
                <h4 className="text-lg font-medium">
                    {format(currentMonth, 'MMMM yyyy')}
                </h4>
                <button 
                    type="button" 
                    onClick={goToNextMonth}
                    className="p-2 rounded-md hover:bg-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            
            {/* Calendar grid */}
            <div className="mb-6">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500">
                            {day}
                        </div>
                    ))}
                </div>
                
                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                    {allDays.map((date, index) => {
                        if (!isValid(date)) return null;
                        
                        const isCurrentMonth = isSameMonth(date, currentMonth);
                        const isSelectable = isDateSelectable(date);
                        const isSelected = selectedDates.some(d => isSameDay(d, date));
                        
                        return (
                            <button
                                key={date.toISOString()}
                                type="button"
                                onClick={() => isSelectable && handleDateClick(date)}
                                disabled={!isSelectable}
                                className={`
                                    p-2 text-sm border rounded-md text-center
                                    ${!isCurrentMonth ? 'text-gray-300' : ''}
                                    ${!isSelectable ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : ''}
                                    ${isSelected ? 'bg-blue-50 border-blue-600 text-blue-600' : 'border-gray-200 hover:border-blue-600'}
                                `}
                            >
                                {format(date, 'd')}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time selection */}
            {/* <h3 className="font-medium mb-3">Select cleaning time</h3>
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
            </div> */}
            
            {/* Selected dates summary */}
            {selectedDates.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                        <span className="font-medium">Selected dates:</span> {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''}
                    </p>
                </div>
            )}
        </div>
    );
};

export default DateTimeSelector;