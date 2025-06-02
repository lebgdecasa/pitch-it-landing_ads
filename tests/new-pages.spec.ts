import { test, expect, Page } from '@playwright/test';

// Helper function to check common page elements like header/footer if needed
async function checkLayout(page: Page) {
  await expect(page.locator('header')).toBeVisible();
  // await expect(page.locator('footer')).toBeVisible(); // Assuming a footer exists
}

test.describe('New Pages (/why-us and /features)', () => {
  test.describe('Navigation', () => {
    test('should navigate to /why-us page from header link', async ({ page }) => {
      await page.goto('/'); // Start from homepage
      // Click the "Why Us" link in the header
      // Adjust selector if translation key 'nav_why_us' renders different text
      // Using a more robust selector that checks for text "Why Us" or an aria-label containing "Why Us"
      await page.locator('header nav a:has-text("Why Us"), header nav a[aria-label*="Why Us"]').click();
      await expect(page).toHaveURL('/why-us');
      await expect(page.locator('h1:has-text("Why NexTraction Exists")')).toBeVisible();
      await checkLayout(page);
    });

    test('should navigate to /features page from header link', async ({ page }) => {
      await page.goto('/'); // Start from homepage
      // Click the "Features" link in the header
      // Adjust selector if translation key 'nav_features' renders different text
      await page.locator('header nav a:has-text("Features"), header nav a[aria-label*="Features"]').click();
      await expect(page).toHaveURL('/features');
      await expect(page.locator('h1:has-text("A Complete Platform for Founders & Investors")')).toBeVisible();
      await checkLayout(page);
    });
  });

  test.describe('/why-us Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/why-us');
    });

    test('should have correct title', async ({ page }) => {
      await expect(page).toHaveTitle("Why NexTraction? Evidence-First Validation & AI-Powered Diligence");
    });

    test('Mobile snapshot @ 375x812', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      // Wait for any animations or lazy-loaded content if necessary
      await page.waitForTimeout(1000); // Give time for layout shifts, animations
      await expect(page).toHaveScreenshot('why-us-mobile.png', { fullPage: true, maxDiffPixelRatio: 0.05 });
    });

    test('Desktop snapshot @ 1440x900', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForTimeout(1000);
      await expect(page).toHaveScreenshot('why-us-desktop.png', { fullPage: true, maxDiffPixelRatio: 0.05 });
    });

    test('Sticky CTA should appear on scroll on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      const stickyCTA = page.locator('div.fixed.bottom-0.left-0.right-0 >> text="Get Started with NexTraction"');

      // Check initial state: The CTA is designed to be initially off-screen (translate-y-full)
      // Depending on how Playwright handles "visibility" for off-screen translated elements,
      // this might pass if it's considered "not visible" or might need adjustment.
      // A more robust check could be to assert its transform style or bounding box.
      // For simplicity, we'll rely on Playwright's default visibility check here.
      // If it's mounted but translated off-screen, it might still be considered "visible" in DOM but not to user.
      // Let's assume it's not visible to the user.
      await expect(stickyCTA).toHaveClass(/translate-y-full/);


      // Scroll down enough to trigger the CTA (e.g., 50% of viewport height)
      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.5));
      await page.waitForTimeout(350); // Wait for scroll and transition (duration-300)
      await expect(stickyCTA).toBeVisible();
      await expect(stickyCTA).not.toHaveClass(/translate-y-full/);
      await expect(stickyCTA).toHaveClass(/translate-y-0/);
    });

  });

  test.describe('/features Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/features');
    });

    test('should have correct title', async ({ page }) => {
      await expect(page).toHaveTitle("NexTraction Features | Complete Platform for Founders & Investors");
    });

    test('Accordion items should toggle content visibility', async ({ page }) => {
      // Target the first accordion item (Trend Crawler & Netnography)
      const firstAccordionButton = page.locator('button:has-text("Trend Crawler & Netnography")');
      const firstAccordionContent = firstAccordionButton.locator('xpath=ancestor::h2/following-sibling::div');

      // Initially, the first item is open due to `initiallyOpen={index === 0}`
      await expect(firstAccordionContent).toBeVisible();

      // Click to close it
      await firstAccordionButton.click();
      await expect(firstAccordionContent).not.toBeVisible();

      // Click to open it again
      await firstAccordionButton.click();
      await expect(firstAccordionContent).toBeVisible();

      // Target the second accordion item (Real-World Pulse)
      const secondAccordionButton = page.locator('button:has-text("Real-World Pulse")');
      const secondAccordionContent = secondAccordionButton.locator('xpath=ancestor::h2/following-sibling::div');

      // Initially, the second item should be closed
      await expect(secondAccordionContent).not.toBeVisible();

      // Click to open it
      await secondAccordionButton.click();
      await expect(secondAccordionContent).toBeVisible();
    });

    test('FAQ Accordion items should toggle', async ({ page }) => {
        // Target the first FAQ item
        const firstFaqButton = page.locator('button:has-text("What is the pricing model for NexTraction?")');
        const firstFaqContent = firstFaqButton.locator('xpath=ancestor::h2/following-sibling::div');

        // Initially closed (as per current page setup where FAQs are not initiallyOpen)
        await expect(firstFaqContent).not.toBeVisible();
        // Click to open
        await firstFaqButton.click();
        await expect(firstFaqContent).toBeVisible();
        // Click to close
        await firstFaqButton.click();
        await expect(firstFaqContent).not.toBeVisible();
    });

    test('Mobile snapshot @ 375x812', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(1000);
      await expect(page).toHaveScreenshot('features-mobile.png', { fullPage: true, maxDiffPixelRatio: 0.05 });
    });

    test('Desktop snapshot @ 1440x900', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForTimeout(1000);
      await expect(page).toHaveScreenshot('features-desktop.png', { fullPage: true, maxDiffPixelRatio: 0.05 });
    });
  });
});
