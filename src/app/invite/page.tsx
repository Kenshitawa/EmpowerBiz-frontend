import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OwnerInvitationForm } from "@/components/owner-invitation-form";

export default function InvitePage() {
  return <main className="auth-page"><section className="auth-aside"><Link href="/" className="wordmark"><span className="brand-mark">e<span>.</span></span><span>empower<span className="wordmark-light">Biz</span></span></Link><div><span className="eyebrow">YOUR BUSINESS, YOUR NEXT CHAPTER</span><h1>Make it yours.<br /><em>Make it grow.</em></h1><p>Your shop is ready. Activate your account and start shaping the way customers will find you.</p><span className="auth-aside-flower">✳</span></div><span className="auth-footer-note">LOCAL PREVIEW · INVITATION EXPIRES AFTER SEVEN DAYS</span></section><section className="auth-form-side"><div className="auth-card"><Link href="/" className="back-link"><ArrowLeft size={15} /> Back to marketplace</Link><span className="eyebrow">AN INVITATION TO YOUR NEW SHOP</span><h2>Make yourself at home.</h2><OwnerInvitationForm /></div></section></main>;
}
