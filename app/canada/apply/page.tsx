"use client";

import { Suspense, useLayoutEffect, useRef, useState } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loadStripe } from "@stripe/stripe-js";
import { InferType } from "yup";
import { LoaderCircle } from "lucide-react";
import { CanadaFooter } from "../../components/Footer";
import { CanadaHeader } from "../../components/Header";
import { Step1 } from "@/app/components/forms/Step1";
import { Step2 } from "@/app/components/forms/Step2";
import { step1Schema } from "@/lib/schemas/step1Schema";
import { step2Schema } from "@/lib/schemas/step2Schema";
import { useLanguage } from "@/lib/contexts/LanguageContext";

declare global {
  interface Window {
    grecaptcha: {
      execute(siteKey: string, options: { action: string }): Promise<string>;
    };
  }
}

type Step1FormData = InferType<typeof step1Schema>;
type Step2FormData = InferType<typeof step2Schema>;
type CombinedFormData = Step1FormData & Step2FormData;

function ApplyFormMultiStep() {
  const [step, setStep] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1FormData | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const step1Methods = useForm<Step1FormData>({
    resolver: yupResolver(step1Schema) as Resolver<Step1FormData>,
    mode: "onSubmit",
  });

  const step2Methods = useForm<Step2FormData>({
    resolver: yupResolver(step2Schema) as Resolver<Step2FormData>,
    mode: "onSubmit",
  });

  const nextStep = async () => {
    if (await step1Methods.trigger()) {
      setStep1Data(step1Methods.getValues());
      setStep(1);
    }
  };

  const onSubmit = async (data: Step2FormData) => {
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      if (!step1Data) throw new Error("Step 1 data is missing");

      const combinedData: CombinedFormData = { ...step1Data, ...data };
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

      if (!siteKey || typeof window === "undefined" || !window.grecaptcha) {
        throw new Error("The security check is not ready. Please refresh and try again.");
      }

      const recaptchaToken = await window.grecaptcha.execute(siteKey, { action: "submit" });
      const response = await fetch("/api/canada/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...combinedData, recaptchaToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Failed to submit application");
      }

      const checkoutResponse = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: combinedData.email,
          name: `${combinedData.given_name} ${combinedData.surname}`,
        }),
      });

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to initiate payment");
      }

      const { sessionId } = await checkoutResponse.json();
      if (!sessionId) throw new Error("Payment session was not created");

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");
      if (!stripe) throw new Error("Stripe checkout failed to load");

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw new Error(error.message);

      setSubmitStatus("success");
      setHasSubmitted(true);
      step1Methods.reset();
      step2Methods.reset();
      setStep1Data(null);
    } catch (error) {
      console.error("Form submission error", error);
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Submission failed. Please try again.");
    }
  };

  useLayoutEffect(() => {
    if (step > 0) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  return (
    <div ref={formRef} className="application-card">
      <div className="application-progress" aria-label={`Step ${step + 1} of 2`}>
        <span className="is-active" />
        <span className={step === 1 ? "is-active" : ""} />
        Step {step + 1} of 2
      </div>
      {step === 0 ? (
        <FormProvider {...step1Methods}>
          <form onSubmit={step1Methods.handleSubmit(nextStep)} noValidate>
            <Step1
              register={step1Methods.register}
              errors={step1Methods.formState.errors}
              watch={step1Methods.watch}
            />
            <div className="application-actions">
              <button type="submit" className="application-submit">{t.common.next}</button>
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
            <div className="application-actions">
              <button type="button" className="application-back" onClick={() => setStep(0)}>
                {t.common.back}
              </button>
              <button
                type="submit"
                className="application-submit"
                disabled={step2Methods.formState.isSubmitting || hasSubmitted}
              >
                {step2Methods.formState.isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
                    {t.form.processing}
                  </span>
                ) : t.form.submitApplication}
              </button>
            </div>
          </form>
        </FormProvider>
      )}

      {submitStatus === "success" && (
        <div role="status" className="mt-6 border border-green-200 bg-green-50 p-4 font-medium text-green-800">
          {t.form.submissionSuccess}
        </div>
      )}
      {submitStatus === "error" && (
        <div role="alert" className="mt-6 border border-red-200 bg-red-50 p-4 font-medium text-red-800">
          {t.form.submissionError}: {errorMessage}
        </div>
      )}
    </div>
  );
}

export default function ApplyPage() {
  const { t } = useLanguage();

  return (
    <>
      <CanadaHeader />
      <main className="application-page">
        <div className="application-intro">
          <p className="editorial-eyebrow">Private Canada eTA assistance</p>
          <h1>{t.form.title}</h1>
          <p>{t.form.welcome}</p>
        </div>

        <Suspense fallback={<div className="py-12 text-center">{t.common.loading}</div>}>
          <ApplyFormMultiStep />
        </Suspense>
      </main>
      <CanadaFooter />
    </>
  );
}
