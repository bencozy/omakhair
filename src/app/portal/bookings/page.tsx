'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Trash2, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { Booking } from '@/types';
import { format, isAfter, subHours } from 'date-fns';
import { formatCurrency } from '@/lib/utils';

export default function BookingsHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        setError('Failed to fetch your bookings. Please try again later.');
      }
    } catch (err) {
      setError('An error occurred while fetching bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (response.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
        alert('Booking cancelled successfully.');
      } else {
        alert('Failed to cancel booking. Please contact support.');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>
  );

  const upcomingBookings = bookings.filter(b => b.status !== 'cancelled' && b.status !== 'completed' && isAfter(new Date(b.appointmentDate), subHours(new Date(), 24)));
  const pastBookings = bookings.filter(b => b.status === 'cancelled' || b.status === 'completed' || !isAfter(new Date(b.appointmentDate), subHours(new Date(), 24)));

  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-serif font-bold tracking-tight text-gray-900">My Bookings</h1>
        <p className="text-gray-500 text-lg">Manage your upcoming and past hair appointments.</p>
      </header>

      {error && (
        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-start">
          <AlertCircle className="w-6 h-6 text-red-500 mr-4" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Upcoming Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold flex items-center text-gray-900">
          <div className="w-1.5 h-6 bg-black rounded-full mr-3" />
          Upcoming Appointments
        </h2>

        {upcomingBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-dashed text-center flex flex-col items-center">
            <Calendar className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No upcoming appointments scheduled.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-3xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between md:items-center gap-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`
                        px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
                      `}>
                        {booking.status}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="font-bold text-gray-900">#{booking.id.slice(-6)}</span>
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-gray-900">
                      {booking.services.map(s => s.name).join(', ')}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="font-medium">{format(new Date(booking.appointmentDate), 'EEEE, MMM do, yyyy')}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="font-medium">{booking.startTime} - {booking.endTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-6 md:pt-0 border-t md:border-none">
                    <button 
                      onClick={() => handleCancelBooking(booking.id)}
                      className="px-6 py-3 border border-red-200 text-red-600 rounded-2xl text-sm font-bold hover:bg-red-50 transition-colors flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                    <button 
                      onClick={() => setExpandedBooking(expandedBooking === booking.id ? null : booking.id)}
                      className="px-6 py-3 bg-gray-50 text-gray-900 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-colors flex items-center"
                    >
                      {expandedBooking === booking.id ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
                      {expandedBooking === booking.id ? 'Show Less' : 'Details'}
                    </button>
                  </div>
                </div>

                {expandedBooking === booking.id && (
                  <div className="px-8 pb-8 pt-4 border-t bg-gray-50/50 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Service Details</h4>
                        <div className="space-y-4">
                          {booking.services.map((service, idx) => (
                            <div key={idx} className="flex justify-between items-start">
                              <div>
                                <p className="font-bold text-gray-900">{service.name}</p>
                                <div className="mt-1 space-y-1">
                                  {booking.selectedAddons[service.id]?.map(addonId => (
                                    <p key={addonId} className="text-xs text-gray-500">+ {addonId.replace(/-/g, ' ')}</p>
                                  ))}
                                </div>
                              </div>
                              <p className="font-medium text-gray-900">{formatCurrency(service.price)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Payment Summary</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Total Price</span>
                            <span className="font-bold text-gray-900">{formatCurrency(booking.totalPrice)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Status</span>
                            <span className={`font-bold ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                              {booking.paymentStatus.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold flex items-center text-gray-400">
          <div className="w-1.5 h-6 bg-gray-200 rounded-full mr-3" />
          Past Appointments
        </h2>

        {pastBookings.length > 0 && (
          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Date</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Services</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Total</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pastBookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{format(new Date(booking.appointmentDate), 'MMM d, yyyy')}</p>
                        <p className="text-xs text-gray-500">{booking.startTime}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-700 truncate max-w-[200px]">
                          {booking.services.map(s => s.name).join(', ')}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`
                          px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter
                          ${booking.status === 'completed' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}
                        `}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {formatCurrency(booking.totalPrice)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setExpandedBooking(expandedBooking === booking.id ? null : booking.id)}
                          className="text-gray-400 hover:text-black transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
