import { expect, test } from "@playwright/test";

test("shopper places a cash-on-delivery order and the shop advances fulfilment", async ({ page }) => {
  await page.goto("/products/woven-market-basket");
  await expect(page.getByRole("heading", { name: "Woven Market Basket" })).toBeVisible();
  await page.getByRole("button", { name: /Add to bag/ }).click();
  await expect(page).toHaveURL(/\/cart\?added=1/);
  await expect(page.getByText("Added to your bag. Good choice.")).toBeVisible();
  await page.getByRole("link", { name: /Continue to checkout/ }).click();

  await page.getByLabel("Full name").fill("Test Customer");
  await page.getByLabel("Email address").fill("test.customer@example.local");
  await page.getByLabel("Phone number").fill("+254700123456");
  await page.getByLabel("Delivery address").fill("Test Lane, Westlands, Nairobi");
  await page.getByRole("button", { name: /Place your order/ }).click();
  await expect(page).toHaveURL(/\/order-confirmation\?orders=/);
  await expect(page.getByRole("heading", { name: /Your order is in/ })).toBeVisible();
  await expect(page.locator(".confirmation-order small")).toContainText("Cash on delivery");
  const placedOrder = (await page.locator(".confirmation-order small").first().innerText()).split(" · ")[0];

  await page.goto("/login");
  await page.getByLabel("Email address").fill("owner@mauahouse.local");
  await page.getByLabel("Password").fill("Karibu123!");
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page).toHaveURL("/dashboard");
  await page.getByRole("link", { name: /Orders/ }).click();
  const testOrder = page.locator(".seller-order").filter({ hasText: placedOrder }).first();
  await expect(testOrder).toBeVisible();
  await testOrder.getByRole("button", { name: /Update/ }).click();
  await expect(page.locator(".seller-order").filter({ hasText: placedOrder }).getByText("confirmed", { exact: true })).toBeVisible();
});

test("merchant cannot open the platform console without signing in", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});

test("customer accounts can register, place an order and see only their own order history", async ({ page, browser }) => {
  const suffix = Math.random().toString(36).slice(2, 9);
  const email = "shopper-" + suffix + "@example.local";
  await page.goto("/register");
  await page.getByLabel("Full name").fill("Local Shopper");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill("LocalShopperPass!2026");
  await page.getByRole("button", { name: /Create my account/ }).click();
  await expect(page).toHaveURL("/account/orders");
  await expect(page.getByText("Your first good find is still out there.")).toBeVisible();

  await page.goto("/products/woven-market-basket");
  await page.getByRole("button", { name: /Add to bag/ }).click();
  await page.getByRole("link", { name: /Continue to checkout/ }).click();
  await expect(page.getByLabel("Full name")).toHaveValue("Local Shopper");
  await expect(page.getByLabel("Email address")).toHaveValue(email);
  await page.getByLabel("Phone number").fill("+254700112233");
  await page.getByLabel("Delivery address").fill("Customer Road, Kilimani, Nairobi");
  await page.getByRole("button", { name: /Place your order/ }).click();
  await expect(page).toHaveURL(/\/order-confirmation\?orders=/);
  const orderNumber = (await page.locator(".confirmation-order small").first().innerText()).split(" · ")[0];
  await page.getByRole("link", { name: /My orders/ }).click();
  await expect(page.locator(".confirmation-order").filter({ hasText: orderNumber })).toBeVisible();

  const otherContext = await browser.newContext();
  const otherCustomer = await otherContext.newPage();
  await otherCustomer.goto("/register");
  await otherCustomer.getByLabel("Full name").fill("Another Shopper");
  await otherCustomer.getByLabel("Email address").fill("another-" + suffix + "@example.local");
  await otherCustomer.getByLabel("Password").fill("AnotherShopperPass!2026");
  await otherCustomer.getByRole("button", { name: /Create my account/ }).click();
  await expect(otherCustomer.getByText("Your first good find is still out there.")).toBeVisible();
  await expect(otherCustomer.getByText(orderNumber)).toHaveCount(0);
  await otherContext.close();
});

test("marketplace filters by price and category and paginates results", async ({ page }) => {
  await page.goto("/marketplace?category=Food%20%26%20pantry&minPrice=700&maxPrice=800");
  await expect(page.getByText("1 finds to explore")).toBeVisible();
  await expect(page.getByRole("link", { name: "Kericho Highland Tea" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Cocoa & Coconut Granola" })).toHaveCount(0);
  await page.goto("/marketplace");
  await expect(page.locator(".pagination")).toBeVisible();
  await page.locator(".pagination").getByRole("link", { name: /Next/ }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.locator(".pagination")).toContainText("Page 2 of 2");
});

test("platform admin creates a shop, invites its owner, and keeps shop data isolated", async ({ page, context, browser }) => {
  test.setTimeout(120_000);
  const otherShopContext = await browser.newContext();
  const otherShop = await otherShopContext.newPage();
  await otherShop.goto("http://127.0.0.1:3000/products/woven-market-basket");
  await otherShop.getByRole("button", { name: /Add to bag/ }).click();
  await otherShop.getByRole("link", { name: /Continue to checkout/ }).click();
  await otherShop.getByLabel("Full name").fill("Other Shop Customer");
  await otherShop.getByLabel("Email address").fill("other.shop@example.local");
  await otherShop.getByLabel("Phone number").fill("+254700111222");
  await otherShop.getByLabel("Delivery address").fill("Second Street, Lavington, Nairobi");
  await otherShop.getByRole("button", { name: /Place your order/ }).click();
  await otherShopContext.close();

  await page.goto("/login");
  await page.getByLabel("Email address").fill("admin@empowerbiz.local");
  await page.getByLabel("Password").fill("Karibu123!");
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page).toHaveURL("/dashboard");
  await page.goto("/dashboard/shops/new");

  const suffix = Math.random().toString(36).slice(2, 8);
  const email = "owner-" + suffix + "@example.local";
  const shopName = "Local Test Shop " + suffix;
  await page.getByLabel("Shop name").fill(shopName);
  await page.getByLabel("Business category").selectOption("Art & craft");
  await page.getByLabel("A little about the shop").fill("A small demo shop for testing owner setup.");
  await page.getByLabel("Owner name").fill("Demo Owner");
  await page.getByLabel("Owner email").fill(email);
  await page.getByRole("button", { name: /Create shop/ }).click();
  await expect(page.getByRole("heading", { name: shopName + " has a home." })).toBeVisible();

  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: /Copy owner invite link/ }).click();
  const invitationLink = await page.evaluate(() => navigator.clipboard.readText());
  expect(invitationLink).toContain("/invite#");
  await page.goto(invitationLink);
  await page.getByLabel("Your name").fill("Demo Owner");
  await page.getByLabel("Invited email").fill(email);
  await page.getByLabel("Create a password").fill("LocalOwnerPass!2026");
  await page.getByRole("button", { name: /Activate owner account/ }).click();
  await expect(page.getByRole("heading", { name: "Your account is ready." })).toBeVisible();

  await page.reload();
  await page.getByLabel("Your name").fill("Demo Owner");
  await page.getByLabel("Invited email").fill(email);
  await page.getByLabel("Create a password").fill("LocalOwnerPass!2026");
  await page.getByRole("button", { name: /Activate owner account/ }).click();
  await expect(page.getByText(/invalid, expired, or for a different email/i)).toBeVisible();

  await page.getByRole("button", { name: /Sign out/ }).click();
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill("LocalOwnerPass!2026");
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page).toHaveURL("/dashboard");
  await expect(page.getByText(shopName + " is ready for another good day.")).toBeVisible();

  await page.goto("/dashboard/products/new");
  const productName = "Local Owner Find " + suffix;
  await page.getByLabel("Product name").fill(productName);
  await page.getByLabel("Category").selectOption("Other");
  await page.getByLabel("Price in KES").fill("1750");
  await page.getByLabel("Stock on hand").fill("3");
  await page.getByLabel("Tell us about it").fill("A test item owned only by this new independent shop.");
  await page.getByRole("button", { name: /Save product/ }).click();
  await expect(page.getByText(productName)).toBeVisible();
  await page.goto("/marketplace?q=" + encodeURIComponent(productName));
  await page.getByRole("link", { name: productName }).click();
  await page.getByRole("button", { name: /Add to bag/ }).click();
  await page.getByRole("link", { name: /Continue to checkout/ }).click();
  await page.getByLabel("Full name").fill("Isolated Customer");
  await page.getByLabel("Email address").fill("isolated@example.local");
  await page.getByLabel("Phone number").fill("+254700987654");
  await page.getByLabel("Delivery address").fill("Sample Street, Kilimani, Nairobi");
  await page.getByRole("button", { name: /Place your order/ }).click();
  await page.goto("/dashboard/orders");
  await expect(page.getByText("Isolated Customer")).toBeVisible();
  await expect(page.getByText("Other Shop Customer")).toHaveCount(0);

  await page.getByRole("button", { name: /Sign out/ }).click();
  await page.goto("/login");
  await page.getByLabel("Email address").fill("admin@empowerbiz.local");
  await page.getByLabel("Password").fill("Karibu123!");
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page).toHaveURL("/dashboard");
  const shopRow = page.locator(".business-row").filter({ hasText: shopName });
  await shopRow.getByRole("button", { name: "Pause" }).click();
  await expect(shopRow.getByText("paused")).toBeVisible();

  await page.getByRole("button", { name: /Sign out/ }).click();
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill("LocalOwnerPass!2026");
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page.getByRole("heading", { name: /Your shop is taking a pause/ })).toBeVisible();
});
