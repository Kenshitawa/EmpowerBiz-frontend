"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { acceptOwnerInvitationAction, type InvitationState } from "@/app/actions";

const initialState: InvitationState = {};

export function OwnerInvitationForm() {
  const [token, setToken] = useState("");
  const [state, action, pending] = useActionState(acceptOwnerInvitationAction, initialState);
  useEffect(() => {
    const timer = window.setTimeout(() => setToken(window.location.hash.slice(1)), 0);
    return () => window.clearTimeout(timer);
  }, []);
  if (state.success) {
    return <div className="invite-result"><span className="invite-success"><Check size={20} /></span><span className="eyebrow">YOU HAVE A SHOP NOW</span><h2>Your account is ready.</h2><p>Your password has been set. Sign in to start getting your shop ready for customers.</p><Link className="button-primary" href="/login">Sign in to your shop <ArrowRight size={15} /></Link></div>;
  }
  return <form action={action} className="auth-form">
    <p className="invitation-intro">Set up your owner account and choose a strong password. The invitation can only be used once.</p>
    {state.error && <p className="notice error-notice">{state.error}</p>}
    <label className="form-field">Invitation code<input name="token" value={token} onChange={(event) => setToken(event.target.value)} required minLength={32} maxLength={100} /></label>
    <label className="form-field">Your name<input name="full_name" autoComplete="name" required minLength={2} maxLength={120} placeholder="Your full name" /></label>
    <label className="form-field">Invited email<input type="email" name="email" autoComplete="email" required maxLength={254} placeholder="The email used for your invitation" /></label>
    <label className="form-field">Create a password<input type="password" name="password" autoComplete="new-password" required minLength={12} maxLength={128} placeholder="At least 12 characters" /></label>
    <button className="button-primary auth-submit" disabled={pending}>{pending ? "Setting up your account..." : "Activate owner account"} <ArrowRight size={16} /></button>
  </form>;
}
