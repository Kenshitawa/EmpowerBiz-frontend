import { describe, expect, it } from "vitest";
import { brandConfig } from "./brand";

describe("brand configuration", () => {
  it("uses the configured name or the empowerBiz default", () => {
    expect(brandConfig.name).toBe(
      process.env.NEXT_PUBLIC_BRAND_NAME ?? "empowerBiz",
    );
  });

  it("provides domain context for routing", () => {
    expect(brandConfig.rootDomain.length).toBeGreaterThan(0);
    expect(brandConfig.marketplaceHost.length).toBeGreaterThan(0);
  });
});
