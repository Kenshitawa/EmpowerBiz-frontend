import "server-only";
import { backendGet, backendPost } from "@/lib/backend-api";

export type LocalUser = {
  id: string;
  email: string;
  full_name: string;
  is_platform_admin: boolean;
  account_type: "merchant" | "customer" | "platform_admin";
  tenant_id: string | null;
  role: string | null;
  tenant_status: string | null;
};

export async function getCurrentUser() {
  const result = await backendGet<{ user: LocalUser | null }>("/api/auth/me");
  return result.user;
}

export async function signIn(email: string, password: string) {
  const result = await backendPost<{ user: LocalUser }>("/api/auth/login", { email, password });
  return result.user;
}

export async function createCustomerAccount(input: { email: string; fullName: string; password: string }) {
  return backendPost<{ user: LocalUser }>("/api/auth/register", {
    email: input.email,
    full_name: input.fullName,
    password: input.password,
  });
}

export async function signOut() {
  await backendPost<{ ok: true }>("/api/auth/logout", {});
}
