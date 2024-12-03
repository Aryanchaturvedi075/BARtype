export async function setupTypingSession(page) {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('[data-testid="typing-input"]');
}