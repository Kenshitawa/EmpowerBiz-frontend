import Link from "next/link";
import { BarChart3, Boxes, LayoutDashboard, PackageCheck, Settings2, Store } from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/local-auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.is_platform_admin && user.tenant_status !== "active") {
    return <main className="paused-page"><span className="eyebrow">SHOP STATUS</span><h1>Your shop is taking a pause.</h1><p>This shop is currently paused. Please contact the empowerBiz platform team if you think this is a mistake.</p><Link href="/">Return to the marketplace</Link></main>;
  }
  return <main className="dashboard-shell"><aside className="dashboard-sidebar"><Link href="/" className="wordmark dashboard-brand"><span className="brand-mark">e<span>.</span></span><span>empower<span className="wordmark-light">Biz</span></span></Link><span className="dashboard-nav-label">{user.is_platform_admin ? "PLATFORM" : "YOUR SHOP"}</span><nav className="dashboard-nav"><Link href="/dashboard"><LayoutDashboard size={17} /> Overview</Link>{!user.is_platform_admin && <><Link href="/dashboard/products"><Boxes size={17} /> Products</Link><Link href="/dashboard/orders"><PackageCheck size={17} /> Orders</Link></>}{user.is_platform_admin && <Link href="/dashboard"><Store size={17} /> Businesses</Link>}<Link href="/" className="dashboard-view-store"><BarChart3 size={17} /> View marketplace</Link></nav><div className="dashboard-side-bottom"><span className="user-avatar">{user.full_name.slice(0, 1)}</span><span><strong>{user.full_name}</strong><small>{user.is_platform_admin ? "Platform administrator" : user.email}</small></span><Settings2 size={16} /></div></aside><section className="dashboard-content"><div className="dashboard-topbar"><span><span className="dashboard-live-dot" /> Local workspace</span><span>Kenya <i>·</i> KES</span></div>{children}</section></main>;
}
