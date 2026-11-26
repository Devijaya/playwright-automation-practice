class InventoryPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItemPrices = page.locator('.inventory_item_price');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async sortBy(optionValue) {
    // Options: 'az', 'za', 'lohi', 'hilo'
    await this.sortDropdown.selectOption(optionValue);
  }

  async addProductToCart(productSlug) {
    await this.page.locator(`[data-test="add-to-cart-${productSlug}"]`).click();
  }

  async removeProductFromCart(productSlug) {
    await this.page.locator(`[data-test="remove-${productSlug}"]`).click();
  }

  async openCart() {
    await this.cartLink.click();
  }
}

module.exports = { InventoryPage };
