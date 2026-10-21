import { expect, test } from "@playwright/test";

test("renders the empowerBiz marketplace landing page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/empowerBiz/);
  await expect(page.getByRole("heading", { name: /Small shops.*Big possibility/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Explore the marketplace/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Meet the shopkeepers/ })).toBeVisible();
});
