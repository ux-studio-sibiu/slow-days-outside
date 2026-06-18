"use client";

import { FormEvent, useState } from "react";
import { signupSubmit } from "@/app/actions/signup-submit";
import "./signup-form.scss";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;

type Status = "idle" | "loading" | "success" | "error";

export default function SignupForm({ eventId, eventTitle }: { eventId: string; eventTitle?: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState("");

  const validate = (fd: FormData) => {
    const e: Record<string, string> = {};
    if (!fd.get("childName")?.toString().trim()) e.childName = "Numele copilului este obligatoriu";
    if (!fd.get("parentName")?.toString().trim()) e.parentName = "Numele părintelui este obligatoriu";
    const email = fd.get("contactEmail")?.toString().trim() || "";
    const phone = fd.get("contactPhone")?.toString().trim() || "";
    if (!email) e.contactEmail = "Emailul este obligatoriu";
    else if (!EMAIL_RE.test(email)) e.contactEmail = "Email invalid";
    if (!phone) e.contactPhone = "Telefonul este obligatoriu";
    else if (!PHONE_RE.test(phone)) e.contactPhone = "Număr de telefon invalid";
    return e;
  };

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const next = validate(fd);
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus("loading");
    const result = await signupSubmit(fd);
    if (result.success) setStatus("success");
    else {
      setStatus("error");
      setErrorMsg(result.error);
    }
  };

  if (!open) {
    return (
      <button type="button" className="nsc-signup-trigger" onClick={() => setOpen(true)}>
        Înscrie-te <span className="btn-arrow">→</span>
      </button>
    );
  }

  if (status === "success") {
    return (
      <div className="nsc-signup-form is-success">
        <p className="signup-success">Înscrierea a fost trimisă. Vă mulțumim!</p>
        <button type="button" className="signup-cancel" onClick={() => { setOpen(false); setStatus("idle"); }}>
          Închide
        </button>
      </div>
    );
  }

  return (
    <div className="nsc-signup-form">
      <form onSubmit={handleSubmit} className="signup-fields" noValidate>
        <input type="hidden" name="eventId" value={eventId} />
        <h3 className="signup-title">Înscriere{eventTitle ? ` — ${eventTitle}` : ""}</h3>

        <div className="signup-group">
          <label htmlFor={`childName-${eventId}`}>Numele copilului</label>
          <input id={`childName-${eventId}`} name="childName" className={errors.childName ? "has-error" : ""} />
          {errors.childName && <p className="signup-error">{errors.childName}</p>}
        </div>

        <div className="signup-group">
          <label htmlFor={`parentName-${eventId}`}>Numele părintelui</label>
          <input id={`parentName-${eventId}`} name="parentName" className={errors.parentName ? "has-error" : ""} />
          {errors.parentName && <p className="signup-error">{errors.parentName}</p>}
        </div>

        <div className="signup-group">
          <label htmlFor={`contactEmail-${eventId}`}>Email</label>
          <input id={`contactEmail-${eventId}`} type="email" name="contactEmail" className={errors.contactEmail ? "has-error" : ""} />
          {errors.contactEmail && <p className="signup-error">{errors.contactEmail}</p>}
        </div>

        <div className="signup-group">
          <label htmlFor={`contactPhone-${eventId}`}>Telefon</label>
          <input id={`contactPhone-${eventId}`} type="tel" name="contactPhone" className={errors.contactPhone ? "has-error" : ""} />
          {errors.contactPhone && <p className="signup-error">{errors.contactPhone}</p>}
        </div>

        {status === "error" && <p className="signup-error signup-error-summary">{errorMsg}</p>}

        <div className="signup-actions">
          <button type="button" className="signup-cancel" onClick={() => setOpen(false)}>
            Anulează
          </button>
          <button type="submit" className="signup-submit text-uppercase" disabled={status === "loading"}>
            {status === "loading" ? "Se trimite…" : "Trimite"}
          </button>
        </div>
      </form>
    </div>
  );
}
