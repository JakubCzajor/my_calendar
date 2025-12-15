const { test, expect } = require("@playwright/test");

test.describe("Login Form", () => {
  test("Should load signin form with email and password fields", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/user/signin");

    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
  });

  test("Should have submit button", async ({ page }) => {
    await page.goto("http://localhost:3000/user/signin");

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });
});

test.describe("Login Process", () => {
  test("Should allow access to profile after successful login", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/user/signin");

    await page.fill('input[type="email"]', "my.calendar@interia.com");

    await page.fill('input[type="password"]', "Test123!");

    await page.click('button[type="submit"]');

    await page.waitForTimeout(3000);

    const currentURL = page.url();
    expect(currentURL).not.toContain("/user/signin");
  });
});
