const { test, expect } = require("@playwright/test");

test.describe("Register Form", () => {
  test("Should load register form with required fields", async ({ page }) => {
    await page.goto("http://localhost:3000/user/register");

    await expect(page.getByRole("heading", { name: "Register" })).toBeVisible();

    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();

    await expect(
      page.getByRole("textbox", { name: "Password", exact: true })
    ).toBeVisible();

    await expect(
      page.getByRole("textbox", { name: "Confirm Password" })
    ).toBeVisible();
  });

  test("Should have register submit button", async ({ page }) => {
    await page.goto("http://localhost:3000/user/register");

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test("Should require email field", async ({ page }) => {
    await page.goto("http://localhost:3000/user/register");

    await page.click('button[type="submit"]');

    await page.waitForTimeout(1000);

    expect(page.url()).toContain("/user/register");
  });

  test("Should require password field", async ({ page }) => {
    await page.goto("http://localhost:3000/user/register");

    await page.fill('input[type="email"]', "test@example.com");

    await page.click('button[type="submit"]');

    await page.waitForTimeout(1000);

    expect(page.url()).toContain("/user/register");
  });
});
