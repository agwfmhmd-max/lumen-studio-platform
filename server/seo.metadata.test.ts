import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("document metadata", () => {
  it("includes crawler-visible title, description, and Open Graph defaults", () => {
    const html = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
    expect(html).toContain("<title>إنتاج للدعاية والإشهار — Production Advertising</title>");
    expect(html).toContain('name="description"');
    expect(html).toContain('property="og:title"');
    expect(html).toContain('property="og:description"');
  });
});

