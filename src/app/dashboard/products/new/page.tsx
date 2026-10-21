import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { redirect } from "next/navigation";
import { createProductAction } from "@/app/actions";
import { getCurrentUser } from "@/lib/local-auth";

export default async function NewProductPage() {
  const user = await getCurrentUser();
  if (!user?.tenant_id || !["owner", "manager"].includes(user.role ?? "")) redirect("/dashboard");
  return <div className="dashboard-page"><div className="dashboard-heading"><div><Link href="/dashboard/products" className="back-link"><ArrowLeft size={15} /> Back to products</Link><span className="eyebrow">A NEW GOOD THING</span><h1>Add to your shelf<span className="heading-period">.</span></h1><p>Give your customers something lovely to find.</p></div></div><div className="dashboard-panel new-product-panel"><form action={createProductAction} className="product-editor"><label className="form-field">Product name<input name="name" placeholder="e.g. Handwoven market basket" minLength={2} maxLength={120} required /></label><label className="form-field">Category<select name="category" required><option value="">Choose a category</option><option>Home & living</option><option>Fashion</option><option>Food & pantry</option><option>Beauty & wellness</option><option>Art & craft</option><option>Other</option></select></label><label className="form-field">Price in KES<input type="number" name="price_kes" min="1" step="1" placeholder="1850" required /></label><label className="form-field">Stock on hand<input type="number" name="stock" min="0" step="1" placeholder="12" required /></label><label className="form-field full-field">Tell us about it<textarea name="description" rows={5} minLength={8} maxLength={1000} placeholder="What makes this product special?" required /></label><div className="product-editor-actions"><Link href="/dashboard/products" className="continue-shopping">Cancel</Link><button className="button-primary">Save product <ArrowUpRight size={16} /></button></div></form></div></div>;
}
