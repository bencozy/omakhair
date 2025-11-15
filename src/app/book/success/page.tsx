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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center text-gray-700 hover:text-black transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-black ml-8 tracking-tight">
              Book Appointment
            </h1>
          </div>
        </div>
      </header>

      {/* Success Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="text-xl text-gray-700">
              Thank you, {firstName}! Your booking payment has been confirmed.
            </p>
          </div>

          {/* Appointment Details */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-3">Appointment Details:</h3>
            <div className="space-y-2 text-sm">
              {date && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Date:</span>
                  <span className="font-medium text-gray-900">{date}</span>
                </div>
              )}
              {time && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Time:</span>
                  <span className="font-medium text-gray-900">{time}</span>
                </div>
              )}
              {services && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Services:</span>
                  <span className="font-medium text-gray-900">{services}</span>
                </div>
              )}
              {total && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Total:</span>
                  <span className="font-medium text-gray-900">{total}</span>
                </div>
              )}
            </div>
          </div>

          {/* Confirmation Box */}
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-900 text-left">
                <p className="font-semibold mb-1">Confirmed</p>
                <p>
                  Your appointment is confirmed! A confirmation email has been sent to{' '}
                  <span className="font-semibold">{email}</span> with all the details.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/"
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors text-center"
            >
              Back to Home
            </Link>
            <Link
              href="/book"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
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
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}

