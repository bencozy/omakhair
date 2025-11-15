'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const firstName = searchParams.get('firstName') || 'Customer';
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  const services = searchParams.get('services') || '';
  const total = searchParams.get('total') || '';
  const email = searchParams.get('email') || '';

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            <Link href="/" className="flex items-center text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold ml-8 tracking-tight">
              Book <span className="text-orange-500">Appointment</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Success Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Payment Successful!</h2>
            <p className="text-xl text-gray-300">
              Thank you, <span className="text-white font-semibold">{firstName}</span>! Your booking payment has been confirmed.
            </p>
          </div>

          {/* Appointment Details */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-white mb-4 text-lg">Appointment Details:</h3>
            <div className="space-y-3 text-base">
              {date && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="font-medium text-white">{date}</span>
                </div>
              )}
              {time && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Time:</span>
                  <span className="font-medium text-white">{time}</span>
                </div>
              )}
              {services && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Services:</span>
                  <span className="font-medium text-white">{services}</span>
                </div>
              )}
              {total && (
                <div className="flex justify-between border-t border-gray-700 pt-3 mt-3">
                  <span className="text-gray-400 text-lg">Total:</span>
                  <span className="font-bold text-orange-500 text-lg">{total}</span>
                </div>
              )}
            </div>
          </div>

          {/* Confirmation Box */}
          <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300 text-left">
                <p className="font-semibold mb-1 text-white">Confirmed</p>
                <p>
                  Your appointment is confirmed! A confirmation email has been sent to{' '}
                  <span className="font-semibold text-white">{email}</span> with all the details.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link
              href="/"
              className="bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-all hover:scale-105 text-center shadow-lg"
            >
              Back to Home
            </Link>
            <Link
              href="/book"
              className="border border-gray-700 bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 transition-all text-center shadow-lg"
            >
              Book Another
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}

