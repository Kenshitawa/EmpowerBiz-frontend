"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { BackendApiError, backendPatch, backendPost } from "@/lib/backend-api";

function value(form: FormData, name: string) {
  return String(form.get(name) ?? "").trim();
}

export async function loginAction(form: FormData) {
  const email = z.string().email().safeParse(value(form, "email"));
  const password = z.string().min(1).safeParse(String(form.get("password") ?? ""));
  if (!email.success || !password.success) redirect("/login?error=credentials");
  let accountType: string;
  try {
    const result = await backendPost<{ user: { account_type: string } }>("/api/auth/login", { email: email.data, password: password.data });
    accountType = result.user.account_type;
  } catch {
    redirect("/login?error=credentials");
  }
  redirect(accountType! === "customer" ? "/account/orders" : "/dashboard");
}

export async function registerCustomerAction(form: FormData) {
  const parsed = z.object({ full_name: z.string().min(2).max(120), email: z.string().email().max(254), password: z.string().min(12).max(128) }).safeParse({
    full_name: value(form, "full_name"), email: value(form, "email").toLowerCase(), password: String(form.get("password") ?? ""),
  });
  if (!parsed.success) redirect("/register?error=validation");
  try {
    await backendPost("/api/auth/register", parsed.data);
  } catch (error) {
    redirect(error instanceof BackendApiError && error.code === "exists" ? "/register?error=exists" : "/register?error=validation");
  }
  redirect("/account/orders");
}

export async function logoutAction() {
  await backendPost("/api/auth/logout", {});
  redirect("/");
}

export async function addToCartAction(form: FormData) {
  const productId = z.string().min(1).safeParse(value(form, "product_id"));
  const quantity = z.coerce.number().int().min(1).max(20).safeParse(form.get("quantity") ?? 1);
  if (!productId.success || !quantity.success) redirect("/marketplace?error=product");
  try {
    await backendPost("/api/cart/items", { product_id: productId.data, quantity: quantity.data });
  } catch (error) {
    if (error instanceof BackendApiError && error.code === "stock") redirect("/marketplace?error=stock");
    redirect("/marketplace?error=product");
  }
  revalidatePath("/cart");
  redirect("/cart?added=1");
}

export async function updateCartAction(form: FormData) {
  const productId = value(form, "product_id");
  const quantity = z.coerce.number().int().min(0).max(20).safeParse(form.get("quantity"));
  if (!productId || !quantity.success) redirect("/cart");
  await backendPatch("/api/cart/items/" + encodeURIComponent(productId), { quantity: quantity.data });
  revalidatePath("/cart");
  redirect("/cart");
}

export async function checkoutAction(form: FormData) {
  const parsed = z.object({ customer_name: z.string().min(2).max(120), customer_email: z.string().email().max(254), customer_phone: z.string().min(9).max(20), delivery_address: z.string().min(8).max(500), payment_method: z.enum(["cash_on_delivery", "mpesa_demo"]) }).safeParse({
    customer_name: value(form, "customer_name"), customer_email: value(form, "customer_email"), customer_phone: value(form, "customer_phone"), delivery_address: value(form, "delivery_address"), payment_method: value(form, "payment_method"),
  });
  if (!parsed.success) redirect("/checkout?error=details");
  let orderNumbers: string[];
  try {
    const result = await backendPost<{ orderNumbers: string[] }>("/api/checkout", parsed.data);
    orderNumbers = result.orderNumbers;
  } catch (error) {
    if (error instanceof BackendApiError && error.code === "empty") redirect("/cart?error=empty");
    if (error instanceof BackendApiError && error.code === "stock") redirect("/cart?error=stock");
    redirect("/checkout?error=details");
  }
  revalidatePath("/cart");
  redirect("/order-confirmation?orders=" + encodeURIComponent(orderNumbers!.join(",")));
}

export async function createProductAction(form: FormData) {
  const parsed = z.object({ name: z.string().min(2).max(120), description: z.string().min(8).max(1000), category: z.string().min(2).max(60), price_kes: z.coerce.number().int().min(1).max(10_000_000), stock: z.coerce.number().int().min(0).max(1_000_000) }).safeParse({
    name: value(form, "name"), description: value(form, "description"), category: value(form, "category"), price_kes: form.get("price_kes"), stock: form.get("stock"),
  });
  if (!parsed.success) redirect("/dashboard/products?error=validation");
  try {
    await backendPost("/api/merchant/products", parsed.data);
  } catch {
    redirect("/dashboard/products?error=validation");
  }
  revalidatePath("/dashboard/products");
  revalidatePath("/marketplace");
  redirect("/dashboard/products?created=1");
}

export async function updateOrderStatusAction(form: FormData) {
  const orderId = value(form, "order_id");
  const status = z.enum(["confirmed", "packing", "shipped", "delivered", "cancelled"]).safeParse(value(form, "status"));
  if (!orderId || !status.success) redirect("/dashboard/orders");
  try {
    await backendPatch("/api/merchant/orders/" + encodeURIComponent(orderId) + "/status", { status: status.data });
  } catch {
    redirect("/dashboard/orders?error=transition");
  }
  revalidatePath("/dashboard/orders");
  redirect("/dashboard/orders?updated=1");
}

export type OnboardingState = { error?: string; token?: string; shopName?: string };
export async function createTenantAction(_previous: OnboardingState, form: FormData): Promise<OnboardingState> {
  const parsed = z.object({ name: z.string().min(2).max(100), category: z.string().min(2).max(60), description: z.string().min(8).max(500), owner_name: z.string().min(2).max(120), owner_email: z.string().email().max(254) }).safeParse({
    name: value(form, "name"), category: value(form, "category"), description: value(form, "description"), owner_name: value(form, "owner_name"), owner_email: value(form, "owner_email").toLowerCase(),
  });
  if (!parsed.success) return { error: "Please check each field and try again." };
  try {
    const result = await backendPost<{ token: string; shopName: string }>("/api/platform/tenants", parsed.data);
    revalidatePath("/dashboard");
    return result;
  } catch (error) {
    return { error: error instanceof BackendApiError && error.code === "email_exists" ? "That email already has an account." : "Could not create the shop." };
  }
}

export async function updateTenantStatusAction(form: FormData) {
  const tenantId = value(form, "tenant_id");
  const status = z.enum(["active", "paused"]).safeParse(value(form, "status"));
  if (!tenantId || !status.success) redirect("/dashboard");
  await backendPatch("/api/platform/tenants/" + encodeURIComponent(tenantId) + "/status", { status: status.data });
  revalidatePath("/dashboard");
  redirect("/dashboard?businesses=updated");
}

export type InvitationState = { error?: string; success?: boolean };
export async function acceptOwnerInvitationAction(_previous: InvitationState, form: FormData): Promise<InvitationState> {
  const parsed = z.object({ token: z.string().min(32).max(100), full_name: z.string().min(2).max(120), email: z.string().email().max(254), password: z.string().min(12).max(128) }).safeParse({
    token: value(form, "token"), full_name: value(form, "full_name"), email: value(form, "email").toLowerCase(), password: String(form.get("password") ?? ""),
  });
  if (!parsed.success) return { error: "Check the invitation details and use a password with at least 12 characters." };
  try {
    await backendPost("/api/auth/accept-invitation", parsed.data);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    const message = error instanceof BackendApiError && error.code === "invalid_invite" ? "This invitation is invalid, expired, or for a different email." : "Could not accept this invitation.";
    return { error: message };
  }
}
