import Link from "next/link";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { checkoutAction } from "@/app/actions";
import { formatKes, listCart } from "@/lib/commerce";
import { getCurrentUser } from "@/lib/local-auth";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function CheckoutPage({ searchParams }: Props) {
  const params = await searchParams;
  const cart = await listCart();
  const user = await getCurrentUser();
  const total = cart.reduce((sum, item) => sum + item.price_kes * item.quantity, 0);
  if (!cart.length) return <main className="page-main empty-cart"><h1>Your bag is empty.</h1><Link className="button-primary" href="/marketplace">Visit the marketplace <ArrowRight size={16} /></Link></main>;
  return (
    <main className="page-main checkout-page">
      <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/cart">Your bag</Link><span>/</span><span>Checkout</span></div>
      <div className="cart-title-row"><div><span className="eyebrow">NEARLY YOURS</span><h1>Checkout<span className="heading-period">.</span></h1></div><span><LockKeyhole size={14} /> Local demo checkout</span></div>
      {params.error && <p className="notice error-notice">Please check your details and make sure your items are still in stock.</p>}
      <div className="checkout-layout"><form action={checkoutAction} className="checkout-form">
        <section className="checkout-section"><span className="step-number">01</span><div><h2>Where should we find you?</h2><p>Your details go directly to the independent shop fulfilling this order.</p></div><div className="form-grid">
          <label className="form-field full-field">Full name<input name="customer_name" autoComplete="name" placeholder="e.g. Wanjiku Kamau" defaultValue={user?.account_type === "customer" ? user.full_name : ""} required minLength={2} maxLength={120} /></label>
          <label className="form-field">Email address<input type="email" name="customer_email" autoComplete="email" placeholder="you@example.com" defaultValue={user?.account_type === "customer" ? user.email : ""} required /></label>
          <label className="form-field">Phone number<input type="tel" name="customer_phone" autoComplete="tel" placeholder="+254 7..." required minLength={9} /></label>
          <label className="form-field full-field">Delivery address<textarea name="delivery_address" autoComplete="street-address" placeholder="Building, street, area and town" required minLength={8} maxLength={500} rows={3} /></label>
        </div></section>
        <section className="checkout-section payment-section"><span className="step-number">02</span><div><h2>How would you like to pay?</h2><p>M-Pesa demo selection does not request payment. Live payments will be connected later.</p></div><label className="payment-option"><input type="radio" name="payment_method" value="cash_on_delivery" defaultChecked /><span><strong>Cash on delivery</strong><small>Pay the shop when your order arrives.</small></span><span className="payment-tag">AVAILABLE</span></label><label className="payment-option disabled-payment"><input type="radio" name="payment_method" value="mpesa_demo" /><span><strong>M-Pesa · demo only</strong><small>Creates a pending order; no STK push is sent.</small></span><span className="payment-tag">PREVIEW</span></label></section>
        <button className="button-primary place-order-button">Place your order <ArrowRight size={17} /></button><Link href="/cart" className="back-link"><ArrowLeft size={15} /> Back to your bag</Link>
      </form><aside className="checkout-summary"><span className="eyebrow">IN YOUR BAG</span>{cart.map((item) => <div className="checkout-line" key={item.id}><div><strong>{item.name}</strong><small>{item.tenant_name} · Qty {item.quantity}</small></div><span>{formatKes(item.price_kes * item.quantity)}</span></div>)}<div className="summary-total"><span>Total</span><strong>{formatKes(total)}</strong></div><p>Orders are grouped by shop. Each business will manage its own delivery and fulfilment.</p></aside></div>
    </main>
  );
}
