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
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            <Link href="/" className="flex items-center text-gray-500 hover:text-black transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold ml-8 tracking-tight">
              Book <span className="text-black">Appointment</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Success Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-black">Payment Successful!</h2>
            <p className="text-xl text-gray-500">
              Thank you, <span className="text-black font-semibold">{firstName}</span>! Your booking payment has been confirmed.
            </p>
          </div>

          {/* Appointment Details */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-black mb-4 text-lg">Appointment Details:</h3>
            <div className="space-y-3 text-base">
              {date && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="font-medium text-black">{date}</span>
                </div>
              )}
              {time && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Time:</span>
                  <span className="font-medium text-black">{time}</span>
                </div>
              )}
              {services && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Services:</span>
                  <span className="font-medium text-black">{services}</span>
                </div>
              )}
              {total && (
                <div className="flex justify-between border-t border-gray-100 pt-3 mt-3">
                  <span className="text-gray-400 text-lg">Total Paid:</span>
                  <span className="font-bold text-black text-lg">{total}</span>
                </div>
              )}
            </div>
          </div>

          {/* Confirmation Box */}
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-500 text-left">
                <p className="font-semibold mb-1 text-black">Confirmed</p>
                <p>
                  Your appointment is confirmed! A confirmation email has been sent to{' '}
                  <span className="font-semibold text-black">{email}</span> with all the details.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link
              href="/"
              className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-900 transition-all text-center shadow-sm"
            >
              Back to Home
            </Link>
            <Link
              href="/book"
              className="border border-gray-200 bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all text-center"
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
