export class HomePage {
  constructor(page) {
    this.page = page;
    this.main = page.locator('#main-content');
    this.mainHeading = page.getByRole('heading', {
      level: 1,
      name: /discover our line of vr headsets/i
    });
    this.skipLink = page.getByRole('link', { name: /skip to main content/i });
    this.homeLink = page.getByRole('link', { name: /^vr headsets$/i });
    this.mainNavigation = page.getByRole('navigation', { name: /main navigation/i });
    this.bestSellersLink = this.mainNavigation.getByRole('link', { name: /best sellers/i });
    this.newsletterLink = this.mainNavigation.getByRole('link', { name: /newsletter/i });
    this.aboutLink = this.mainNavigation.getByRole('link', { name: /about us/i });
    this.bestSellersSection = page.locator('#best-sellers-section');
    this.allProductsSection = page.locator('#all-products-section');
    this.newsletterSection = page.locator('#newsletter-section');
    this.bestSellerCards = this.bestSellersSection.getByTestId('product-card');
    this.allProductCards = this.allProductsSection.getByTestId('product-card');
    this.countryBar = page.getByRole('region', { name: /delivery tax information/i });
    this.emailInput = page.getByRole('textbox', { name: /email address/i });
    this.subscribeButton = page.getByRole('button', { name: /subscribe/i });
    this.mobileMenuButton = page.getByRole('button', { name: /open navigation menu/i });
    this.mobileNavigation = page.getByRole('navigation', { name: /mobile navigation/i });
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.mainHeading.waitFor();
    await this.allProductCards.first().waitFor();
  }

  async goToBestSellers() {
    await this.bestSellersLink.click();
  }

  async goToNewsletter() {
    await this.newsletterLink.click();
  }

  async openMobileMenu() {
    await this.mobileMenuButton.click();
  }

  async subscribe(email) {
    await this.emailInput.fill(email);
    await this.subscribeButton.click();
  }
}
