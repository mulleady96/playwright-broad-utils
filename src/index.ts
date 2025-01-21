import { Locator, Page, WebSocket } from "@playwright/test";

export async function checkHeadingsVisibility(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  const headings: Locator = page.getByRole("heading");

  // Get the total count of headers [h1, h2, h3, h4, h5, h6] on the page
  const headingCount = await headings.count();
  console.log(`Found ${headingCount} headings(s) on the page.`);

  for (let i = 0; i < headingCount; i++) {
    const header = headings.nth(i);

    const isVisible =
      (await header.isVisible()) && (await header.textContent()) !== "";
    if (!isVisible) {
      throw new Error(`Heading at index ${i} is not visible.`);
    }
  }

  console.log(`All ${headingCount} headings are visible.`);
}

export async function checkButtonsVisibilityAndAriaLabel(
  page: Page
): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  const buttons: Locator = page.getByRole("button");

  // Get the total count of buttons
  const buttonCount = await buttons.count();
  console.log(`Found ${buttonCount} button(s) on the page.`);

  for (let i = 0; i < buttonCount; i++) {
    const button = buttons.nth(i);

    const isVisible = await button.isVisible();
    if (!isVisible) {
      throw new Error(`Button at index ${i} is not visible.`);
    }

    const ariaLabel = await button.getAttribute("aria-label");
    if (!ariaLabel) {
      throw new Error(`Button at index ${i} does not have an aria-label.`);
    }
  }

  console.log(`All ${buttonCount} buttons are visible and have an aria-label.`);
}

export async function checkImagesVisibility(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  const images: Locator = page.getByRole("img");

  // Get the total count of img elements on the page
  const imageCount = await images.count();
  console.log(`Found ${imageCount} image(s) on the page.`);

  for (let i = 0; i < imageCount; i++) {
    const image = images.nth(i);

    const isVisible = await image.isVisible();
    if (!isVisible) {
      throw new Error(`Image at index ${i} is not visible.`);
    }

    const hasAlt = await image.getAttribute("alt");
    if (!hasAlt) {
      throw new Error(`Image at index ${i} has no alt text.`);
    }
  }

  console.log(`All ${imageCount} images are visible.`);
}

export async function checkAllExternalLinks(page: Page) {
  await page.waitForLoadState("domcontentloaded");

  const links = page.getByRole("link");
  const linkCount = await links.count();
  let externalLinks = 0;

  for (let i = 0; i < linkCount; i++) {
    const link = links.nth(i);
    const href = await link.getAttribute("href");
    const target = await link.getAttribute("target");

    if (target === "_blank" && href && href.startsWith("http")) {
      try {
        const newPagePromise = page.waitForEvent("popup");
        await link.click();
        const newPage = await newPagePromise;

        await newPage.waitForLoadState("load", { timeout: 10000 });
        const url = newPage.url();

        const response = await newPage.request.get(url);
        const statusCode = response.status();

        if (statusCode !== 200) {
          throw new Error(
            `External link failed with status code: ${statusCode}`
          );
        }
        await newPage.close();

        externalLinks++;
      } catch (error) {
        throw new Error(`Failed to open external link at index ${i}: ${href}`);
      }
    } else {
      console.log(
        `Link at index ${i} is not an external link or does not open in a new tab.`
      );
    }
  }
  console.log(`Total external links checked: ${externalLinks}`);
}

type WebSocketMessage = { type: "sent" | "received"; message: string };

/**
 * You can filter to catch all WS messages on a domain(/localhost/) or only those matching a specific URL:PORT i.e. /localhost:4201/.
 * @param page
 * @param options
 * @returns Array of WebSocket messages sent and received
 */
export async function captureWebSocketMessages(
  page: Page,
  options: { urlFilter?: string | RegExp; timeout?: number } = {}
): Promise<WebSocketMessage[]> {
  const { urlFilter, timeout = 5000 } = options;
  const wsMessages: WebSocketMessage[] = [];

  // Listen for WebSocket connections
  page.on("websocket", (ws: WebSocket) => {
    if (urlFilter && !ws.url().match(urlFilter)) {
      return; // Skip WebSockets that don't match the filter
    }

    console.log("WebSocket connected:", ws.url());

    ws.on("framesent", (data) => {
      wsMessages.push({ type: "sent", message: data.payload.toString() });
      console.log("Message sent:", data.payload);
    });

    ws.on("framereceived", (data) => {
      wsMessages.push({ type: "received", message: data.payload.toString() });
      console.log("Message received:", data.payload);
    });
  });

  return new Promise((resolve) => {
    setTimeout(() => resolve(wsMessages), timeout);
  });
}
