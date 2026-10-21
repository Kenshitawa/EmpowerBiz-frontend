import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { registerCustomerAction } from "@/app/actions";
import { getCurrentUser } from "@/lib/local-auth";
import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function RegisterPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (user) redirect(user.account_type === "customer" ? "/account/orders" : "/dashboard");
  const params = await searchParams;
  return <main className="auth-page"><section className="auth-aside"><Link href="/" className="wordmark"><span className="brand-mark">e<span>.</span></span><span>empower<span className="wordmark-light">Biz</span></span></Link><div><span className="eyebrow">SHOP SMALL, STAY IN THE LOOP</span><h1>Your next<br />good find is <em>near.</em></h1><p>Create an account to keep track of your orders from independent Kenyan shops.</p><span className="auth-aside-flower">✳</span></div><span className="auth-footer-note">LOCAL DEMO · DATA STAYS ON THIS MACHINE</span></section><section className="auth-form-side"><div className="auth-card"><Link href="/marketplace" className="back-link"><ArrowLeft size={15} /> Back to marketplace</Link><span className="eyebrow">A BETTER WAY TO SHOP SMALL</span><h2>Join the community.</h2><p>Your account keeps your orders together in one place.</p>{params.error === "exists" && <p className="notice error-notice">That email already has an account. Sign in to continue.</p>}{params.error === "validation" && <p className="notice error-notice">Check your details. Passwords need at least 12 characters.</p>}<form action={registerCustomerAction} className="auth-form"><label className="form-field">Full name<input name="full_name" autoComplete="name" minLength={2} maxLength={120} required /></label><label className="form-field">Email address<input type="email" name="email" autoComplete="email" maxLength={254} required /></label><label className="form-field">Password<input type="password" name="password" autoComplete="new-password" minLength={12} maxLength={128} required /><small>Use at least 12 characters.</small></label><button className="button-primary auth-submit">Create my account <ArrowUpRight size={16} /></button></form><p className="auth-create">Already shopping with us? <Link href="/login">Sign in</Link></p></div></section></main>;
}
