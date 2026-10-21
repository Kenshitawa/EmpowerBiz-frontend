"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Check, Copy, Store } from "lucide-react";
import { createTenantAction, type OnboardingState } from "@/app/actions";

const initialState: OnboardingState = {};

export function TenantOnboardingForm() {
  const [state, action, pending] = useActionState(createTenantAction, initialState);
  const [copied, setCopied] = useState(false);
  async function copyInvite() {
    if (!state.token) return;
    const link = window.location.origin + "/invite#" + state.token;
    await navigator.clipboard.writeText(link);
    setCopied(true);
  }
  if (state.token) {
    return <div className="invite-result"><span className="invite-success"><Check size={20} /></span><span className="eyebrow">THE SHOP IS READY</span><h2>{state.shopName} has a home.</h2><p>The owner account is ready for activation. Copy this one-time invitation link and share it directly with the shop owner. It expires in seven days.</p><div className="invite-link-preview"><Store size={16} /><span>Private owner invitation · one use</span></div><button type="button" className="button-primary" onClick={copyInvite}>{copied ? "Invite link copied" : "Copy owner invite link"} <Copy size={15} /></button>{copied && <small className="copy-feedback">Share the link with the owner using your preferred private channel.</small>}</div>;
  }
  return <form action={action} className="product-editor">
    {state.error && <p className="notice error-notice full-field">{state.error}</p>}
    <label className="form-field">Shop name<input name="name" minLength={2} maxLength={100} placeholder="e.g. Nia Botanicals" required /></label>
    <label className="form-field">Business category<select name="category" required defaultValue=""><option value="" disabled>Choose a category</option><option>Home & living</option><option>Fashion</option><option>Food & pantry</option><option>Beauty & wellness</option><option>Art & craft</option><option>Other</option></select></label>
    <label className="form-field full-field">A little about the shop<textarea name="description" rows={4} minLength={8} maxLength={500} placeholder="What does this shop make or do?" required /></label>
    <label className="form-field">Owner name<input name="owner_name" minLength={2} maxLength={120} placeholder="Shop owner's name" required /></label>
    <label className="form-field">Owner email<input type="email" name="owner_email" maxLength={254} placeholder="owner@example.com" required /></label>
    <div className="product-editor-actions"><a href="/dashboard" className="continue-shopping">Cancel</a><button className="button-primary" disabled={pending}>{pending ? "Setting up shop..." : "Create shop & invite owner"} <ArrowRight size={16} /></button></div>
  </form>;
}
