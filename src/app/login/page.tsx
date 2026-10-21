import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Store } from "lucide-react";
import { loginAction } from "@/app/actions";
import { getCurrentUser } from "@/lib/local-auth";
import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (user) redirect(user.account_type === "customer" ? "/account/orders" : "/dashboard");
  const params = await searchParams;
  return <main className="auth-page"><section className="auth-aside"><Link href="/" className="wordmark"><span className="brand-mark">e<span>.</span></span><span>empower<span className="wordmark-light">Biz</span></span></Link><div><span className="eyebrow">FOR THE PEOPLE WHO MAKE IT HAPPEN</span><h1>Good business<br />deserves a <em>good home.</em></h1><p>Bring your shop online. Meet new customers. Keep growing on your terms.</p><span className="auth-aside-flower">✳</span></div><span className="auth-footer-note">LOCAL DEMO · DATA STAYS ON THIS MACHINE</span></section><section className="auth-form-side"><div className="auth-card"><Link href="/" className="back-link"><ArrowLeft size={15} /> Back to marketplace</Link><span className="eyebrow">YOUR SHOP, YOUR SPACE</span><h2>Welcome back.</h2><p>Sign in to your empowerBiz account.</p>{params.error === "credentials" && <p className="notice error-notice">We couldn&apos;t match those details. Try the demo account below.</p>}<form action={loginAction} className="auth-form"><label className="form-field">Email address<input type="email" name="email" autoComplete="username" placeholder="you@example.com" required /></label><label className="form-field">Password<input type="password" name="password" autoComplete="current-password" placeholder="Your password" required /></label><button className="button-primary auth-submit">Sign in <ArrowUpRight size={16} /></button></form><div className="demo-account"><span className="demo-account-icon"><Store size={17} /></span><div><strong>Try the Maua House shop</strong><span>owner@mauahouse.local</span><span>Password: Karibu123!</span></div></div><div className="demo-account admin-account"><span className="demo-account-icon">e.</span><div><strong>Platform admin preview</strong><span>admin@empowerbiz.local</span><span>Password: Karibu123!</span></div></div><p className="auth-create">Shopping with us? <Link href="/register">Create a customer account</Link></p></div></section></main>;
}
