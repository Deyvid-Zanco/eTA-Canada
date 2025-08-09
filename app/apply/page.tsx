"use client";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, Suspense } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useLanguage } from "../../lib/contexts/LanguageContext";
import { Step1PassportDetails } from './form/Step1PassportDetail';
import { Step2AdditionalInfo } from './form/Step2AdditionalInfo';
import { schema, FormValues } from './form/schemas';

declare global {
  interface Window {
    grecaptcha: {
      execute(siteKey: string, options: { action: string }): Promise<string>;
    };
  }
}

const defaultValues: FormValues = {
  travel_document: '',
  nationality: '',
  taiwan_id: '',
  us_visa_number: '',
  us_visa_number_confirm: '',
  us_visa_expiry_month: '',
  us_visa_expiry_day: '',
  us_visa_expiry_year: '',
  passport_number: '',
  passport_number_confirm: '',
  surname: '',
  given_name: '',
  dob_month: '',
  dob_day: '',
  dob_year: '',
  gender: '',
  birth_country: '',
  birth_city: '',
  passport_issue_month: '',
  passport_issue_day: '',
  passport_issue_year: '',
  passport_expiry_month: '',
  passport_expiry_day: '',
  passport_expiry_year: '',
  additional_nationality: '',
  additional_nationality_details: '',
  marital_status: '',
  canada_visa_applied: '',
  previous_visa_number: '',
  previous_visa_number_confirm: '',
  occupation: '',
  job_description: '',
  employer_name: '',
  employment_country: '',
  employer_city: '',
  employment_start_year: '',
  apartment_number: '',
  street_number: '',
  street_name: '',
  city_town: '',
  district_region: '',
  address_country: '',
  zip_code: '',
  email: '',
  phone: '',
  do_you_know_travel_date: '',
  travel_date_month: '',
  travel_date_day: '',
  travel_date_year: '',
  consent_declaration: false,
};

function ApplyForm() {
  const [step, setStep] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isEligible, setIsEligible] = useState(true);
  const { t } = useLanguage();

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    defaultValues: defaultValues,
  });

  const { handleSubmit, trigger, setValue, reset, formState } = methods;

  const handleNationalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setValue('nationality', value);
    setIsEligible(value !== 'OTHER');
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitStatus('idle');
    setErrorMessage('');
    try {
      let recaptchaToken = '';
      if (typeof window !== 'undefined' && window.grecaptcha) {
        recaptchaToken = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, { action: 'submit' });
      } else {
        throw new Error('reCAPTCHA not loaded');
      }

      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, recaptchaToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit application');
      }

      const checkoutRes = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, name: `${data.given_name} ${data.surname}` }),
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
      reset();
    } catch (err: unknown) {
      setSubmitStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    }
  };

  const handleNext = async () => {
    const step1Fields: (keyof FormValues)[] = [ 'travel_document', 'nationality', 'taiwan_id', 'us_visa_number', 'us_visa_number_confirm', 'us_visa_expiry_month', 'us_visa_expiry_day', 'us_visa_expiry_year', 'passport_number', 'passport_number_confirm', 'surname', 'given_name', 'dob_month', 'dob_day', 'dob_year', 'gender', 'birth_country', 'birth_city', 'passport_issue_month', 'passport_issue_day', 'passport_issue_year', 'passport_expiry_month', 'passport_expiry_day', 'passport_expiry_year' ];
    const isValid = await trigger(step1Fields);
    if (isValid) {
      setStep(1);
    }
  };

  const handleBack = () => setStep(0);

  return (
    <FormProvider {...methods}>
      <form className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-8" onSubmit={handleSubmit(onSubmit)}>
        {step === 0 && <Step1PassportDetails t={t} isEligible={isEligible} onNationalityChange={handleNationalityChange} />}
        {step === 1 && <Step2AdditionalInfo t={t} />}

        <div className="text-center flex justify-between mt-8">
          {step > 0 ? (
            <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-md font-semibold" onClick={handleBack}>
              {t.common.back}
            </button>
          ) : (
            <div></div>
          )}
          {step < 1 ? (
            <button type="button" className="bg-red-600 hover:bg-red-700 text-white py-2 px-12 rounded-md text-lg font-semibold" onClick={handleNext} disabled={!isEligible}>
              {t.common.next}
            </button>
          ) : (
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-12 rounded-md text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={formState.isSubmitting || hasSubmitted}
            >
              {formState.isSubmitting ? 'Processing...' : 'Submit and Pay'}
            </button>
          )}
        </div>
        
        {submitStatus === 'success' && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">{t.form.submissionSuccess}</p>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">{t.form.submissionError}: {errorMessage}</p>
          </div>
        )}
      </form>
    </FormProvider>
  );
}

export default function ApplyPage() {
  const { t } = useLanguage();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <Head>
        <title>eTA Application Form | canada-eta.visasyst.com</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Header />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">{t.form.title}</h1>
        <div className="text-center mb-8">
          <p className="text-lg text-gray-700">{t.form.welcome}</p>
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
          <ApplyForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}