import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { TenantOnboardingForm } from "@/components/tenant-onboarding-form";
import { getCurrentUser } from "@/lib/local-auth";

export default async function NewShopPage() {
  const user = await getCurrentUser();
  if (!user?.is_platform_admin) redirect("/dashboard");
  return <div className="dashboard-page"><div className="dashboard-heading"><div><Link href="/dashboard" className="back-link"><ArrowLeft size={15} /> Back to businesses</Link><span className="eyebrow">MAKE ROOM FOR A NEW BUSINESS</span><h1>Welcome a new shop<span className="heading-period">.</span></h1><p>Set up their space and send the owner a private activation link.</p></div></div><div className="dashboard-panel new-product-panel"><TenantOnboardingForm /></div></div>;
}
