'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format, isToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, isSameDay, addDays, startOfDay, endOfDay } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  DollarSign, 
  Clock, 
  Trash2,
  Download,
  Search,
  ArrowLeft,
  List,
  CalendarDays,
  Ban,
  CheckCircle,
  X,
  LogOut
} from 'lucide-react';
import { Booking, AdminStats, Service } from '@/types';
import { formatCurrency, formatDuration } from '@/lib/utils';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);
  const [showBlockDateModal, setShowBlockDateModal] = useState(false);
  const [dateToBlock, setDateToBlock] = useState<Date | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const bookingDetailsRef = useRef<HTMLDivElement>(null);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        router.push('/login');
        return;
      }
      setIsAuthenticated(true);
    } catch (error) {
      router.push('/login');
    }
  }, [router]);

  // Load bookings and blocked dates from API
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchBookings();
    fetchBlockedDates();
  }, [isAuthenticated]);

  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings', { 
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (data.bookings) {
        const loadedBookings = data.bookings.map((booking: any) => {
          // Parse appointment date without timezone conversion
          const dateStr = booking.appointmentDate.split('T')[0]; // Get YYYY-MM-DD
          const [year, month, day] = dateStr.split('-').map(Number);
          const appointmentDate = new Date(year, month - 1, day); // month is 0-indexed
          
          return {
            id: booking._id,
            customerId: booking.customerId._id || booking.customerId,
            customer: {
              id: booking.customerId._id,
              firstName: booking.customerId.firstName,
              lastName: booking.customerId.lastName,
              email: booking.customerId.email,
              phone: booking.customerId.phone
            },
            serviceIds: booking.serviceIds,
            services: booking.services,
            appointmentDate,
            startTime: booking.startTime,
            endTime: booking.endTime,
            totalPrice: booking.totalPrice,
            discountAmount: booking.discountAmount || 0,
            finalPrice: booking.finalPrice,
            status: booking.status,
            notes: booking.notes || '',
        createdAt: new Date(booking.createdAt),
        updatedAt: new Date(booking.updatedAt)
          };
        });
      setBookings(loadedBookings);
    }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const fetchBlockedDates = async () => {
    try {
      const response = await fetch('/api/blocked-dates', {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (data.blockedDates) {
        const dates = data.blockedDates.map((item: any) => {
          // Parse date without timezone conversion
          const dateStr = item.date.split('T')[0];
          const [year, month, day] = dateStr.split('-').map(Number);
          return new Date(year, month - 1, day);
        });
        setBlockedDates(dates);
      }
    } catch (error) {
      console.error('Failed to fetch blocked dates:', error);
    }
  };

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

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const updateBookingStatus = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchBookings();
        // Update selected booking if it's the one being modified
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking({...selectedBooking, status: newStatus});
        }
        
        // Show notification based on status
        if (newStatus === 'pending') {
          setNotification({ 
            message: 'Booking status updated to pending. Customer will be notified via email when confirmed.', 
            type: 'info' 
          });
        } else if (newStatus === 'confirmed') {
          setNotification({ 
            message: 'Booking confirmed! A confirmation email has been sent to the customer.', 
            type: 'success' 
          });
        } else if (newStatus === 'completed') {
          setNotification({ 
            message: 'Booking marked as completed! A thank you email has been sent to the customer.', 
            type: 'success' 
          });
        } else if (newStatus === 'cancelled') {
          setNotification({ 
            message: 'Booking cancelled. A cancellation email has been sent to the customer.', 
            type: 'success' 
          });
        }
      }
    } catch (error) {
      console.error('Failed to update booking status:', error);
      setNotification({ 
        message: 'Failed to update booking status. Please try again.', 
        type: 'error' 
      });
    }
  };

  const applyDiscount = async (bookingId: string, discount: number) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            discountAmount: discount,
          finalPrice: (selectedBooking?.totalPrice || 0) - discount,
        }),
      });

      if (response.ok) {
        await fetchBookings();
        // Update selected booking with new discount
        if (selectedBooking && selectedBooking.id === bookingId) {
          const finalPrice = selectedBooking.totalPrice - discount;
          setSelectedBooking({
            ...selectedBooking, 
            discountAmount: discount,
            finalPrice: finalPrice
          });
          }
    setShowDiscountModal(false);
    setDiscountAmount(0);
      }
    } catch (error) {
      console.error('Failed to apply discount:', error);
    }
  };

  const deleteBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        await fetchBookings();
        setSelectedBooking(null);
        setShowDeleteModal(false);
        setBookingToDelete(null);
      }
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-800 border border-amber-200';
      case 'confirmed': return 'bg-blue-50 text-blue-800 border border-blue-200';
      case 'completed': return 'bg-green-50 text-green-800 border border-green-200';
      case 'cancelled': return 'bg-gray-50 text-gray-700 border border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getStatusDot = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const toggleBlockedDate = async (date: Date) => {
    const isBlocked = blockedDates.some(d => isSameDay(d, date));
    
    try {
      if (isBlocked) {
        // Find the blocked date ID from the API
        const response = await fetch('/api/blocked-dates', {
          headers: getAuthHeaders()
        });
        const data = await response.json();
        
        if (data.blockedDates) {
          const blockedDate = data.blockedDates.find((item: any) => {
            const dateStr = item.date.split('T')[0];
            const itemDateStr = format(date, 'yyyy-MM-dd');
            return dateStr === itemDateStr;
          });
          
          if (blockedDate) {
            await fetch(`/api/blocked-dates/${blockedDate._id}`, {
              method: 'DELETE',
              headers: getAuthHeaders(),
            });
          }
        }
        
        setBlockedDates(blockedDates.filter(d => !isSameDay(d, date)));
      } else {
        // Add new blocked date
        const dateStr = format(date, 'yyyy-MM-dd');
        await fetch('/api/blocked-dates', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ date: dateStr }),
        });
        
        setBlockedDates([...blockedDates, startOfDay(date)]);
      }
    } catch (error) {
      console.error('Failed to toggle blocked date:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => isSameDay(booking.appointmentDate, date));
  };


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Banner */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[60] max-w-md ${
          notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-900' :
          notification.type === 'error' ? 'bg-red-50 border-red-500 text-red-900' :
          'bg-blue-50 border-blue-500 text-blue-900'
        } border-l-4 p-4 rounded-lg shadow-lg animate-slide-in-right`}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {notification.type === 'success' && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              {notification.type === 'error' && (
                <X className="w-5 h-5 text-red-600" />
              )}
              {notification.type === 'info' && (
                <CalendarIcon className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 gap-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-black hover:text-gray-900 mr-4 sm:mr-8">
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
              
              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    viewMode === 'calendar'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  <span className="hidden sm:inline">Calendar</span>
                </button>
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards - Always show with max-width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl flex-shrink-0">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
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
              <div className="p-3 bg-gray-100 rounded-xl flex-shrink-0">
                <DollarSign className="w-6 h-6 text-black" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700 truncate">Monthly Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Services - Only show in List View */}
        {viewMode === 'list' && stats.popularServices.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {stats.popularServices.map(({ service, count }) => (
                <div key={service.id} className="text-center">
                  <div className="text-2xl font-bold text-black">{count}</div>
                  <div className="text-sm text-gray-700">{service.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Calendar View - Professional FullCalendar */}
      {viewMode === 'calendar' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="space-y-6">
            {/* Calendar Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">Booking Calendar</h2>
                  <p className="text-sm text-gray-600 mt-1">Click on a booking to view details • Click empty dates to block/unblock</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                    <span className="text-gray-600">Blocked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">Pending</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Confirmed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FullCalendar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <FullCalendar
                key={bookings.length}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek'
                }}
                timeZone="local"
                height="auto"
                events={[
                  // Regular bookings
                  ...bookings.map(booking => {
                    // Google Calendar-style professional colors
                    const statusColors = {
                      pending: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
                      confirmed: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
                      completed: { bg: '#d1fae5', border: '#10b981', text: '#065f46' },
                      cancelled: { bg: '#f3f4f6', border: '#6b7280', text: '#4b5563' }
                    };
                    
                    const colors = statusColors[booking.status];
                    
                    // Format date as YYYY-MM-DD for FullCalendar (no timezone issues)
                    const dateStr = format(booking.appointmentDate, 'yyyy-MM-dd');
                    
                    return {
                      id: booking.id,
                      title: `${booking.customer.firstName} ${booking.customer.lastName}`,
                      start: `${dateStr}T${booking.startTime}`,
                      allDay: false,
                      extendedProps: {
                        booking: booking,
                        status: booking.status
                      },
                      backgroundColor: colors.bg,
                      borderColor: colors.border,
                      textColor: colors.text
                    };
                  }),
                  // Blocked dates as background events
                  ...blockedDates.map((date, idx) => ({
                    id: `blocked-${idx}`,
                    start: date,
                    allDay: true,
                    display: 'background',
                    backgroundColor: '#fee2e2',
                    extendedProps: {
                      isBlocked: true
                    }
                  }))
                ]}
                dayCellClassNames={(arg) => {
                  const isBlocked = blockedDates.some(d => isSameDay(d, arg.date));
                  return isBlocked ? 'blocked-date' : '';
                }}
                eventClick={(info) => {
                  // Ignore clicks on blocked date background events
                  if (info.event.extendedProps.isBlocked) {
                    return;
                  }
                  
                  const booking = info.event.extendedProps.booking as Booking;
                  if (booking) {
                    setSelectedBooking(booking);
                    setSelectedCalendarDate(new Date(booking.appointmentDate));
                    
                    // Scroll to booking details with smooth animation
                    setTimeout(() => {
                      bookingDetailsRef.current?.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                      });
                    }, 100);
                  }
                }}
                dateClick={(info) => {
                  const clickedDate = new Date(info.date);
                  const dateBookings = bookings.filter(b => isSameDay(new Date(b.appointmentDate), clickedDate));
                  
                  // If there are no bookings on this date, allow blocking/unblocking
                  if (dateBookings.length === 0) {
                    setDateToBlock(clickedDate);
                    setShowBlockDateModal(true);
                  }
                  
                  setSelectedCalendarDate(clickedDate);
                  setSelectedBooking(null);
                }}
                eventContent={(eventInfo) => {
                  // Skip rendering for blocked date background events
                  if (eventInfo.event.extendedProps.isBlocked) {
                    return null;
                  }
                  
                  const booking = eventInfo.event.extendedProps.booking as Booking;
                  const status = eventInfo.event.extendedProps.status as string;
                  
                  // Safety check
                  if (!booking) {
                    return null;
                  }
                  
                  // Status dot indicator
                  const statusDot = {
                    pending: 'bg-yellow-500',
                    confirmed: 'bg-blue-500',
                    completed: 'bg-green-500',
                    cancelled: 'bg-gray-500'
                  }[status];
                  
                  // Calculate total service duration
                  const totalMinutes = booking.services.reduce((total, service) => total + service.duration, 0);
                  const hours = Math.floor(totalMinutes / 60);
                  const minutes = totalMinutes % 60;
                  const durationText = hours > 0 
                    ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}` 
                    : `${minutes}m`;
                  
                  return (
                    <div className="flex items-center gap-1.5 px-1.5 py-1 w-full">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot}`}></div>
                      <div className="flex-1 min-w-0 text-xs font-medium">
                        <div className="truncate flex items-center gap-1">
                          <span>{booking.startTime}</span>
                          <span className="text-gray-500">({durationText})</span>
                        </div>
                        <div className="truncate font-semibold">{booking.customer.firstName} {booking.customer.lastName}</div>
                      </div>
                    </div>
                  );
                }}
              />
            </div>

            {/* Selected Booking Details */}
            {selectedBooking && (
              <div ref={bookingDetailsRef} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden scroll-mt-6">
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {selectedBooking.customer.firstName} {selectedBooking.customer.lastName}
                        </h3>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(selectedBooking.status)}`}></span>
                          {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {format(selectedBooking.appointmentDate, 'EEEE, MMMM d, yyyy')} at {selectedBooking.startTime}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-md transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Customer Information</h4>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 w-16">Email:</span>
                        <span className="text-gray-900 font-medium">{selectedBooking.customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 w-16">Phone:</span>
                        <span className="text-gray-900 font-medium">{selectedBooking.customer.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Appointment Details</h4>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 w-20">Time:</span>
                        <span className="text-gray-900 font-medium">{selectedBooking.startTime} - {selectedBooking.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 w-20">Duration:</span>
                        <span className="text-gray-900 font-medium">{formatDuration(selectedBooking.services.reduce((t, s) => t + s.duration, 0))}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 w-20">Price:</span>
                        <span className="text-gray-900 font-semibold">{formatCurrency(selectedBooking.finalPrice)}</span>
                      </div>
                      {selectedBooking.discountAmount && selectedBooking.discountAmount > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600 w-20">Discount:</span>
                          <span className="text-green-600 font-medium">-{formatCurrency(selectedBooking.discountAmount)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Services */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Services</h4>
                    <div className="space-y-2">
                      {selectedBooking.services.map((service, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm py-2.5 px-3 bg-gray-50 border border-gray-100 rounded-md">
                          <span className="font-medium text-gray-900">{service.name}</span>
                          <span className="text-gray-600 font-medium">{formatCurrency(service.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                    <select
                      value={selectedBooking.status}
                      onChange={(e) => {
                        updateBookingStatus(selectedBooking.id, e.target.value as Booking['status']);
                        setSelectedBooking({...selectedBooking, status: e.target.value as Booking['status']});
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900 text-sm font-medium"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => setShowDiscountModal(true)}
                      className="px-4 py-2 bg-white text-black border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Apply Discount
                    </button>
                    <button
                      onClick={() => {
                        setBookingToDelete(selectedBooking.id);
                        setShowDeleteModal(true);
                      }}
                      className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition-colors text-sm font-medium"
                    >
                      Delete Booking
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bookings Table - List View with max-width */}
      {viewMode === 'list' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-500 bg-white text-gray-900"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm bg-white text-gray-900 font-medium"
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
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm bg-white text-gray-900 font-medium"
              >
                <option value="all" className="text-gray-900">All Dates</option>
                <option value="today" className="text-gray-900">Today</option>
                <option value="week" className="text-gray-900">This Week</option>
                <option value="month" className="text-gray-900">This Month</option>
              </select>
            </div>
          </div>
        </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col" style={{ maxHeight: 'calc(100vh - 600px)', minHeight: '400px' }}>
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">
              Bookings ({filteredBookings.length})
            </h2>
          </div>
          
          {/* Mobile Card View */}
          <div className="block sm:hidden overflow-y-auto flex-1">
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
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(booking.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(booking.status)}`}></span>
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
                          setBookingToDelete(booking.id);
                          setShowDeleteModal(true);
                        }}
                        className="flex-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
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
          <div className="hidden sm:block overflow-y-auto overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
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
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(booking.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(booking.status)}`}></span>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(booking.finalPrice)}
                      </div>
                      {booking.discountAmount && booking.discountAmount > 0 && (
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
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-500 bg-white text-gray-900 font-medium"
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
                          className="text-gray-700 hover:text-black"
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
                <CalendarIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600">No bookings found</p>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Discount Modal */}
      {showDiscountModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Apply Discount</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Customer</span>
                  <span className="text-gray-900 font-medium">
                    {selectedBooking.customer.firstName} {selectedBooking.customer.lastName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Original Price</span>
                  <span className="text-gray-900 font-semibold">{formatCurrency(selectedBooking.totalPrice)}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Discount Amount
              </label>
              <input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                min="0"
                max={selectedBooking.totalPrice}
                step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900"
                placeholder="0.00"
              />
            </div>
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Final Price</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(selectedBooking.totalPrice - discountAmount)}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setShowDiscountModal(false);
                  setSelectedBooking(null);
                  setDiscountAmount(0);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => applyDiscount(selectedBooking.id, discountAmount)}
                className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition-colors text-sm font-medium"
              >
                Apply Discount
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Date Modal */}
      {showBlockDateModal && dateToBlock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {blockedDates.some(d => isSameDay(d, dateToBlock)) ? 'Unblock Date' : 'Block Date'}
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-2">
                {blockedDates.some(d => isSameDay(d, dateToBlock)) 
                  ? 'Are you sure you want to unblock this date and allow bookings?' 
                  : 'Block this date as a non-working day? No bookings will be allowed.'}
              </p>
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="w-4 h-4 text-gray-600" />
                  <span className="font-semibold text-gray-900">
                    {format(dateToBlock, 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setShowBlockDateModal(false);
                  setDateToBlock(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (dateToBlock) {
                    toggleBlockedDate(dateToBlock);
                  }
                  setShowBlockDateModal(false);
                  setDateToBlock(null);
                }}
                className={`flex-1 px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                  blockedDates.some(d => isSameDay(d, dateToBlock))
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {blockedDates.some(d => isSameDay(d, dateToBlock)) ? 'Unblock Date' : 'Block Date'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && bookingToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-red-50 border-b border-red-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-red-900">Delete Booking</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to delete this booking? This action cannot be undone.
              </p>
              {selectedBooking && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Customer</span>
                    <span className="font-medium text-gray-900">
                      {selectedBooking.customer.firstName} {selectedBooking.customer.lastName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium text-gray-900">
                      {format(selectedBooking.appointmentDate, 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium text-gray-900">
                      {selectedBooking.startTime}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setBookingToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (bookingToDelete) {
                    deleteBooking(bookingToDelete);
                  }
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Delete Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
