'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, isToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  Trash2,
  Download,
  Search,
  ArrowLeft
} from 'lucide-react';
import { Booking, AdminStats, Service } from '@/types';
import { formatCurrency, formatDuration } from '@/lib/utils';

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalBookings: 0,
    todayBookings: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    popularServices: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Load bookings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bookings');
    if (saved) {
      const loadedBookings = JSON.parse(saved).map((booking: Booking) => ({
        ...booking,
        appointmentDate: new Date(booking.appointmentDate),
        createdAt: new Date(booking.createdAt),
        updatedAt: new Date(booking.updatedAt)
      }));
      setBookings(loadedBookings);
    }
  }, []);

  // Calculate stats
  useEffect(() => {
    const now = new Date();
    const thisWeek = { start: startOfWeek(now), end: endOfWeek(now) };
    const thisMonth = { start: startOfMonth(now), end: endOfMonth(now) };

    const todayBookings = bookings.filter(booking => isToday(booking.appointmentDate)).length;
    const weeklyRevenue = bookings
      .filter(booking => 
        isWithinInterval(booking.appointmentDate, thisWeek) && 
        booking.status !== 'cancelled'
      )
      .reduce((sum, booking) => sum + booking.finalPrice, 0);
    
    const monthlyRevenue = bookings
      .filter(booking => 
        isWithinInterval(booking.appointmentDate, thisMonth) && 
        booking.status !== 'cancelled'
      )
      .reduce((sum, booking) => sum + booking.finalPrice, 0);

    // Calculate popular services
    const serviceCount: { [key: string]: { service: Service; count: number } } = {};
    bookings.forEach(booking => {
      booking.services.forEach(service => {
        if (serviceCount[service.id]) {
          serviceCount[service.id].count++;
        } else {
          serviceCount[service.id] = { service, count: 1 };
        }
      });
    });

    const popularServices = Object.values(serviceCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setStats({
      totalBookings: bookings.length,
      todayBookings,
      weeklyRevenue,
      monthlyRevenue,
      popularServices
    });
  }, [bookings]);

  // Filter bookings
  useEffect(() => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.services.some(service => 
          service.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(booking => isToday(booking.appointmentDate));
          break;
        case 'week':
          const thisWeek = { start: startOfWeek(now), end: endOfWeek(now) };
          filtered = filtered.filter(booking => 
            isWithinInterval(booking.appointmentDate, thisWeek)
          );
          break;
        case 'month':
          const thisMonth = { start: startOfMonth(now), end: endOfMonth(now) };
          filtered = filtered.filter(booking => 
            isWithinInterval(booking.appointmentDate, thisMonth)
          );
          break;
      }
    }

    // Sort by appointment date (newest first)
    filtered.sort((a, b) => b.appointmentDate.getTime() - a.appointmentDate.getTime());

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const updateBookingStatus = (bookingId: string, newStatus: Booking['status']) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus, updatedAt: new Date() }
        : booking
    );
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  const applyDiscount = (bookingId: string, discount: number) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId 
        ? { 
            ...booking, 
            discountAmount: discount,
            finalPrice: booking.totalPrice - discount,
            updatedAt: new Date()
          }
        : booking
    );
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setShowDiscountModal(false);
    setSelectedBooking(null);
    setDiscountAmount(0);
  };

  const deleteBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
      setBookings(updatedBookings);
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 gap-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-rose-600 hover:text-rose-700 mr-4 sm:mr-8">
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl flex-shrink-0">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700 truncate">Total Bookings</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl flex-shrink-0">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700 truncate">Today&apos;s Bookings</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.todayBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl flex-shrink-0">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700 truncate">Weekly Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(stats.weeklyRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-rose-100 rounded-xl flex-shrink-0">
                <DollarSign className="w-6 h-6 text-rose-600" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700 truncate">Monthly Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Services */}
        {stats.popularServices.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {stats.popularServices.map(({ service, count }) => (
                <div key={service.id} className="text-center">
                  <div className="text-2xl font-bold text-rose-600">{count}</div>
                  <div className="text-sm text-gray-700">{service.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-4 sm:p-6 border border-gray-100">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search customers, services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder-gray-500 bg-white text-gray-900"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white text-gray-900 font-medium"
              >
                <option value="all" className="text-gray-900">All Statuses</option>
                <option value="pending" className="text-gray-900">Pending</option>
                <option value="confirmed" className="text-gray-900">Confirmed</option>
                <option value="completed" className="text-gray-900">Completed</option>
                <option value="cancelled" className="text-gray-900">Cancelled</option>
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white text-gray-900 font-medium"
              >
                <option value="all" className="text-gray-900">All Dates</option>
                <option value="today" className="text-gray-900">Today</option>
                <option value="week" className="text-gray-900">This Week</option>
                <option value="month" className="text-gray-900">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Bookings ({filteredBookings.length})
            </h2>
          </div>
          
          {/* Mobile Card View */}
          <div className="block sm:hidden">
            {filteredBookings.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No bookings found matching your criteria.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {booking.customer.firstName} {booking.customer.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{booking.customer.email}</p>
                        <p className="text-sm text-gray-600">{booking.customer.phone}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.services.map(s => s.name).join(', ')}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatDuration(booking.services.reduce((total, s) => total + s.duration, 0))}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {format(booking.appointmentDate, 'MMM d, yyyy')}
                        </p>
                        <p className="text-xs text-gray-600">
                          {booking.startTime} - {booking.endTime}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(booking.finalPrice)}
                        </p>
                        {booking.discountAmount && booking.discountAmount > 0 && (
                          <p className="text-xs text-green-600">
                            -{formatCurrency(booking.discountAmount)} discount
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowDiscountModal(true);
                        }}
                        className="flex-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        Discount
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this booking?')) {
                            deleteBooking(booking.id);
                          }
                        }}
                        className="flex-1 px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.customer.firstName} {booking.customer.lastName}
                        </div>
                        <div className="text-sm text-gray-600">{booking.customer.email}</div>
                        <div className="text-sm text-gray-600">{booking.customer.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {booking.services.map(service => service.name).join(', ')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDuration(booking.services.reduce((total, service) => total + service.duration, 0))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(booking.appointmentDate, 'MMM d, yyyy')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {booking.startTime} - {booking.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(booking.finalPrice)}
                      </div>
                      {booking.discountAmount && (
                        <div className="text-xs text-green-600">
                          -{formatCurrency(booking.discountAmount)} discount
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <select
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value as Booking['status'])}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white text-gray-900 font-medium"
                        >
                          <option value="pending" className="text-gray-900">Pending</option>
                          <option value="confirmed" className="text-gray-900">Confirmed</option>
                          <option value="completed" className="text-gray-900">Completed</option>
                          <option value="cancelled" className="text-gray-900">Cancelled</option>
                        </select>
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowDiscountModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Apply Discount"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteBooking(booking.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600">No bookings found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discount Modal */}
      {showDiscountModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply Discount</h3>
            <p className="text-gray-700 mb-4">
              Customer: {selectedBooking.customer.firstName} {selectedBooking.customer.lastName}
            </p>
            <p className="text-gray-700 mb-4">
              Original Price: {formatCurrency(selectedBooking.totalPrice)}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Discount Amount
              </label>
              <input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                min="0"
                max={selectedBooking.totalPrice}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder-gray-500"
                placeholder="0.00"
              />
            </div>
            <p className="text-sm text-gray-700 mb-6">
              Final Price: {formatCurrency(selectedBooking.totalPrice - discountAmount)}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDiscountModal(false);
                  setSelectedBooking(null);
                  setDiscountAmount(0);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => applyDiscount(selectedBooking.id, discountAmount)}
                className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
              >
                Apply Discount
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
