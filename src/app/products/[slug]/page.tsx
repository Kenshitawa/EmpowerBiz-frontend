import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Truck } from "lucide-react";
import { addToCartAction } from "@/app/actions";
import { getProduct, formatKes } from "@/lib/commerce";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  return (
    <main className="page-main product-detail-page">
      <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/marketplace">Marketplace</Link><span>/</span><Link href={"/shops/" + product.tenant_slug}>{product.tenant_name}</Link><span>/</span><span>{product.name}</span></div>
      <div className="product-detail">
        <div className={"detail-art product-image motif-home"} style={{ backgroundColor: product.color }}><span className="detail-art-shape"><span /></span><span className="detail-made">MADE WITH CARE<br />IN KENYA</span></div>
        <div className="detail-info"><Link href={"/shops/" + product.tenant_slug} className="detail-shop">{product.tenant_name} <ArrowUpRight size={14} /></Link><span className="eyebrow">{product.category}</span><h1>{product.name}</h1><div className="detail-price">{formatKes(product.price_kes)}{product.compare_at_kes && <del>{formatKes(product.compare_at_kes)}</del>}</div><p className="detail-description">{product.description}</p><div className="detail-stock"><span><Check size={15} /> In stock</span><span>{product.stock} available</span></div><form action={addToCartAction} className="detail-add-form"><input type="hidden" name="product_id" value={product.id} /><label>Quantity <select name="quantity" defaultValue="1">{Array.from({ length: Math.min(product.stock, 10) }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}</select></label><button className="button-primary">Add to bag <ArrowUpRight size={17} /></button></form><div className="delivery-note"><Truck size={18} /><span><strong>Delivery, made simple.</strong><small>Pay on delivery is available. Delivery fee confirmed by the shop.</small></span></div><Link href="/marketplace" className="back-link"><ArrowLeft size={15} /> Keep looking</Link></div>
      </div>
    </main>
  );
}
