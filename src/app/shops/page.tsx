import Link from "next/link";
import { ArrowUpRight, Store } from "lucide-react";
import { listShops } from "@/lib/commerce";

export default async function ShopsPage() {
  const shops = await listShops();
  return (
    <main className="page-main">
      <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Independent shops</span></div>
      <section className="listing-intro shops-intro"><div><span className="eyebrow">GOOD PEOPLE, GOOD BUSINESS</span><h1>Every shop has<br /><em>a story to tell.</em></h1><p>Meet the independent makers and shopkeepers bringing a little more thought to the things we use every day.</p></div><div className="listing-aside"><Store size={31} strokeWidth={1.2} /><span>Small businesses<br />make a big place.</span></div></section>
      <div className="maker-grid">{shops.map((shop, index) => <Link href={"/shops/" + shop.slug} key={shop.id} className="maker-card" style={{ "--shop-accent": shop.accent_color } as React.CSSProperties}><span className="maker-visual"><span className="maker-stamp">0{index + 1}</span><span className="maker-flower">✳</span><span className="maker-cat">{shop.category}</span></span><span className="maker-content"><small>{shop.product_count} THOUGHTFUL FINDS</small><strong>{shop.name}<ArrowUpRight size={17} /></strong><span>{shop.description}</span></span></Link>)}</div>
    </main>
  );
}
