import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getShop, listProducts } from "@/lib/commerce";
import { ProductCard } from "@/components/product-card";

type Props = { params: Promise<{ slug: string }> };

export default async function ShopPage({ params }: Props) {
  const { slug } = await params;
  const shop = await getShop(slug);
  if (!shop) notFound();
  const products = await listProducts({ shopSlug: slug });
  return (
    <main className="page-main">
      <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/shops">Shops</Link><span>/</span><span>{shop.name}</span></div>
      <section className="shop-hero" style={{ "--shop-accent": shop.accent_color } as React.CSSProperties}><span className="shop-hero-orbit"><span /></span><div><span className="eyebrow">{shop.category} · INDEPENDENT SHOP</span><h1>{shop.name}<span className="heading-period">.</span></h1><p>{shop.description}</p><span className="shop-promise"><i>✳</i> Thoughtfully made, locally loved.</span></div><span className="shop-hero-side">A LITTLE MORE<br />THOUGHT IN<br />EVERYDAY THINGS</span></section>
      <div className="section-heading shop-products-heading"><div><span className="eyebrow">FROM THIS SHOP</span><h2>Things to take home<span className="heading-period">.</span></h2></div><span className="section-link">{products.length} finds <ArrowUpRight size={15} /></span></div>
      <div className="product-grid listing-grid">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
    </main>
  );
}
