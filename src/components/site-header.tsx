import Link from "next/link";
import { ArrowUpRight, Search, ShoppingBag, Store } from "lucide-react";
import { getCurrentUser } from "@/lib/local-auth";
import { getCartCountValue } from "@/lib/commerce";
import { logoutAction } from "@/app/actions";

export async function SiteHeader() {
  const user = await getCurrentUser();
  const count = await getCartCountValue();
  return <header className="site-header"><div className="header-inner"><Link href="/" className="wordmark" aria-label="empowerBiz home"><span className="brand-mark">e<span>.</span></span><span>empower<span className="wordmark-light">Biz</span></span></Link><nav className="main-nav" aria-label="Main navigation"><Link href="/marketplace">Marketplace</Link><Link href="/shops">Discover shops</Link>{user?.account_type === "customer" ? <Link href="/account/orders">My orders</Link> : user ? <Link href="/dashboard">My workspace</Link> : <Link href="/login">For sellers</Link>}</nav><div className="header-actions"><Link href="/marketplace" className="icon-link search-link" aria-label="Search products"><Search size={19} /></Link><Link href="/cart" className="cart-link"><ShoppingBag size={18} /><span>Bag</span><span className="cart-count">{count}</span></Link>{user ? <form action={logoutAction} className="header-user"><span className="user-initial">{user.full_name.slice(0, 1)}</span><button type="submit" className="text-button">Sign out</button></form> : <Link href="/login" className="account-link">Sign in <ArrowUpRight size={15} /></Link>}</div></div></header>;
}

export function Footer() {
  return <footer className="site-footer"><div className="footer-inner"><div><Link href="/" className="wordmark footer-wordmark"><span className="brand-mark">e<span>.</span></span><span>empower<span className="wordmark-light">Biz</span></span></Link><p>Good businesses grow better together.</p></div><div className="footer-links"><Link href="/marketplace">Shop the marketplace</Link><Link href="/shops">Independent shops</Link><Link href="/login"><Store size={15} /> Open your shop</Link></div><span className="footer-location">Made for Kenya <span>·</span> Prices in KES</span></div><div className="footer-bottom"><span>© 2026 empowerBiz</span><span>Small businesses, more possibility.</span></div></footer>;
}
