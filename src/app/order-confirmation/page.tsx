import Link from "next/link";
import { Check, PackageCheck, ArrowRight } from "lucide-react";
import { formatKes, getOrderConfirmation } from "@/lib/commerce";

type Props = { searchParams: Promise<{ orders?: string }> };

export default async function ConfirmationPage({ searchParams }: Props) {
  const orderNumbers = (await searchParams).orders?.split(",").filter((value) => /^EB-[A-Z0-9-]+$/.test(value)).slice(0, 10) ?? [];
  const { orders } = await getOrderConfirmation(orderNumbers);
  return <main className="page-main confirmation-page"><div className="confirmation-check"><Check size={29} /></div><span className="eyebrow">THAT&apos;S A GOOD FEELING</span><h1>Your order is in<span className="heading-period">.</span></h1><p>Thank you for choosing to shop small. Each shop has its own order to prepare, and will be in touch about delivery.</p>{orders.length ? <div className="confirmation-orders">{orders.map((order) => <div className="confirmation-order" key={order.order_number}><span><PackageCheck size={17} /></span><div><strong>{order.tenant_name}</strong><small>{order.order_number} · {order.status} · {order.payment_method === "cash_on_delivery" ? "Cash on delivery" : "M-Pesa demo · pending"}</small></div><b>{formatKes(order.total_kes)}</b></div>)}</div> : <div className="notice">Your order details have been saved in the local demo database.</div>}<Link className="button-primary" href="/marketplace">Back to the marketplace <ArrowRight size={16} /></Link></main>;
}
