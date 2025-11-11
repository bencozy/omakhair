'use client';

import { useState } from 'react';
import { generateVCard, OMAKHAIR_CONTACT } from '@/lib/vcard';
import { Eye, EyeOff } from 'lucide-react';

export function VCardDebug() {
  const [showDebug, setShowDebug] = useState(false);

  const vCardData = generateVCard(OMAKHAIR_CONTACT);

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-600 transition-colors"
      >
        {showDebug ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        {showDebug ? 'Hide' : 'Show'} QR Code Content
      </button>
      
      {showDebug && (
        <div className="mt-3 p-3 bg-gray-100 rounded-lg text-xs font-mono max-w-md mx-auto">
          <div className="text-gray-700 mb-2 font-sans font-semibold">vCard Content:</div>
          <pre className="whitespace-pre-wrap break-all text-gray-800">
            {vCardData}
          </pre>
        </div>
      )}
    </div>
  );
}
