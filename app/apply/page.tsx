"use client";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DateInputGroup from "../components/DateInputGroup";
import { useSearchParams } from "next/navigation";
import { COUNTRIES } from "../../lib/countries"; // path from app folder
import { useState, Suspense } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

function ApplyForm() {
  const searchParams = useSearchParams();
  const preNationality = searchParams.get("nationality") || "";
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    
    // Execute reCAPTCHA v3
    if (!executeRecaptcha) {
      setSubmitStatus('error');
      setErrorMessage('reCAPTCHA not available. Please refresh the page.');
      setIsSubmitting(false);
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha('form_submit');
      formData.append('g-recaptcha-response', recaptchaToken);

      const response = await fetch('/api/apply', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        e.currentTarget.reset();
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Failed to submit application');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-8">
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">✅ Application submitted successfully!</p>
          <p className="text-green-700 text-sm mt-1">We&apos;ll review your application and contact you soon.</p>
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">❌ Error: {errorMessage}</p>
          <p className="text-red-700 text-sm mt-1">Please try again or contact support if the problem persists.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Row 1 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">
              TRAVEL DOCUMENT *
            </label>
            <select
              name="travel_document"
              required
              className="w-full border rounded p-2"
            >
              <option value="">Select...</option>
              <option value="passport">Passport</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">
              WHAT IS THE NATIONALITY NOTED ON THIS PASSPORT? *
            </label>
            <select
              name="nationality"
              required
              className="w-full border rounded p-2"
              defaultValue={preNationality}
            >
              <option value="">Select...</option>
              {COUNTRIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">PASSPORT NUMBER *</label>
            <input
              type="text"
              name="passport_number"
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">
              PASSPORT NUMBER (RE-ENTER) *
            </label>
            <input
              type="text"
              name="passport_number_confirm"
              required
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">SURNAME(S) / LAST NAME(S) *</label>
            <input
              type="text"
              name="surname"
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">GIVEN NAME(S) / FIRST NAME(S) *</label>
            <input
              type="text"
              name="given_name"
              required
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <DateInputGroup label="DATE OF BIRTH *" name="dob" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">GENDER *</label>
            <select name="gender" required className="w-full border rounded p-2">
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Row 5 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">
              COUNTRY/TERRITORY OF BIRTH *
            </label>
            <select
              name="birth_country"
              required
              className="w-full border rounded p-2"
            >
              <option value="">Select...</option>
              {/* Add options */}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">CITY/TOWN OF BIRTH *</label>
            <input
              type="text"
              name="birth_city"
              required
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        {/* Row 6 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <DateInputGroup
              label="DATE OF ISSUE OF PASSPORT *"
              name="passport_issue_date"
              required
            />
          </div>
          <div>
            <DateInputGroup
              label="DATE OF EXPIRY OF PASSPORT *"
              name="passport_expiry_date"
              required
            />
          </div>
        </div>

        {/* Additional Nationality */}
        <div>
          <p className="font-medium mb-2">
            ARE YOU A CITIZEN OF ANY ADDITIONAL NATIONALITIES? *
          </p>
          <div className="flex gap-6">
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="additional_nationality" value="yes" required />
              Yes
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="additional_nationality" value="no" required />
              No
            </label>
          </div>
        </div>

        {/* Marital status */}
        <div>
          <label className="block mb-1 font-medium">Marital status *</label>
          <select name="marital_status" required className="w-full border rounded p-2">
            <option value="">Select...</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
          </select>
        </div>

        {/* Previous application */}
        <div>
          <p className="font-medium mb-2">
            HAVE YOU EVER APPLIED FOR OR OBTAINED A VISA, AN ETA OR A PERMIT TO VISIT, LIVE, WORK OR STUDY IN CANADA? *
          </p>
          <div className="flex gap-6">
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="previous_application" value="yes" required />
              Yes
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="previous_application" value="no" required />
              No
            </label>
          </div>
        </div>

        {/* Occupation */}
        <div>
          <label className="block mb-1 font-medium">Occupation *</label>
          <select name="occupation" required className="w-full border rounded p-2">
            <option value="">Select...</option>
            <option value="employed">Employed</option>
            <option value="student">Student</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Address Fields */}
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-1 font-medium">Apartment Number</label>
            <input type="text" name="apartment_number" className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Street Number</label>
            <input type="text" name="street_number" className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Street Name</label>
            <input type="text" name="street_name" className="w-full border rounded p-2" />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-1 font-medium">City/Town</label>
            <input type="text" name="city" className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block mb-1 font-medium">District/Region</label>
            <input type="text" name="district" className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Zipcode</label>
            <input type="text" name="zipcode" className="w-full border rounded p-2" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">
              COUNTRY/TERRITORY *
            </label>
            <select
              name="address_country"
              required
              className="w-full border rounded p-2"
            >
              <option value="">Select...</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">
              Email of applicant *
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">
              Phone number (including area code) *
            </label>
            <input
              type="tel"
              name="phone_number"
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <p className="font-medium mb-2">
              DO YOU KNOW WHEN YOU WILL TRAVEL TO CANADA? *
            </p>
            <div className="flex gap-6">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="knows_travel_date" value="yes" required />
                Yes
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="knows_travel_date" value="no" required />
                No
              </label>
            </div>
          </div>
        </div>

        {/* Consent */}
        <div>
          <label className="inline-flex items-start gap-2">
            <input type="checkbox" name="consent_checkbox" required className="mt-1" />
            <span>
              I agree to the terms and conditions and certify that the
              information provided is true and correct.
            </span>
          </label>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white py-3 px-12 rounded-md text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <>
      <Head>
        <title>eTA Application Form | canada-eta.visasyst.com</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Header />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          CANADA ETA PERMIT AUTHORIZATION
        </h1>
        <Suspense fallback={<div className="text-center py-12">Loading form...</div>}>
          <ApplyForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
} 