"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';

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
    <>
      {/* Google tag (gtag.js) */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=AW-16512154233"
      />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'AW-16512154233');
        `}
      </Script>
      <Script id="conversion-event">
        {`
          gtag('event', 'conversion', {
              'send_to': 'AW-16512154233/tQOZCLmLoaAZEPn0zcE9',
              'value': 1.0,
              'currency': 'BRL',
              'transaction_id': ''
          });
        `}
      </Script>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-xl w-full text-center">
          <div className="flex justify-center mb-4">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28" cy="28" r="28" fill="#E6F4EA"/>
              <path d="M18 29.5L25 36.5L38 23.5" stroke="#34A853" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#34A853] mb-2">PURCHASE ORDER COMPLETED!</h1>
          <p className="mb-6 text-gray-900 dark:text-gray-100">Hello!</p>
          <p className="mb-2 text-gray-900 dark:text-gray-100">
            We have received your request for the issuance of the Electronic Travel Authorization (eTA) for Canada.
          </p>
          <p className="mb-2 text-gray-900 dark:text-gray-100">
            Your application will be processed shortly.<br/>
            <span className="font-semibold">Processing time may take a few minutes or up to 72 hours.</span>
          </p>
          <p className="mb-2 font-semibold text-gray-900 dark:text-gray-100">IMPORTANT INFORMATION:</p>
          <p className="mb-6 text-gray-900 dark:text-gray-100">
            We suggest keeping an eye on your email inbox as <span className="font-bold">well as your SPAM folder</span>, as mentioned during the application process, for future communications and updates regarding your application.
          </p>
          <p className="mb-6 text-gray-900 dark:text-gray-100">Best regards,<br/>Applicant Support – eTA Canada Support</p>
          {emailStatus === 'sending' && <p className="text-blue-600 dark:text-blue-400 mb-4">Sending payment confirmation email...</p>}
          {emailStatus === 'sent' && <p className="text-green-600 dark:text-green-400 mb-4">Payment confirmation email sent!</p>}
          {emailStatus === 'error' && <p className="text-red-600 dark:text-red-400 mb-4">{errorMsg}</p>}
          <Link href="/apply">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded shadow transition-colors">
              Need to apply for someone else? Click here to return to the form
            </button>
          </Link>
        </div>
      </div>
    </>
  );
} 