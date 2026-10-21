export const brandConfig = Object.freeze({
  name: process.env.NEXT_PUBLIC_BRAND_NAME ?? "empowerBiz",
  rootDomain: process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "example.com",
  marketplaceHost:
    process.env.NEXT_PUBLIC_MARKETPLACE_HOST ?? "marketplace.example.com",
});
