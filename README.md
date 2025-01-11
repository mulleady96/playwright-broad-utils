# Playwright Broad Utils - Setup Guide

This guide walks you through setting up Playwright in your project and using the `playwright-broad-utils` package for broad testing.

---

## Prerequisites

- Node.js (v16 or higher recommended).
- Basic understanding of Playwright and web testing.

---

## Step 1: Install Playwright

To use Playwright, first install it in your project:

```bash
npm install -D @playwright/test
```

---

## Step 2: Install Playwright Utils

Install the `playwright-broad-utils` package:

```bash
npm install -D playwright-broad-utils
```

---

## Step 3: Configure Playwright

If you haven’t already, set up a Playwright configuration file. Create `playwright.config.ts`:

```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://localhost:4200",
    headless: true,
  },
});
```

---

## Step 4: Create a Test File

Write your tests in the `tests` directory. Here's an example using `playwright-broad-utils`:

```typescript
import { test } from "@playwright/test";
import {
  checkButtonsVisibilityAndAriaLabel,
  checkHeadingsVisibility,
  checkImagesVisibility,
} from "playwright-broad-utils";

test("@Home", async ({ page }) => {
  await page.goto("/home");

  await checkButtonsVisibilityAndAriaLabel(page);
  await checkHeadingsVisibility(page);
  await checkImagesVisibility(page);
});
```

---

## Step 5: Run Your Tests

Run your Playwright tests with:

```bash
npx playwright test
```

---

## Utility Function Details

### `checkButtonsVisibilityAndAriaLabel(page: Page)`

Checks if all buttons are visible and have an `aria-label` attribute.

### `checkHeadingsVisibility(page: Page)`

Ensures all headings (`<h1>` to `<h6>`) are visible on the page.

### `checkImagesVisibility(page: Page)`

Verifies all images are visible and checks for `alt` attributes for accessibility.

---

## Troubleshooting

### Multiple Versions of Playwright

Ensure `playwright-broad-utils` uses the same version of Playwright as your project. To check:

```bash
npm ls @playwright/test
```

If there are multiple versions, deduplicate:

```bash
npm dedupe
```

### Test Directory Configuration

Ensure your test files are in the directory specified in `playwright.config.ts` (`testDir`).

### TypeScript Paths

If you encounter module resolution errors, update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@playwright/test": ["./node_modules/@playwright/test"]
    }
  }
}
```

---

## Additional Notes

- This package relies on Playwright's peer dependencies. Ensure `@playwright/test` is installed in your project.
- Restart your development environment if TypeScript errors persist after installation.
