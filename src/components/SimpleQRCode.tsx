'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode } from 'lucide-react';
import { generateVCard, OMAKHAIR_CONTACT } from '@/lib/vcard';
import { VCardDebug } from './VCardDebug';

interface SimpleQRCodeProps {
  className?: string;
}

export function SimpleQRCode({ className = '' }: SimpleQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      generateQRCode();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const generateQRCode = async (retryCount = 0) => {
    if (!canvasRef.current) {
      console.log('Canvas ref not available');
      if (retryCount < 3) {
        setTimeout(() => generateQRCode(retryCount + 1), 200);
      } else {
        setError('Canvas not available');
        setIsLoading(false);
      }
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Generate vCard data
      const vCardData = generateVCard(OMAKHAIR_CONTACT);
      
      console.log('Generating QR code with vCard data length:', vCardData.length);
      console.log('vCard preview:', vCardData.substring(0, 100) + '...');
      
      // Generate QR code with simpler options first
      await QRCode.toCanvas(canvasRef.current, vCardData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#be185d', // Rose-700 to match the theme
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M' // Medium error correction for better compatibility
      });

      console.log('QR code generated successfully');
      setIsLoading(false);
    } catch (err) {
      console.error('Error generating QR code (attempt ' + (retryCount + 1) + '):', err);
      
      if (retryCount < 2) {
        // Retry with simpler vCard data
        setTimeout(() => generateQRCode(retryCount + 1), 500);
      } else {
        setError(`Failed to generate QR code: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="inline-block">
        <div className="flex items-center justify-center gap-2 mb-3">
          <QrCode className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Save Our Contact</h3>
        </div>
        
        <div className="bg-white p-3 rounded-xl border-2 border-gray-100 shadow-sm inline-block">
          {isLoading && (
            <div className="w-[200px] h-[200px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
              <div className="text-gray-400 text-xs">Generating QR Code...</div>
            </div>
          )}
          {error && (
            <div className="w-[200px] h-[200px] bg-red-50 rounded-lg flex items-center justify-center">
              <div className="text-red-500 text-xs text-center px-2">{error}</div>
            </div>
          )}
          <canvas
            ref={canvasRef}
            className={`${isLoading || error ? 'hidden' : 'block'} rounded-lg`}
            style={{ maxWidth: '200px', maxHeight: '200px' }}
          />
        </div>
        
        <p className="text-sm text-gray-600 mt-2 max-w-xs">
          Scan with your phone camera to save our contact info
        </p>
        
        <VCardDebug />
      </div>
    </div>
  );
}
