'use client';

import { useState } from 'react';
import { 
  PaymentElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { AlertCircle, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentFormProps {
  bookingId: string;
  onSuccess: () => void;
  onError?: (error: string) => void;
  amount: number;
}

export function PaymentForm({ bookingId, onSuccess, onError, amount }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setErrorMessage('');

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message || 'Failed to submit payment details');
        setProcessing(false);
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/book?payment=success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        onError?.(error.message || 'Payment failed');
        setProcessing(false);
      } else {
        onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
      onError?.(err.message || 'An unexpected error occurred');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-nude-peach-dark" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-black">Secure Payment</h3>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-5 bg-gray-100 rounded" />
            <div className="w-8 h-5 bg-gray-100 rounded" />
            <div className="w-8 h-5 bg-gray-100 rounded" />
          </div>
        </div>
        
        <div className="payment-element-container">
          <PaymentElement 
            options={{
              layout: 'accordion',
              theme: 'stripe',
              variables: {
                colorPrimary: '#000000',
                colorBackground: '#ffffff',
                colorText: '#000000',
                colorDanger: '#df1b41',
                fontFamily: 'Inter, system-ui, sans-serif',
                spacingUnit: '5px',
                borderRadius: '16px',
              },
            }}
          />
        </div>
      </div>

      {errorMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl flex items-start gap-3 text-sm"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </motion.div>
      )}

      <div className="space-y-6">
        <button
          disabled={processing || !stripe}
          className="w-full py-5 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-30 hover:bg-nude-peach-dark hover:text-black transition-all duration-300"
        >
          {processing ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pay ${amount} & Confirm
            </>
          )}
        </button>
        
        <p className="text-[10px] text-center text-gray-400 font-medium uppercase tracking-widest flex items-center justify-center gap-2">
          <ShieldCheck className="w-3 h-3" />
          Encryption Secured by Stripe
        </p>
      </div>
    </form>
  );
}
