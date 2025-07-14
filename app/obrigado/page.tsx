"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ObrigadoPage() {
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get('session_id');
    if (sessionId) {
      setEmailStatus('sending');
      fetch('/api/payment-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setEmailStatus('sent');
          } else {
            setEmailStatus('error');
            setErrorMsg(data.error || 'Failed to send payment confirmation email.');
          }
        })
        .catch(() => {
          setEmailStatus('error');
          setErrorMsg('Failed to send payment confirmation email.');
        });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-xl w-full text-center">
        <div className="flex justify-center mb-4">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="28" cy="28" r="28" fill="#E6F4EA"/>
            <path d="M18 29.5L25 36.5L38 23.5" stroke="#34A853" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#34A853] mb-2">PURCHASE ORDER COMPLETED!</h1>
        <p className="mb-6">Hello!</p>
        <p className="mb-2">
          We have received your request for the issuance of the Electronic Travel Authorization (eTA) for Canada.
        </p>
        <p className="mb-2">
          Your application will be processed shortly.<br/>
          <span className="font-semibold">Processing time may take a few minutes or up to 72 hours.</span>
        </p>
        <p className="mb-2 font-semibold">IMPORTANT INFORMATION:</p>
        <p className="mb-6">
          We suggest keeping an eye on your email inbox as <span className="font-bold">well as your SPAM folder</span>, as mentioned during the application process, for future communications and updates regarding your application.
        </p>
        <p className="mb-6">Best regards,<br/>Applicant Support – eTA Canada Support</p>
        {emailStatus === 'sending' && <p className="text-blue-600 mb-4">Sending payment confirmation email...</p>}
        {emailStatus === 'sent' && <p className="text-green-600 mb-4">Payment confirmation email sent!</p>}
        {emailStatus === 'error' && <p className="text-red-600 mb-4">{errorMsg}</p>}
        <Link href="/apply">
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded shadow">
            Click here to apply again
          </button>
        </Link>
      </div>
    </div>
  );
} 