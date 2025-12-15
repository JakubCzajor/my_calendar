const { test, expect } = require("@playwright/test");

test("Has link to signin page", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.getByRole("banner").getByRole("link", { name: "Sign In" }).click();

  expect(page).toHaveURL("http://localhost:3000/user/signin");

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
});

test("Has link to register page", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page
    .getByRole("banner")
    .getByRole("link", { name: "Register" })
    .click();

  expect(page).toHaveURL("http://localhost:3000/user/register");

  await expect(page.getByRole("heading", { name: "Register" })).toBeVisible();
});
