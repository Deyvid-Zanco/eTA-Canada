"use client";
import React from "react";
import Head from "next/head";
import { CanadaHeader } from "../../components/Header";
import { CanadaFooter } from "../../components/Footer";
import { useState, useRef, useLayoutEffect, Suspense, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loadStripe } from '@stripe/stripe-js';

import { step1Schema } from "@/lib/schemas/step1Schema";
import { step2Schema } from "@/lib/schemas/step2Schema";
import { Step1 } from "@/app/components/forms/Step1";
import { Step2 } from "@/app/components/forms/Step2";
import { InferType } from 'yup';
import { Resolver } from 'react-hook-form';
import { LoaderCircle, ShieldCheck } from 'lucide-react';

import { useLanguage } from "../../../lib/contexts/LanguageContext";

// Add this for TypeScript to recognize grecaptcha on window
declare global {
  interface Window {
    grecaptcha: {
      execute(siteKey: string, options: { action: string }): Promise<string>;
    };
  }
}

// Use inferred types from Yup schemas
type Step1FormData = InferType<typeof step1Schema>;
type Step2FormData = InferType<typeof step2Schema>;
type CombinedFormData = Step1FormData & Step2FormData;

function ApplyFormMultiStep() {
  const [step, setStep] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1FormData | null>(null);
  const { t } = useLanguage();
  
  // Create separate form instances for each step
  const step1Methods = useForm<Step1FormData>({
    resolver: yupResolver(step1Schema) as Resolver<Step1FormData>,
    mode: 'onSubmit'
  });

  const step2Methods = useForm<Step2FormData>({
    resolver: yupResolver(step2Schema) as Resolver<Step2FormData>,
    mode: 'onSubmit'
  });

  const nextStep = async () => {
    if (step === 0) {
      const isValid = await step1Methods.trigger();
      if (isValid) {
        const step1FormData = step1Methods.getValues();
        setStep1Data(step1FormData);
        setStep(1);
      }
    }
  };

  const onSubmit = async (data: Step2FormData) => {
    setSubmitStatus('idle');
    setErrorMessage('');
    
    try {
      console.log('🚀 Starting form submission...');
      
      if (!step1Data) {
        throw new Error('Step 1 data is missing');
      }
      
      // Combine Step 1 and Step 2 data
      const combinedData: CombinedFormData = {
        ...step1Data,
        ...data
      };
      
      let recaptchaToken = '';
      if (typeof window !== 'undefined' && window.grecaptcha) {
        recaptchaToken = await window.grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
          { action: 'submit' }
        );
      } else {
        throw new Error('reCAPTCHA not loaded');
      }

      const response = await fetch('/api/canada/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...combinedData, recaptchaToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit application');
      }

      const checkoutRes = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: combinedData.email,
          name: `${combinedData.given_name} ${combinedData.surname}`,
        }),
      });
      
      if (!checkoutRes.ok) {
        const errorData = await checkoutRes.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to initiate payment');
      }
      
      const { sessionId } = await checkoutRes.json();
      if (!sessionId) throw new Error('No sessionId returned from payment API');

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) throw new Error('Stripe.js failed to load');
      
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw new Error(error.message);

      setSubmitStatus('success');
      setHasSubmitted(true);
      step1Methods.reset();
      step2Methods.reset();
      setStep1Data(null);

    } catch (err: unknown) {
      console.error('❌ Form submission error:', err);
      setSubmitStatus('error');
      if (err instanceof Error) {
        setErrorMessage(err.message || 'Submission failed. Please try again.');
      } else {
        setErrorMessage('Submission failed. Please try again.');
      }
    }
  };

  const formRef = useRef<HTMLDivElement>(null);

  // Scroll to top of the form on step change
  useLayoutEffect(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  return (
    <div ref={formRef} className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-8">
      {step === 0 ? (
        <FormProvider {...step1Methods}>
          <form onSubmit={step1Methods.handleSubmit(nextStep)} noValidate>
            <Step1 
              register={step1Methods.register} 
              errors={step1Methods.formState.errors} 
              watch={step1Methods.watch} 
            />
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-12 rounded-md text-lg font-semibold"
              >
                {t.common.next}
              </button>
            </div>
          </form>
        </FormProvider>
      ) : (
        <FormProvider {...step2Methods}>
          <form onSubmit={step2Methods.handleSubmit(onSubmit)} noValidate>
            <Step2 
              register={step2Methods.register} 
              errors={step2Methods.formState.errors} 
              watch={step2Methods.watch} 
            />
            <div className="flex justify-between items-center mt-8">
              <button 
                type="button" 
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-md font-semibold" 
                onClick={() => setStep(0)}
              >
                {t.common.back}
              </button>
              
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-12 rounded-md text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={step2Methods.formState.isSubmitting || hasSubmitted}
              >
                {step2Methods.formState.isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoaderCircle className="h-5 w-5 animate-spin text-white" aria-hidden="true" />
                    {t.form.processing}
                  </span>
                ) : (
                  t.form.submitApplication
                )}
              </button>
            </div>
          </form>
        </FormProvider>
      )}

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 font-medium">
          {t.form.submissionSuccess}
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 font-medium">
          {t.form.submissionError}: {errorMessage}
        </div>
      )}
    </div>
  );
}

export default function ApplyPage() {
  const { t } = useLanguage();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Head>
        <title>Private Canada eTA Application Assistance | IMMI WORLD</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <CanadaHeader />
      <main className="container mx-auto py-12 px-4">
        <div className="mx-auto mb-8 max-w-4xl rounded-lg border border-slate-300 bg-slate-50 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-6 w-6 flex-none text-[#071b34]" aria-hidden="true" />
            <div>
              <p className="font-bold text-[#071b34]">Private paid assistance — not a government website</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                IMMI WORLD charges US$42 for its optional review and guidance service. The official Canada eTA fee is CAN$7 and is separate. We cannot issue an eTA, guarantee approval, or influence processing time.
              </p>
              <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta/apply.html" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-blue-800 underline underline-offset-4">
                Apply directly on the official Canada.ca website
              </a>
            </div>
          </div>
        </div>
        {/* These static sections match the layout of your old page */}
        <h1 className="text-3xl font-bold mb-8 text-center">
          {t.form.title}
        </h1>
        
        <div className="text-center mb-8">
          <p className="text-lg text-gray-700">
            {t.form.welcome}
          </p>
        </div>
        
        <div className="border-t border-gray-300 mb-8"></div>
        
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t.form.ifYouApply.title}</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 justify-center">
              <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <p className="text-gray-700">{t.form.ifYouApply.point1}</p>
            </div>
            <div className="flex items-start gap-3 justify-center">
              <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <p className="text-gray-700">{t.form.ifYouApply.point2}</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t.form.permitRenewal.title}</h2>
          <div className="flex items-start gap-3 justify-center">
            <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">✓</span>
            </div>
            <p className="text-gray-700">{t.form.permitRenewal.content}</p>
          </div>
        </div>
        
        <Suspense fallback={<div className="text-center py-12">{t.common.loading}</div>}>
          <ApplyFormMultiStep />
        </Suspense>
      </main>
      <CanadaFooter />
    </>
  );
}
