const { test, expect } = require("@playwright/test");

test("Should redirect unauthenticated user to signin when accessing profile", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/user/profile");

  await expect(page).toHaveURL("http://localhost:3000/user/signin");
});

test("Should redirect unauthenticated user to signin when accessing calendar", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/calendar");

  await expect(page).toHaveURL("http://localhost:3000/user/signin");
});

test("Should redirect unauthenticated user to signin when accessing changepassword", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/user/changepassword");

  await expect(page).toHaveURL("http://localhost:3000/user/signin");
});
