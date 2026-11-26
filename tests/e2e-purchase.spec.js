const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CheckoutPage } = require('../pages/CheckoutPage');

test.describe('E-Commerce Shopping & Checkout Suite', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('TC_AUTO_05: Product sorting orders items by price low to high', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('lohi');

    const firstItemPrice = await inventoryPage.inventoryItemPrices.first().textContent();
    expect(firstItemPrice).toBe('$7.99');
  });

  test('TC_AUTO_06: Checkout blocks submission when mandatory fields are blank', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.openCart();
    await checkoutPage.proceedToCheckout();

    // Attempt to continue with empty fields
    await checkoutPage.fillCustomerDetails('', '', '');
    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('TC_AUTO_07: Complete end-to-end product purchase flow', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Add two items and verify cart badge count
    await inventoryPage.addProductToCart('sauce-labs-backpack');
    await inventoryPage.addProductToCart('sauce-labs-bike-light');
    await expect(inventoryPage.cartBadge).toHaveText('2');

    // Remove one item and verify badge updates to 1
    await inventoryPage.removeProductFromCart('sauce-labs-bike-light');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    // Complete checkout
    await inventoryPage.openCart();
    await checkoutPage.proceedToCheckout();
    await checkoutPage.fillCustomerDetails('Kasun', 'Perera', '10100');
    await checkoutPage.finishOrder();

    await expect(checkoutPage.confirmationHeader).toHaveText('Thank you for your order!');
  });
});
