import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { updateCartAction } from "@/app/actions";
import { formatKes, listCart } from "@/lib/commerce";

type Props = { searchParams: Promise<{ added?: string; error?: string }> };

export default async function CartPage({ searchParams }: Props) {
  const params = await searchParams;
  const cart = await listCart();
  const total = cart.reduce((sum, item) => sum + item.price_kes * item.quantity, 0);
  return (
    <main className="page-main cart-page">
      <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Your bag</span></div>
      <div className="cart-title-row"><div><span className="eyebrow">A LITTLE SOMETHING FOR YOU</span><h1>Your bag<span className="heading-period">.</span></h1></div><span>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span></div>
      {params.added && <p className="notice success-notice">Added to your bag. Good choice.</p>}
      {params.error === "stock" && <p className="notice error-notice">One or more items no longer have enough stock. Please update your bag.</p>}
      {params.error === "empty" && <p className="notice error-notice">Add a few good finds before checking out.</p>}
      {!cart.length ? <div className="empty-cart"><span><ShoppingBag size={30} /></span><h2>Your bag is taking a little break.</h2><p>There are plenty of good things waiting in the marketplace.</p><Link className="button-primary" href="/marketplace">Find something lovely <ArrowRight size={16} /></Link></div> : (
        <div className="cart-layout"><div className="cart-items">{cart.map((item) => <article key={item.id} className="cart-item"><Link className={"cart-thumb product-image motif-home"} style={{ backgroundColor: item.color }} href={"/products/" + item.slug}><span className="product-art"><span /></span></Link><div className="cart-item-info"><Link href={"/products/" + item.slug} className="cart-item-name">{item.name}</Link><Link href={"/shops/" + item.tenant_slug} className="cart-item-shop">{item.tenant_name}</Link><span className="cart-item-unit">{formatKes(item.price_kes)} each</span></div><div className="cart-item-end"><strong>{formatKes(item.price_kes * item.quantity)}</strong><form action={updateCartAction} className="quantity-controls"><input type="hidden" name="product_id" value={item.id} /><button name="quantity" value={Math.max(0, item.quantity - 1)} aria-label="Decrease quantity">{item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}</button><span>{item.quantity}</span><button name="quantity" value={Math.min(item.stock, item.quantity + 1)} aria-label="Increase quantity" disabled={item.quantity >= item.stock}><Plus size={14} /></button></form></div></article>)}</div>
          <aside className="order-summary"><span className="eyebrow">YOUR TOTAL</span><div className="summary-row"><span>Subtotal</span><strong>{formatKes(total)}</strong></div><div className="summary-row"><span>Delivery</span><span>Confirmed by shop</span></div><div className="summary-total"><span>Total</span><strong>{formatKes(total)}</strong></div><Link className="button-primary summary-checkout" href="/checkout">Continue to checkout <ArrowRight size={17} /></Link><p>Each shop packs and delivers its own orders. Your delivery details are confirmed at checkout.</p><Link href="/marketplace" className="continue-shopping">Continue looking</Link></aside></div>
      )}
    </main>
  );
}
