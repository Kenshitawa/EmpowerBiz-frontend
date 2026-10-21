import Link from "next/link";
import { ArrowUpRight, CirclePlus, PackageOpen } from "lucide-react";
import { getCurrentUser } from "@/lib/local-auth";
import { formatKes, getMerchantProducts } from "@/lib/commerce";

export default async function ProductsPage() {
  const user = await getCurrentUser();
  if (!user?.tenant_id || user.tenant_status !== "active" || !["owner", "manager"].includes(user.role ?? "")) return null;
  const { products } = await getMerchantProducts();
  return <div className="dashboard-page"><div className="dashboard-heading"><div><span className="eyebrow">YOUR CATALOGUE</span><h1>Good things for sale<span className="heading-period">.</span></h1><p>Keep your products, prices and stock up to date.</p></div><Link className="dashboard-primary" href="/dashboard/products/new"><CirclePlus size={17} /> Add a product</Link></div><div className="dashboard-panel"><div className="panel-heading"><div><span className="eyebrow">YOUR SHOP SHELF</span><h2>Products</h2></div><span className="panel-count">{products.length} listed</span></div>{products.length ? <div className="business-table"><div className="business-row product-head"><span>PRODUCT</span><span>CATEGORY</span><span>PRICE</span><span>STOCK</span><span>STATUS</span></div>{products.map((product, i) => <div className="business-row product-row" key={product.id}><span className="business-name"><i className={"business-avatar business-avatar-" + i}>✳</i><strong>{product.name}</strong><small>{product.sku}</small></span><span>{product.category}</span><strong>{formatKes(product.price_kes)}</strong><span>{product.stock} units</span><span className={product.published ? "status-pill" : "status-pill status-paused"}><i />{product.published ? "published" : "draft"}</span></div>)}</div> : <div className="dashboard-empty"><PackageOpen size={22} /><strong>Your shelf is waiting for its first product.</strong><span>Add a product to start building your catalogue.</span><Link href="/dashboard/products/new">Add your first product <ArrowUpRight size={15} /></Link></div>}</div></div>;
}
