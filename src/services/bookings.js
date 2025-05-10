import { apiCall } from './api';

export const BookingService = {
  // Get all bookings
  getAllBookings: async (token) => {
    try {
      return await apiCall('bookings', null, 'GET', token);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Create a new booking
  createBooking: async (bookingData, token) => {
    try {
      return await apiCall('bookings', bookingData, 'POST', token);
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Get a specific booking by ID
  getBookingById: async (bookingId, token) => {
    try {
      return await apiCall(`bookings/${bookingId}`, null, 'GET', token);
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  // Update a booking
  updateBooking: async (bookingId, updateData, token) => {
    try {
      return await apiCall(`bookings/${bookingId}`, updateData, 'PATCH', token);
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  // Delete a booking
  deleteBooking: async (bookingId, token) => {
    try {
      return await apiCall(`bookings/${bookingId}`, null, 'DELETE', token);
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }
};
