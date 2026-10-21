import Link from "next/link";
import { ArrowRight, PackageCheck, ShoppingBag } from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/local-auth";
import { formatKes, getCustomerOrders } from "@/lib/commerce";

export default async function CustomerOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.account_type !== "customer") redirect("/dashboard");
  const { orders } = await getCustomerOrders();
  return <main className="page-main account-orders-page"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Your orders</span></div><div className="cart-title-row"><div><span className="eyebrow">YOUR SHOPPING, ALL IN ONE PLACE</span><h1>Your orders<span className="heading-period">.</span></h1></div><span>{orders.length} orders</span></div>{orders.length ? <div className="confirmation-orders">{orders.map((order) => <article className="confirmation-order" key={order.order_number}><span><PackageCheck size={17} /></span><div><strong>{order.tenant_name}</strong><small>{order.order_number} · {order.status} · {order.payment_method === "cash_on_delivery" ? "Cash on delivery" : "M-Pesa demo · pending"}</small><small>{new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Nairobi" }).format(new Date(order.created_at))}</small></div><b>{formatKes(order.total_kes)}</b></article>)}</div> : <div className="empty-cart"><span><ShoppingBag size={30} /></span><h2>Your first good find is still out there.</h2><p>When you place an order, you can follow each shop&apos;s fulfilment here.</p><Link className="button-primary" href="/marketplace">Explore the marketplace <ArrowRight size={16} /></Link></div>}</main>;
}
