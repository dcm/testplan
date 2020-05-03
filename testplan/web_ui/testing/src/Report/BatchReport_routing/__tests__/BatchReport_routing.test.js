/** @jest-environment puppeteer */
const serverOrigin = global.puppeteerConfig.getOrigin();

describe('Google', () => {
  beforeAll(async () => {
    await page.goto(`${serverOrigin}?dev=true`);
  });

  it('should display "google" text on page', async () => {
    await expect(page.url()).toMatch(serverOrigin);
    await jestPuppeteer.debug();
  }, /*2**31-1*/);
});
