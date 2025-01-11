"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHeadingsVisibility = checkHeadingsVisibility;
exports.checkButtonsVisibilityAndAriaLabel = checkButtonsVisibilityAndAriaLabel;
exports.checkImagesVisibility = checkImagesVisibility;
async function checkHeadingsVisibility(page) {
    await page.waitForLoadState("domcontentloaded");
    const headings = page.getByRole("heading");
    // Get the total count of headers [h1, h2, h3, h4, h5, h6] on the page
    const headingCount = await headings.count();
    console.log(`Found ${headingCount} headings(s) on the page.`);
    for (let i = 0; i < headingCount; i++) {
        const header = headings.nth(i);
        const isVisible = await header.isVisible();
        if (!isVisible) {
            throw new Error(`Heading at index ${i} is not visible.`);
        }
    }
    console.log(`All ${headingCount} headings are visible.`);
}
async function checkButtonsVisibilityAndAriaLabel(page) {
    await page.waitForLoadState("domcontentloaded");
    const buttons = page.getByRole("button");
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
async function checkImagesVisibility(page) {
    await page.waitForLoadState("domcontentloaded");
    const images = page.getByRole("img");
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
