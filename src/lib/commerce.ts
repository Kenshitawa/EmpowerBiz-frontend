import "server-only";
import { backendGet } from "@/lib/backend-api";

export type Product = {
  id: string; tenant_id: string; tenant_name: string; tenant_slug: string;
  name: string; slug: string; description: string; category: string;
  price_kes: number; compare_at_kes: number | null; stock: number;
  sku: string; color: string;
};

export type Shop = {
  id: string; name: string; slug: string; description: string;
  category: string; accent_color: string;
};

type ProductFilters = { query?: string; category?: string; sort?: string; shopSlug?: string; minPrice?: string; maxPrice?: string };
type MarketplacePage = { products: Product[]; total: number; page: number; pageSize: number; pageCount: number };

function queryString(options: ProductFilters & { page?: string }) {
  const query = new URLSearchParams();
  if (options.query) query.set("q", options.query);
  if (options.category) query.set("category", options.category);
  if (options.sort) query.set("sort", options.sort);
  if (options.shopSlug) query.set("shop", options.shopSlug);
  if (options.minPrice) query.set("minPrice", options.minPrice);
  if (options.maxPrice) query.set("maxPrice", options.maxPrice);
  if (options.page) query.set("page", options.page);
  return query.size ? "?" + query.toString() : "";
}

export async function listProducts(options: ProductFilters = {}) {
  const result = await backendGet<MarketplacePage>("/api/catalog/products" + queryString(options));
  return result.products;
}

export function listMarketplacePage(options: ProductFilters & { page?: string } = {}) {
  return backendGet<MarketplacePage>("/api/catalog/products" + queryString(options));
}

export async function getProduct(slug: string) {
  try {
    return (await backendGet<{ product: Product }>("/api/catalog/products/" + encodeURIComponent(slug))).product;
  } catch (error) {
    if (error instanceof Error && "status" in error && error.status === 404) return null;
    throw error;
  }
}

export async function listShops() {
  return (await backendGet<{ shops: (Shop & { product_count: number })[] }>("/api/catalog/shops")).shops;
}

export async function getShop(slug: string) {
  try {
    return (await backendGet<{ shop: Shop }>("/api/catalog/shops/" + encodeURIComponent(slug))).shop;
  } catch (error) {
    if (error instanceof Error && "status" in error && error.status === 404) return null;
    throw error;
  }
}

export async function listCart() {
  return (await backendGet<{ items: (Product & { quantity: number })[] }>("/api/cart")).items;
}

export function getCartCount() {
  return backendGet<{ count: number }>("/api/cart/count");
}

export function getOrderConfirmation(orderNumbers: string[]) {
  return backendGet<{ orders: { order_number: string; total_kes: number; status: string; payment_method: string; payment_status: string; tenant_name: string }[] }>(
    "/api/orders/confirmation?orders=" + encodeURIComponent(orderNumbers.join(",")),
  );
}

export function getCustomerOrders() {
  return backendGet<{ orders: { order_number: string; tenant_name: string; total_kes: number; status: string; payment_method: string; payment_status: string; created_at: string }[] }>("/api/customer/orders");
}

export function getMerchantProducts() {
  return backendGet<{ products: { id: string; name: string; sku: string; category: string; price_kes: number; stock: number; published: boolean }[] }>("/api/merchant/products");
}

export function getMerchantOrders() {
  return backendGet<{ orders: { id: string; order_number: string; customer_name: string; customer_email: string; customer_phone: string; delivery_address: string; payment_method: string; payment_status: string; status: string; total_kes: number; created_at: string; items: { product_name: string; quantity: number; unit_price_kes: number }[] }[] }>("/api/merchant/orders");
}

export function getPlatformOverview() {
  return backendGet<{ shopCount: number; productCount: number; orderCount: number; sales: number; shops: { id: string; name: string; slug: string; category: string; status: string; products: number; orders: number }[] }>("/api/platform/overview");
}

export function getMerchantOverview() {
  return backendGet<{ productCount: number; orderCount: number; sales: number; openOrders: number; tenant: { name: string }; latest: { id: string; order_number: string; customer_name: string; total_kes: number; status: string; created_at: string }[] }>("/api/merchant/overview");
}

export function getCartCountValue() {
  return getCartCount().then(({ count }) => count);
}

export function formatKes(amount: number) {
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(amount);
}
