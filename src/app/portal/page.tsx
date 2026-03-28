'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight,
  Sparkles,
  Scissors
} from 'lucide-react';
import { Booking } from '@/types';
import { format } from 'date-fns';

export default function PortalDashboard() {
  const [nextBooking, setNextBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) setUser(JSON.parse(userStr));

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my-bookings`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const bookings: Booking[] = await response.json();
          // Find the next upcoming confirmed or pending booking
          const upcoming = bookings
            .filter(b => (b.status === 'confirmed' || b.status === 'pending') && new Date(b.appointmentDate) >= new Date())
            .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())[0];
          
          setNextBooking(upcoming || null);
        }
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>
  );

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-serif font-bold tracking-tight text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-500 text-lg">Manage your appointments and hair preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Next Appointment Card */}
        <div className="bg-white rounded-3xl p-8 border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-black/5 rounded-2xl">
                <Calendar className="w-6 h-6 text-black" />
              </div>
              <span className={`
                px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest
                ${nextBooking?.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
              `}>
                {nextBooking ? nextBooking.status : 'No Upcoming'}
              </span>
            </div>
            
            {nextBooking ? (
              <div className="space-y-4">
                <h3 className="text-2xl font-serif font-bold text-gray-900">
                  {nextBooking.services.map(s => s.name).join(', ')}
                </h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                    <span>{format(new Date(nextBooking.appointmentDate), 'EEEE, MMMM do, yyyy')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-3 text-gray-400" />
                    <span>{nextBooking.startTime} - {nextBooking.endTime}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-serif font-bold text-gray-900">Ready for a new look?</h3>
                <p className="text-gray-500">You don't have any upcoming appointments scheduled.</p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <Link 
              href={nextBooking ? `/portal/bookings` : `/book`}
              className="w-full flex items-center justify-center py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors"
            >
              <span>{nextBooking ? 'Manage Appointment' : 'Book an Appointment'}</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>

        {/* Quick Links / Tips */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start">
              <div className="p-3 bg-amber-50 rounded-2xl mr-4">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-1">Update your Profile</h4>
                <p className="text-gray-500 text-sm mb-4">Save your hair type and styling preferences for faster booking.</p>
                <Link href="/portal/profile" className="text-black font-bold text-sm inline-flex items-center hover:underline">
                  Go to settings <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-black rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-serif font-bold text-2xl mb-2">New Services!</h4>
              <p className="text-gray-300 mb-6">Check out our latest styles including Braids and Custom Wigs.</p>
              <Link href="/services" className="px-6 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors inline-block">
                View Gallery
              </Link>
            </div>
            <Scissors className="absolute -right-10 -bottom-10 w-48 h-48 text-white/10 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
