import { describe, expect, it } from "vitest";

const required = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
] as const;

describe("external integration secrets", () => {
  it("can reach Supabase Auth settings with the configured public key", async () => {
    for (const key of required.slice(0, 2)) {
      expect(process.env[key], `${key} is required`).toBeTruthy();
    }

    const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: process.env.SUPABASE_ANON_KEY! },
    });

    expect(response.ok, `Supabase Auth settings failed with ${response.status}`).toBe(true);
  }, 15_000);

  it("can authenticate against Cloudinary resources API", async () => {
    for (const key of required.slice(2)) {
      expect(process.env[key], `${key} is required`).toBeTruthy();
    }

    const credentials = Buffer.from(
      `${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`,
    ).toString("base64");
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image?max_results=1`,
      { headers: { Authorization: `Basic ${credentials}` } },
    );

    expect(response.ok, `Cloudinary resources API failed with ${response.status}`).toBe(true);
  }, 15_000);
});


describe("Cloudinary cloud identity", () => {
  it("responds from the configured nfrqgsks cloud", async () => {
    expect(process.env.CLOUDINARY_CLOUD_NAME).toBe("nfrqgsks");
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/ping`,
    );
    expect(response.status).not.toBe(404);
  }, 15_000);
});


describe("Cloudinary credentials refresh", () => {
  it("authenticates with the refreshed API key and secret", async () => {
    expect(process.env.CLOUDINARY_API_KEY).toBeTruthy();
    expect(process.env.CLOUDINARY_API_SECRET).toBeTruthy();
    const auth = Buffer.from(
      `${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`,
    ).toString("base64");
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image?max_results=1`,
      { headers: { Authorization: `Basic ${auth}` } },
    );
    expect(response.ok, `Cloudinary credentials rejected with ${response.status}`).toBe(true);
  }, 15_000);
});


describe("frontend Supabase configuration", () => {
  it("can reach Supabase Auth using the VITE public variables", async () => {
    expect(process.env.VITE_SUPABASE_URL).toBeTruthy();
    expect(process.env.VITE_SUPABASE_ANON_KEY).toBeTruthy();
    const response = await fetch(`${process.env.VITE_SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: process.env.VITE_SUPABASE_ANON_KEY! },
    });
    expect(response.ok, `VITE Supabase configuration failed with ${response.status}`).toBe(true);
  }, 15_000);
});
