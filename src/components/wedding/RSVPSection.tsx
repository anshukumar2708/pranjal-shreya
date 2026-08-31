"use client";

import { useState } from "react";
import type { RsvpConfig, RsvpErrors, RsvpFormValues, RsvpStatus } from "@/types/wedding";
import FlowerCorner from "@/components/decorations/FlowerCorner";
import FloatingPetals from "@/components/decorations/FloatingPetals";
import Mandala from "@/components/decorations/Mandala";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

interface RSVPSectionProps {
  config: RsvpConfig;
  coupleName: string;
}

const EMPTY: RsvpFormValues = {
  name: "",
  email: "",
  phone: "",
  guests: "1",
  attending: "",
  event: "",
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Accepts an optional country code plus 7–14 digits, ignoring spaces and dashes.
const PHONE_PATTERN = /^\+?[\d][\d\s-]{6,16}$/;

function validate(values: RsvpFormValues, config: RsvpConfig): RsvpErrors {
  const errors: RsvpErrors = {};

  if (!values.name.trim()) {
    errors.name = "Please tell us your name.";
  } else if (values.name.trim().length < 2) {
    errors.name = "That name looks a little short.";
  }

  if (!values.email.trim()) {
    errors.email = "We need an email to send you updates.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please check that email address.";
  }

  if (!values.phone.trim()) {
    errors.phone = "A phone number helps us reach you on the day.";
  } else if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!values.attending) {
    errors.attending = "Let us know if you can make it.";
  }

  const guests = Number(values.guests);
  if (values.attending === "yes") {
    if (!Number.isInteger(guests) || guests < 1) {
      errors.guests = "Please enter at least one guest.";
    } else if (guests > config.maxGuests) {
      errors.guests = `Please contact the family directly for more than ${config.maxGuests} guests.`;
    }

    if (!values.event) errors.event = "Pick the event you are joining us for.";
  }

  if (values.message.length > 500) {
    errors.message = "Please keep your message under 500 characters.";
  }

  return errors;
}

/** Shared field shell: label, control slot and inline error. */
function Field({
  id,
  label,
  error,
  children,
  required,
  hint,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-1.5 block font-serif-alt text-[0.65rem] tracking-[0.18em] text-maroon-700 uppercase"
      >
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-royal-500">
            *
          </span>
        ) : null}
      </label>

      {children}

      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-soft/75">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-royal-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const INPUT_CLASS =
  "w-full rounded-xl border border-gold-500/40 bg-white/75 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 transition-colors focus:border-marigold-500 focus:bg-white sm:text-base";

export default function RSVPSection({ config, coupleName }: RSVPSectionProps) {
  const [values, setValues] = useState<RsvpFormValues>(EMPTY);
  const [errors, setErrors] = useState<RsvpErrors>({});
  const [status, setStatus] = useState<RsvpStatus>("idle");

  const update = <K extends keyof RsvpFormValues>(key: K, value: RsvpFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    // Clear a field's error as soon as the guest starts correcting it.
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values, config);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      // Move focus to the first problem so keyboard and screen-reader users land on it.
      const firstKey = Object.keys(nextErrors)[0];
      document.getElementById(`rsvp-${firstKey}`)?.focus();
      setStatus("idle");
      return;
    }

    setStatus("submitting");

    try {
      if (config.endpoint) {
        const response = await fetch(config.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      } else {
        // No backend wired up yet — simulate the round trip so the UI is complete.
        await new Promise((resolve) => setTimeout(resolve, 900));
      }

      setStatus("success");
      setValues(EMPTY);
    } catch {
      setStatus("error");
    }
  };

  const attending = values.attending === "yes";

  return (
    <section
      id="rsvp"
      aria-labelledby="rsvp-heading"
      className="relative overflow-hidden bg-gradient-to-b from-marigold-100/50 via-ivory to-rose-pink-200/40 px-4 py-20 sm:px-6 sm:py-24"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="pattern-mandala absolute inset-0 opacity-45" />
        <Mandala
          className="absolute top-1/2 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2"
          opacity={0.08}
          color="#c1121f"
        />
      </div>

      <FloatingPetals count={9} />

      <SectionHeading
        id="rsvp-heading"
        eyebrow={`Kindly respond by ${config.deadline}`}
        script="Will you"
        title="Join Us?"
        subtitle="Every seat at our table has a name on it. Let us know yours so we can keep one ready for you."
      />

      <Reveal variant="scale" className="mx-auto mt-12 w-full max-w-3xl">
        <div className="glass-card gold-frame relative rounded-[2rem] px-5 py-9 sm:px-10 sm:py-12">
          <FlowerCorner position="tl" className="absolute top-1 left-1 z-0 h-12 w-12 opacity-45 sm:h-16 sm:w-16" />
          <FlowerCorner position="br" className="absolute right-1 bottom-1 z-0 h-12 w-12 opacity-45 sm:h-16 sm:w-16" />

          {status === "success" ? (
            <div className="relative z-10 py-8 text-center" role="status" aria-live="polite">
              <p aria-hidden="true" className="text-5xl">
                🌸
              </p>
              <h3 className="mt-5 font-script text-4xl text-maroon-700 sm:text-5xl">
                Thank you!
              </h3>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">
                Your response is with us. {coupleName} cannot wait to celebrate with you — we
                will be in touch closer to the date with all the final details.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="btn-outline-gold mt-8"
              >
                Send another response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="relative z-10 grid gap-5 sm:gap-6">
              <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                <Field id="rsvp-name" label="Guest Name" error={errors.name} required>
                  <input
                    id="rsvp-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={(event) => update("name", event.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "rsvp-name-error" : undefined}
                    placeholder="Your full name"
                    className={INPUT_CLASS}
                  />
                </Field>

                <Field id="rsvp-email" label="Email" error={errors.email} required>
                  <input
                    id="rsvp-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(event) => update("email", event.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "rsvp-email-error" : undefined}
                    placeholder="you@example.com"
                    className={INPUT_CLASS}
                  />
                </Field>

                <Field id="rsvp-phone" label="Phone" error={errors.phone} required>
                  <input
                    id="rsvp-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={values.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "rsvp-phone-error" : undefined}
                    placeholder="+91 98765 43210"
                    className={INPUT_CLASS}
                  />
                </Field>

                <Field
                  id="rsvp-guests"
                  label="Number of Guests"
                  error={errors.guests}
                  hint={`Including yourself, up to ${config.maxGuests}.`}
                >
                  <input
                    id="rsvp-guests"
                    name="guests"
                    type="number"
                    min={1}
                    max={config.maxGuests}
                    step={1}
                    inputMode="numeric"
                    value={values.guests}
                    onChange={(event) => update("guests", event.target.value)}
                    aria-invalid={Boolean(errors.guests)}
                    aria-describedby={
                      errors.guests ? "rsvp-guests-error" : "rsvp-guests-hint"
                    }
                    disabled={values.attending === "no"}
                    className={`${INPUT_CLASS} disabled:cursor-not-allowed disabled:opacity-50`}
                  />
                </Field>
              </div>

              {/* Attending — a radio group styled as two cards */}
              <fieldset>
                <legend className="mb-2 font-serif-alt text-[0.65rem] tracking-[0.18em] text-maroon-700 uppercase">
                  Will you be attending?
                  <span aria-hidden="true" className="ml-1 text-royal-500">
                    *
                  </span>
                </legend>

                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      { value: "yes", label: "Joyfully Accepts", icon: "💐" },
                      { value: "no", label: "Regretfully Declines", icon: "🕊️" },
                    ] as const
                  ).map((option) => {
                    const selected = values.attending === option.value;

                    return (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-marigold-500 ${
                          selected
                            ? "border-maroon-700 bg-maroon-700 text-cream-100 shadow-petal"
                            : "border-gold-500/40 bg-white/70 text-maroon-800 hover:border-marigold-500"
                        }`}
                      >
                        <input
                          type="radio"
                          name="attending"
                          id={option.value === "yes" ? "rsvp-attending" : undefined}
                          value={option.value}
                          checked={selected}
                          onChange={() => update("attending", option.value)}
                          aria-describedby={errors.attending ? "rsvp-attending-error" : undefined}
                          className="sr-only"
                        />
                        <span aria-hidden="true" className="text-xl">
                          {option.icon}
                        </span>
                        <span className="font-display text-base font-semibold sm:text-lg">
                          {option.label}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full border ${
                            selected ? "border-cream-100 bg-cream-100" : "border-gold-500/60"
                          }`}
                        >
                          {selected ? (
                            <span className="h-2.5 w-2.5 rounded-full bg-maroon-700" />
                          ) : null}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {errors.attending ? (
                  <p
                    id="rsvp-attending-error"
                    role="alert"
                    className="mt-1.5 text-xs font-medium text-royal-600"
                  >
                    {errors.attending}
                  </p>
                ) : null}
              </fieldset>

              <Field
                id="rsvp-event"
                label="Preferred Event"
                error={errors.event}
                hint={attending ? undefined : "Choose 'Joyfully Accepts' to pick an event."}
              >
                <select
                  id="rsvp-event"
                  name="event"
                  value={values.event}
                  onChange={(event) => update("event", event.target.value)}
                  aria-invalid={Boolean(errors.event)}
                  aria-describedby={errors.event ? "rsvp-event-error" : "rsvp-event-hint"}
                  disabled={!attending}
                  className={`${INPUT_CLASS} disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <option value="">Select an event…</option>
                  {config.eventOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="rsvp-message"
                label="Message for the Couple"
                error={errors.message}
                hint={`${values.message.length}/500 characters`}
              >
                <textarea
                  id="rsvp-message"
                  name="message"
                  rows={4}
                  maxLength={500}
                  value={values.message}
                  onChange={(event) => update("message", event.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? "rsvp-message-error" : "rsvp-message-hint"
                  }
                  placeholder="Blessings, wishes, or a song you want played…"
                  className={`${INPUT_CLASS} resize-y`}
                />
              </Field>

              {status === "error" ? (
                <p
                  role="alert"
                  className="rounded-xl border border-royal-500/40 bg-royal-500/10 px-4 py-3 text-sm text-royal-600"
                >
                  Something went wrong sending your response. Please try again, or call the
                  family directly using the numbers in the footer.
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-royal w-full disabled:cursor-wait disabled:opacity-70"
              >
                {status === "submitting" ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin rounded-full border-2 border-cream-100/40 border-t-cream-100"
                    />
                    Sending…
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">✦</span>
                    Confirm Attendance
                  </>
                )}
              </button>

              <p className="text-center text-xs text-ink-soft/75">
                Fields marked <span className="text-royal-500">*</span> are required.
              </p>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}
