# Complete Beginner-to-Portfolio Guide: UI Test Automation with Playwright

This step-by-step handbook is designed to take you from zero test automation experience to building a cross-browser UI automation framework using **Playwright**, **JavaScript**, and the **Page Object Model (POM)** design pattern—complete with automated **GitHub Actions CI/CD** execution for your QA portfolio.

## Part 1: Core Automation Theory (Interview Essentials)

Before writing code, understand the architecture and concepts that Sri Lankan Tech Leads and QA Architects evaluate during internship interviews.

### 1. Why UI Test Automation?

* **Manual vs. Automated Testing:** Manual testing is ideal for exploratory testing, usability, and finding unexpected visual defects. Automated testing is used for repetitive **Regression Testing**—verifying that core user flows (like Login and Checkout) still work every time developers push new code.

* **Why Playwright?** Playwright is a modern open-source automation framework developed by Microsoft. Unlike older tools (such as Selenium), Playwright communicates directly with browsers over WebSockets, includes built-in **Auto-Waiting** (eliminating flaky tests caused by slow page loads), supports **Chromium, Firefox, and WebKit** out of the box, and generates rich HTML test reports automatically.

### 2. Page Object Model (POM) Design Pattern

The **Page Object Model** is the single most common interview topic in QA automation.

* **What is POM?** It is a design pattern where each web page in the application is represented as a separate JavaScript class (e.g., `LoginPage.js`, `InventoryPage.js`, `CheckoutPage.js`).

* **How it works:**

  * **Page Classes (`pages/` folder):** Store the UI element locators (buttons, input boxes) and reusable page actions (e.g., `login(username, password)`).

  * **Test Spec Files (`tests/` folder):** Contain only the test logic and assertions (`expect(...)`), calling methods from the Page Classes.

* **Why do companies use POM?** If a developer changes the Login button's ID on the website, you update the locator in **one place** (`LoginPage.js`) instead of fixing 20 broken test scripts. It eliminates code duplication and makes tests easy to read.

### 3. Locator Strategies (How Playwright Finds Elements)

To interact with a web page, Playwright needs reliable selectors:

* **Best Practice (`data-test` attributes):** Dedicated testing attributes like `[data-test="username"]` are immune to CSS styling changes or text updates. SauceDemo provides `data-test` attributes on almost every element.

* **User-Facing Locators:** `page.getByRole('button', { name: 'Login' })` or `page.getByPlaceholder('Username')`.

* **CSS Selectors:** `.shopping_cart_badge` (class) or `#login-button` (ID).

* **Avoid Brittle XPaths:** Long absolute XPaths like `/html/body/div[1]/div/div[2]/form/input[1]` break whenever a developer adds a wrapper `<div>`.

### 4. Auto-Waiting and Web-First Assertions

* **Auto-Waiting:** Before clicking a button or filling a text box, Playwright automatically waits for the element to be attached to the DOM, visible, stable (not animating), and enabled. You do not need hard-coded `sleep(5000)` timers.

* **Web-First Assertions:** Assertions like `await expect(page).toHaveURL(/.*inventory.html/)` automatically retry until the condition becomes true or a timeout is reached.

## Part 2: Prerequisites & Environment Setup

### Step 1: Install Node.js and Visual Studio Code

1. **Install Node.js (LTS):**

   * Go to `https://nodejs.org` and download the **LTS (Long Term Support)** installer for your operating system.

   * Run the installer with default settings.

   * Verify installation by opening a terminal or Command Prompt and running:

     ```
     node -v
     npm -v
     
     ```

     *(Both commands should print version numbers, such as `v20.x.x` and `10.x.x`).*

2. **Install Visual Studio Code (VS Code):**

   * Download and install VS Code from `https://code.visualstudio.com`.

   * Open VS Code, click the **Extensions** icon on the left sidebar (`Ctrl + Shift + X`), search for **Playwright Test for VSCode** (by Microsoft), and click **Install**.

### Step 2: Create and Initialize the Project Folder

1. On your computer, create a new folder named:
   `saucedemo-playwright-automation`

2. Open VS Code, click **`File` -> `Open Folder...`**, and select `saucedemo-playwright-automation`.

3. Open the integrated terminal in VS Code by pressing **`Ctrl + ~`** (or clicking **`Terminal` -> `New Terminal`** from the top menu).

4. Run the following commands one by one inside the terminal:

   ```
   npm init -y
   npm init playwright@latest
   
   ```

5. When the Playwright setup wizard asks configuration questions in the terminal, select these exact answers using your arrow keys and `Enter`:

   * **Do you want to use TypeScript or JavaScript?** -> Select **`JavaScript`**

   * **Where to put your end-to-end tests?** -> Press `Enter` to accept **`tests`**

   * **Add a GitHub Actions workflow?** -> Type **`y`** (Yes) and press `Enter` *(This configures automated cloud test runs whenever you push code to GitHub)*

   * **Install Playwright browsers?** -> Type **`y`** (Yes) and press `Enter` *(Wait 1–2 minutes while Chromium, Firefox, and WebKit download)*

### Step 3: Verify Default Installation

1. In the VS Code terminal, run the sample test included by Playwright:

   ```
   npx playwright test
   
   ```

2. You should see output indicating that `6 passed` across Chromium, Firefox, and WebKit.

3. Clean up the starter files so you can build your own clean framework:

   * Inside the **`tests/`** folder, delete `example.spec.js`.

   * If a `tests-examples/` folder was created, delete that folder as well.

## Part 3: Building the Page Object Model (POM) Architecture

Create a new folder in the root of your project named **`pages`**. Your project directory should now look like this:

```
saucedemo-playwright-automation/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── pages/
├── tests/
├── package.json
└── playwright.config.js

```

### Step 4: Create `pages/LoginPage.js`

1. Right-click the **`pages`** folder in VS Code -> **New File** -> name it **`LoginPage.js`**.

2. Paste the following code into `pages/LoginPage.js` and save (`Ctrl + S`):

```
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };

```

### Step 5: Create `pages/InventoryPage.js`

1. Right-click the **`pages`** folder -> **New File** -> name it **`InventoryPage.js`**.

2. Paste the following code and save (`Ctrl + S`):

```
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

```

### Step 6: Create `pages/CheckoutPage.js`

1. Right-click the **`pages`** folder -> **New File** -> name it **`CheckoutPage.js`**.

2. Paste the following code and save (`Ctrl + S`):

```
class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.confirmationHeader = page.locator('.complete-header');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async fillCustomerDetails(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }
}

module.exports = { CheckoutPage };

```

## Part 4: Writing Automated Test Suites

Now create two clean test spec files inside the **`tests/`** folder that import your Page Objects.

### Step 7: Create `tests/login.spec.js` (Authentication Tests)

1. Right-click the **`tests`** folder -> **New File** -> name it **`login.spec.js`**.

2. Paste the following code (covers positive login + 3 negative authentication scenarios):

```
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Authentication Test Suite', () => {
  test('TC_AUTO_01: Valid login redirects user to inventory page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('TC_AUTO_02: Locked-out user receives appropriate error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
  });

  test('TC_AUTO_03: Invalid password displays credential mismatch error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'wrong_password_123');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('TC_AUTO_04: Blank password field triggers required field validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', '');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Password is required');
  });
});

```

### Step 8: Create `tests/e2e-purchase.spec.js` (End-to-End Shopping Flow)

1. Right-click the **`tests`** folder -> **New File** -> name it **`e2e-purchase.spec.js`**.

2. Paste the following code (covers product sorting, cart badge updates, negative checkout validation, and a complete purchase flow):

```
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

```

## Part 5: Running Tests & Generating HTML Reports

### Step 9: Execute Cross-Browser Automated Tests

1. Make sure all files in `pages/` and `tests/` are saved (`File` -> `Save All`).

2. In the VS Code terminal, run:

   ```
   npx playwright test
   
   ```

3. Playwright will execute all **7 test cases across 3 browser engines** (Chromium, Firefox, and WebKit = **21 total automated test executions**) in headless mode.

4. *(Optional)* To watch the browser open visually during execution, run:

   ```
   npx playwright test --project=chromium --headed
   
   ```

### Step 10: View and Screenshot the HTML Test Report

1. In the VS Code terminal, run:

   ```
   npx playwright show-report
   
   ```

2. Your default web browser will open the interactive **Playwright Test Report** showing all 21 passed tests, browser tags, and execution durations.

3. **Capture Visual Proof:** Take a full-window screenshot of this report showing `All 21` green passing tests and save it inside your project root folder as:
   `playwright-report-results.png`

4. Press **`Ctrl + C`** in the VS Code terminal to stop the local report server.

## Part 6: Publishing to GitHub with CI/CD Pipeline

### Step 11: Configure `.gitignore`

Verify that a `.gitignore` file exists in your project root and contains:

```
node_modules/
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/

```

*(Note: `playwright-report-results.png` is NOT ignored, so it will upload cleanly to GitHub).*

### Step 12: Create a `README.md` File

In the root of `saucedemo-playwright-automation`, create a **`README.md`** file and paste this template:

```
# End-to-End UI Test Automation Framework — SauceDemo

A cross-browser UI test automation framework built with **Playwright** and **JavaScript**, structured using the **Page Object Model (POM)** design pattern and integrated with **GitHub Actions CI/CD**.

## Framework Architecture
```text
saucedemo-playwright-automation/
├── .github/workflows/
│   └── playwright.yml        # Automated CI test execution on push/pull request
├── pages/
│   ├── LoginPage.js          # Locators & actions for authentication
│   ├── InventoryPage.js      # Locators & actions for sorting and cart management
│   └── CheckoutPage.js       # Locators & actions for checkout steps
├── tests/
│   ├── login.spec.js         # Positive & negative login test suite
│   └── e2e-purchase.spec.js  # Sorting, cart updates, validation & E2E checkout
├── playwright.config.js
└── package.json

```

## Automated Test Coverage (21 Executions Across 3 Browsers)

| Test ID | Test Scenario | Browsers Covered | Status |
| :--- | :--- | :--- | :--- |
| `TC_AUTO_01` | Valid login redirects to inventory page | Chromium, Firefox, WebKit | Pass |
| `TC_AUTO_02` | Locked-out user error validation | Chromium, Firefox, WebKit | Pass |
| `TC_AUTO_03` | Invalid password error validation | Chromium, Firefox, WebKit | Pass |
| `TC_AUTO_04` | Blank password required field validation | Chromium, Firefox, WebKit | Pass |
| `TC_AUTO_05` | Product sorting by price (Low to High) | Chromium, Firefox, WebKit | Pass |
| `TC_AUTO_06` | Checkout mandatory field validation | Chromium, Firefox, WebKit | Pass |
| `TC_AUTO_07` | End-to-end cart management & order completion | Chromium, Firefox, WebKit | Pass |

## HTML Test Report Proof

![Playwright HTML Report](playwright-report-results.png)

## How to Run Locally

1. Clone the repository:

   ```
   git clone https://github.com/<your-username>/saucedemo-playwright-automation.git
   
   ```

2. Install dependencies and Playwright browsers:

   ```
   npm install
   npx playwright install
   
   ```

3. Run all tests:

   ```
   npx playwright test
   
   ```

4. View the HTML report:

   ```
   npx playwright show-report
   
   ```

```

### Step 13: Push to GitHub and Verify GitHub Actions CI

1. Log in to `https://github.com` and create a new **Public** repository named **`saucedemo-playwright-automation`** (do not initialize with a README since you already created one locally).
2. In your VS Code terminal, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Playwright POM UI automation framework"
   git branch -M main
   git remote add origin https://github.com/<your-username>/saucedemo-playwright-automation.git
   git push -u origin main
   ```

3. Open your repository on GitHub and click the **Actions** tab at the top. You will see the **Playwright Tests** workflow running your 21 tests automatically in the cloud and turning green.

## Part 7: How to Explain This Project in a QA Interview

When an interviewer asks *"Tell me about your UI automation experience"*, explain both the architecture and the business value:

> *"I built a cross-browser UI test automation framework for SauceDemo using Playwright and JavaScript, structured with the Page Object Model design pattern. I separated element locators and page actions into dedicated Page classes (`LoginPage`, `InventoryPage`, `CheckoutPage`) and wrote modular test specs covering authentication edge cases, dynamic product sorting, cart badge updates, and end-to-end checkout flows. The suite executes 21 automated tests across Chromium, Firefox, and WebKit, generates HTML test reports, and runs automatically on every push via a GitHub Actions CI pipeline."*


---

## Part 8: Full Project Overview & How Everything Works

### 1. What Is This Project?

This project (**`saucedemo-playwright-automation`**) is a complete, portfolio-ready **End-to-End (E2E) Cross-Browser UI Test Automation Framework** targeting the **SauceDemo** e-commerce web application (`https://www.saucedemo.com/`).

* **Tech Stack:**
  * **Test Framework:** Playwright Test (`@playwright/test` `^1.65.1`)
  * **Language:** JavaScript (CommonJS) on Node.js
  * **Design Pattern:** Page Object Model (POM)
  * **Browsers Tested:** Chromium (`Desktop Chrome`), Firefox (`Desktop Firefox`), and WebKit (`Desktop Safari`)
  * **Reporting & Debugging:** Playwright HTML Reporter (`playwright-report/`), failure context snapshots (`test-results/`), and `trace: 'on-first-retry'`
  * **CI/CD:** GitHub Actions (`.github/workflows/playwright.yml`)

* **Complete Repository Structure:**
  ```text
  saucedemo-playwright-automation/
  ├── .github/
  │   └── workflows/
  │       └── playwright.yml          # GitHub Actions CI pipeline
  ├── docs/
  │   └── playwright_ui_test_automation_masterclass_project_guide.md
  ├── pages/                          # Page Object Model classes (locators + actions)
  │   ├── LoginPage.js
  │   ├── InventoryPage.js
  │   └── CheckoutPage.js
  ├── tests/                          # Test specifications (assertions + test flows)
  │   ├── login.spec.js               # TC_AUTO_01 – TC_AUTO_04
  │   └── e2e-purchase.spec.js        # TC_AUTO_05 – TC_AUTO_07
  ├── .gitignore                      # Ignores node_modules/, playwright-report/, test-results/
  ├── package.json                    # Project metadata & devDependencies
  ├── package-lock.json               # Locked dependency tree for npm ci
  ├── playwright.config.js            # Test runner, browser projects, reporter & CI settings
  ├── playwright-report-results.png   # Visual proof of 21/21 passing tests
  └── README.md                       # Project documentation for GitHub
  ```

### 2. How This Framework Works (End-to-End Execution Flow)

1. **Configuration (`playwright.config.js`):**
   * `testDir: './tests'` tells Playwright where to discover `*.spec.js` files.
   * `fullyParallel: true` runs tests in parallel across multiple worker processes locally (`workers: undefined` uses available CPU cores), while `workers: 1` and `retries: 2` are enabled automatically when `process.env.CI` is set (such as inside GitHub Actions).
   * `forbidOnly: !!process.env.CI` prevents accidentally pushing `test.only(...)` to CI.
   * `reporter: 'html'` generates an interactive HTML report in `playwright-report/`.
   * `projects` defines 3 browser targets (`chromium`, `firefox`, `webkit`), so each of the **7 test cases** runs **3 times** (**21 total executions**).

2. **Test Lifecycle (`tests/*.spec.js`):**
   * Each test receives an isolated browser context and `{ page }` fixture from Playwright, meaning cookies, `localStorage`, and cart state never leak between tests.
   * In `tests/login.spec.js`, each test instantiates `new LoginPage(page)` and validates positive login (`TC_AUTO_01`) and negative login errors (`TC_AUTO_02`–`TC_AUTO_04`).
   * In `tests/e2e-purchase.spec.js`, `test.beforeEach` logs in as `standard_user` and asserts navigation to `inventory.html` before each test runs (`TC_AUTO_05`–`TC_AUTO_07`).

3. **Page Object Interaction (`pages/*.js`):**
   * Test files never hardcode CSS/attribute selectors. Instead, they call readable methods such as `loginPage.login(...)`, `inventoryPage.sortBy('lohi')`, `inventoryPage.addProductToCart(...)`, and `checkoutPage.fillCustomerDetails(...)`.
   * **Cross-Browser Stability Detail (`CheckoutPage.js`):** In `CheckoutPage.js`, `proceedToCheckout()` waits for the URL `/.*checkout-step-one\.html/`, and `fillCustomerDetails()` explicitly calls `await this.firstNameInput.click()` before `fill(firstName)`. During cross-browser testing on WebKit, filling `firstNameInput` immediately after clicking Checkout occasionally left the First Name field blank due to form render/focus timing; waiting for the checkout URL and focusing the input resolved it cleanly across all 21 runs.

4. **CI/CD Pipeline (`.github/workflows/playwright.yml`):**
   * Triggers automatically on every `push` or `pull_request` to `main` or `master`.
   * Runs on `ubuntu-latest` with Node.js LTS, installs exact dependencies with `npm ci`, installs browsers and OS dependencies with `npx playwright install --with-deps`, runs `npx playwright test`, and uploads `playwright-report/` as a downloadable artifact retained for 30 days (`actions/upload-artifact@v4`).

---

## Part 9: Commands to Run & Expected Outcomes

Use this reference table to know **what to run** and **what outcome you should see**:

| Goal | Command | Expected Outcome |
| :--- | :--- | :--- |
| **Run full cross-browser suite** | `npx playwright test` | Executes **21 tests** across `chromium`, `firefox`, and `webkit`. Terminal ends with `21 passed` (typically ~20–30s depending on machine/network). |
| **Run on Chromium only (fast check)** | `npx playwright test --project=chromium` | Executes **7 tests** on Chromium and prints `7 passed`. |
| **Watch tests visually in browser** | `npx playwright test --project=chromium --headed` | Opens a visible Chrome window and executes the 7 Chromium tests live. |
| **Run a single spec file** | `npx playwright test tests/login.spec.js` | Executes only the 4 login tests across 3 browsers (`12 passed`). |
| **Open interactive UI Mode** | `npx playwright test --ui` | Launches Playwright's visual test runner where you can step through actions, inspect DOM snapshots, and watch timelines. |
| **Debug a test step-by-step** | `npx playwright test --debug` | Opens Playwright Inspector to pause and step through each locator and assertion. |
| **View the HTML test report** | `npx playwright show-report` | Opens the local report server in your browser showing `All 21`, `Passed 21`, `Failed 0`, `Flaky 0`, `Skipped 0`, and per-browser durations. |

> [!NOTE]
> These tests run against the live public site `https://www.saucedemo.com/`. An active internet connection is required; if offline or blocked by DNS/firewall, tests will fail with `ERR_NAME_NOT_RESOLVED` or `Could not resolve hostname`.

---

## Part 10: Playwright Learning Reference (Deep Dive)

This project is designed as a hands-on Playwright learning handbook. Below are the core Playwright concepts demonstrated in this codebase:

1. **Test Runner & Built-in `{ page }` Fixture:**
   * Playwright's `test('name', async ({ page }) => { ... })` automatically creates a fresh `BrowserContext` and `Page` per test and tears them down afterward. This guarantees **test isolation**—if `TC_AUTO_07` adds items to the cart, it will never affect `TC_AUTO_05` or `TC_AUTO_06`.

2. **Grouping & Hooks (`test.describe` & `test.beforeEach`):**
   * `test.describe(...)` groups related tests into logical suites (`Authentication Test Suite` and `E-Commerce Shopping & Checkout Suite`).
   * `test.beforeEach(...)` eliminates repetitive login steps in `e2e-purchase.spec.js` so every shopping/checkout test starts authenticated on `inventory.html`.

3. **Locator Priority & Parameterized Locators:**
   * Static locators are defined once in the Page Object `constructor(page)` (e.g., `page.locator('[data-test="username"]')`).
   * Dynamic locators use template methods (e.g., `page.locator(\`[data-test="add-to-cart-${productSlug}"]\`)`) so a single method works for any product (`sauce-labs-backpack`, `sauce-labs-bike-light`, etc.).

4. **Web-First Assertions vs. Value Assertions:**
   * **Web-First (auto-retrying):** `await expect(page).toHaveURL(/.*inventory.html/)`, `await expect(loginPage.errorMessage).toBeVisible()`, and `await expect(inventoryPage.cartBadge).toHaveText('2')` automatically poll until the condition passes or the timeout expires.
   * **Value Assertion:** `expect(firstItemPrice).toBe('$7.99')` checks an already-fetched string value synchronously.

5. **Failure Artifacts & Traces:**
   * When a test fails, Playwright automatically saves a Markdown DOM snapshot (`test-results/<test-name>/error-context.md`) showing the exact page state and failing line.
   * With `trace: 'on-first-retry'` in `playwright.config.js`, CI retries capture a full trace (`trace.zip`) viewable via `npx playwright show-trace` or inside the HTML report.

---

## Part 11: What I Have Learned From This Project

By building and verifying this framework from scratch, I gained practical experience in:

* **Designing a Maintainable POM Architecture:** Separating element locators and UI interactions (`pages/`) from test scenarios and assertions (`tests/`) so UI changes only require updating a single Page Object file.
* **Writing Resilient Locator Strategies:** Choosing stable `[data-test="..."]` attributes and clean class selectors over brittle XPaths.
* **Comprehensive Test Case Design:** Covering both **positive happy paths** (`TC_AUTO_01`, `TC_AUTO_05`, `TC_AUTO_07`) and **negative/validation edge cases** (`TC_AUTO_02` locked-out user, `TC_AUTO_03` wrong password, `TC_AUTO_04` blank password, `TC_AUTO_06` blank checkout fields).
* **Cross-Browser Testing & Debugging:** Executing the same suite across Chromium, Firefox, and WebKit, diagnosing a WebKit-specific form focus/hydration timing issue in `CheckoutPage.js`, and fixing it cleanly without hard-coded `sleep()` calls.
* **Test Reporting & Visual Proof:** Generating Playwright HTML reports and capturing report artifacts (`playwright-report-results.png`) for documentation.
* **CI/CD Automation with GitHub Actions:** Configuring automated cloud test runs and report artifact uploads on every `push` and `pull_request`.

---

## Part 12: Setup & Run Guide for Anyone Cloning This Repository

If someone clones this repository onto a new machine, follow these exact steps to set it up and run the tests:

### Prerequisites
* **Node.js (LTS)** (`v18+` or `v20+` / `v22+` recommended) and **npm**
* **Git**
* **Internet access** (to install npm packages, download Playwright browsers, and reach `https://www.saucedemo.com/`)

### Step-by-Step Setup

1. **Clone the repository and enter the folder:**
   ```bash
   git clone https://github.com/<your-username>/saucedemo-playwright-automation.git
   cd saucedemo-playwright-automation
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```
   *(This installs `@playwright/test` and `@types/node` from `package-lock.json`.)*

3. **Install Playwright browser binaries:**
   * **Windows / macOS:**
     ```bash
     npx playwright install
     ```
   * **Linux (e.g., Ubuntu/Debian, to also install required OS libraries):**
     ```bash
     npx playwright install --with-deps
     ```

4. **Run the full test suite:**
   ```bash
   npx playwright test
   ```
   **Expected outcome:** `21 passed` across Chromium, Firefox, and WebKit.

5. **View the HTML test report:**
   ```bash
   npx playwright show-report
   ```

### Quick Troubleshooting
* **`Executable doesn't exist` error:** Run `npx playwright install` again to download the Playwright-managed browser binaries.
* **`ERR_NAME_NOT_RESOLVED` / `Could not resolve hostname`:** Verify your internet connection and that `https://www.saucedemo.com/` is not blocked by a proxy or firewall.
* **Timeout on a slow network:** Re-run with a higher timeout, e.g. `npx playwright test --timeout=60000`, or run a single browser project first (`npx playwright test --project=chromium`).


---

## Part 8: Full Project Overview & How Everything Works

### 1. What Is This Project?

This project (**`saucedemo-playwright-automation`**) is a complete, portfolio-ready **End-to-End (E2E) Cross-Browser UI Test Automation Framework** targeting the **SauceDemo** e-commerce web application (`https://www.saucedemo.com/`).

* **Tech Stack:**
  * **Test Framework:** Playwright Test (`@playwright/test` `^1.65.1`)
  * **Language:** JavaScript (CommonJS) on Node.js
  * **Design Pattern:** Page Object Model (POM)
  * **Browsers Tested:** Chromium (`Desktop Chrome`), Firefox (`Desktop Firefox`), and WebKit (`Desktop Safari`)
  * **Reporting & Debugging:** Playwright HTML Reporter (`playwright-report/`), failure context snapshots (`test-results/`), and `trace: 'on-first-retry'`
  * **CI/CD:** GitHub Actions (`.github/workflows/playwright.yml`)

* **Complete Repository Structure:**
  ```text
  saucedemo-playwright-automation/
  ├── .github/
  │   └── workflows/
  │       └── playwright.yml          # GitHub Actions CI pipeline
  ├── docs/
  │   └── playwright_ui_test_automation_masterclass_project_guide.md
  ├── pages/                          # Page Object Model classes (locators + actions)
  │   ├── LoginPage.js
  │   ├── InventoryPage.js
  │   └── CheckoutPage.js
  ├── tests/                          # Test specifications (assertions + test flows)
  │   ├── login.spec.js               # TC_AUTO_01 – TC_AUTO_04
  │   └── e2e-purchase.spec.js        # TC_AUTO_05 – TC_AUTO_07
  ├── .gitignore                      # Ignores node_modules/, playwright-report/, test-results/
  ├── package.json                    # Project metadata & devDependencies
  ├── package-lock.json               # Locked dependency tree for npm ci
  ├── playwright.config.js            # Test runner, browser projects, reporter & CI settings
  ├── playwright-report-results.png   # Visual proof of 21/21 passing tests
  └── README.md                       # Project documentation for GitHub
  ```

### 2. How This Framework Works (End-to-End Execution Flow)

1. **Configuration (`playwright.config.js`):**
   * `testDir: './tests'` tells Playwright where to discover `*.spec.js` files.
   * `fullyParallel: true` runs tests in parallel across multiple worker processes locally (`workers: undefined` uses available CPU cores), while `workers: 1` and `retries: 2` are enabled automatically when `process.env.CI` is set (such as inside GitHub Actions).
   * `forbidOnly: !!process.env.CI` prevents accidentally pushing `test.only(...)` to CI.
   * `reporter: 'html'` generates an interactive HTML report in `playwright-report/`.
   * `projects` defines 3 browser targets (`chromium`, `firefox`, `webkit`), so each of the **7 test cases** runs **3 times** (**21 total executions**).

2. **Test Lifecycle (`tests/*.spec.js`):**
   * Each test receives an isolated browser context and `{ page }` fixture from Playwright, meaning cookies, `localStorage`, and cart state never leak between tests.
   * In `tests/login.spec.js`, each test instantiates `new LoginPage(page)` and validates positive login (`TC_AUTO_01`) and negative login errors (`TC_AUTO_02`–`TC_AUTO_04`).
   * In `tests/e2e-purchase.spec.js`, `test.beforeEach` logs in as `standard_user` and asserts navigation to `inventory.html` before each test runs (`TC_AUTO_05`–`TC_AUTO_07`).

3. **Page Object Interaction (`pages/*.js`):**
   * Test files never hardcode CSS/attribute selectors. Instead, they call readable methods such as `loginPage.login(...)`, `inventoryPage.sortBy('lohi')`, `inventoryPage.addProductToCart(...)`, and `checkoutPage.fillCustomerDetails(...)`.
   * **Cross-Browser Stability Detail (`CheckoutPage.js`):** In `CheckoutPage.js`, `proceedToCheckout()` waits for the URL `/.*checkout-step-one\.html/`, and `fillCustomerDetails()` explicitly calls `await this.firstNameInput.click()` before `fill(firstName)`. During cross-browser testing on WebKit, filling `firstNameInput` immediately after clicking Checkout occasionally left the First Name field blank due to form render/focus timing; waiting for the checkout URL and focusing the input resolved it cleanly across all 21 runs.

4. **CI/CD Pipeline (`.github/workflows/playwright.yml`):**
   * Triggers automatically on every `push` or `pull_request` to `main` or `master`.
   * Runs on `ubuntu-latest` with Node.js LTS, installs exact dependencies with `npm ci`, installs browsers and OS dependencies with `npx playwright install --with-deps`, runs `npx playwright test`, and uploads `playwright-report/` as a downloadable artifact retained for 30 days (`actions/upload-artifact@v4`).

---

## Part 9: Commands to Run & Expected Outcomes

Use this reference table to know **what to run** and **what outcome you should see**:

| Goal | Command | Expected Outcome |
| :--- | :--- | :--- |
| **Run full cross-browser suite** | `npx playwright test` | Executes **21 tests** across `chromium`, `firefox`, and `webkit`. Terminal ends with `21 passed` (typically ~20–30s depending on machine/network). |
| **Run on Chromium only (fast check)** | `npx playwright test --project=chromium` | Executes **7 tests** on Chromium and prints `7 passed`. |
| **Watch tests visually in browser** | `npx playwright test --project=chromium --headed` | Opens a visible Chrome window and executes the 7 Chromium tests live. |
| **Run a single spec file** | `npx playwright test tests/login.spec.js` | Executes only the 4 login tests across 3 browsers (`12 passed`). |
| **Open interactive UI Mode** | `npx playwright test --ui` | Launches Playwright's visual test runner where you can step through actions, inspect DOM snapshots, and watch timelines. |
| **Debug a test step-by-step** | `npx playwright test --debug` | Opens Playwright Inspector to pause and step through each locator and assertion. |
| **View the HTML test report** | `npx playwright show-report` | Opens the local report server in your browser showing `All 21`, `Passed 21`, `Failed 0`, `Flaky 0`, `Skipped 0`, and per-browser durations. |

> [!NOTE]
> These tests run against the live public site `https://www.saucedemo.com/`. An active internet connection is required; if offline or blocked by DNS/firewall, tests will fail with `ERR_NAME_NOT_RESOLVED` or `Could not resolve hostname`.

---

## Part 10: Playwright Learning Reference (Deep Dive)

This project is designed as a hands-on Playwright learning handbook. Below are the core Playwright concepts demonstrated in this codebase:

1. **Test Runner & Built-in `{ page }` Fixture:**
   * Playwright's `test('name', async ({ page }) => { ... })` automatically creates a fresh `BrowserContext` and `Page` per test and tears them down afterward. This guarantees **test isolation**—if `TC_AUTO_07` adds items to the cart, it will never affect `TC_AUTO_05` or `TC_AUTO_06`.

2. **Grouping & Hooks (`test.describe` & `test.beforeEach`):**
   * `test.describe(...)` groups related tests into logical suites (`Authentication Test Suite` and `E-Commerce Shopping & Checkout Suite`).
   * `test.beforeEach(...)` eliminates repetitive login steps in `e2e-purchase.spec.js` so every shopping/checkout test starts authenticated on `inventory.html`.

3. **Locator Priority & Parameterized Locators:**
   * Static locators are defined once in the Page Object `constructor(page)` (e.g., `page.locator('[data-test="username"]')`).
   * Dynamic locators use template methods (e.g., `page.locator(\`[data-test="add-to-cart-${productSlug}"]\`)`) so a single method works for any product (`sauce-labs-backpack`, `sauce-labs-bike-light`, etc.).

4. **Web-First Assertions vs. Value Assertions:**
   * **Web-First (auto-retrying):** `await expect(page).toHaveURL(/.*inventory.html/)`, `await expect(loginPage.errorMessage).toBeVisible()`, and `await expect(inventoryPage.cartBadge).toHaveText('2')` automatically poll until the condition passes or the timeout expires.
   * **Value Assertion:** `expect(firstItemPrice).toBe('$7.99')` checks an already-fetched string value synchronously.

5. **Failure Artifacts & Traces:**
   * When a test fails, Playwright automatically saves a Markdown DOM snapshot (`test-results/<test-name>/error-context.md`) showing the exact page state and failing line.
   * With `trace: 'on-first-retry'` in `playwright.config.js`, CI retries capture a full trace (`trace.zip`) viewable via `npx playwright show-trace` or inside the HTML report.

---

## Part 11: What I Have Learned From This Project

By building and verifying this framework from scratch, I gained practical experience in:

* **Designing a Maintainable POM Architecture:** Separating element locators and UI interactions (`pages/`) from test scenarios and assertions (`tests/`) so UI changes only require updating a single Page Object file.
* **Writing Resilient Locator Strategies:** Choosing stable `[data-test="..."]` attributes and clean class selectors over brittle XPaths.
* **Comprehensive Test Case Design:** Covering both **positive happy paths** (`TC_AUTO_01`, `TC_AUTO_05`, `TC_AUTO_07`) and **negative/validation edge cases** (`TC_AUTO_02` locked-out user, `TC_AUTO_03` wrong password, `TC_AUTO_04` blank password, `TC_AUTO_06` blank checkout fields).
* **Cross-Browser Testing & Debugging:** Executing the same suite across Chromium, Firefox, and WebKit, diagnosing a WebKit-specific form focus/hydration timing issue in `CheckoutPage.js`, and fixing it cleanly without hard-coded `sleep()` calls.
* **Test Reporting & Visual Proof:** Generating Playwright HTML reports and capturing report artifacts (`playwright-report-results.png`) for documentation.
* **CI/CD Automation with GitHub Actions:** Configuring automated cloud test runs and report artifact uploads on every `push` and `pull_request`.

---

## Part 12: Setup & Run Guide for Anyone Cloning This Repository

If someone clones this repository onto a new machine, follow these exact steps to set it up and run the tests:

### Prerequisites
* **Node.js (LTS)** (`v18+` or `v20+` / `v22+` recommended) and **npm**
* **Git**
* **Internet access** (to install npm packages, download Playwright browsers, and reach `https://www.saucedemo.com/`)

### Step-by-Step Setup

1. **Clone the repository and enter the folder:**
   ```bash
   git clone https://github.com/<your-username>/saucedemo-playwright-automation.git
   cd saucedemo-playwright-automation
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```
   *(This installs `@playwright/test` and `@types/node` from `package-lock.json`.)*

3. **Install Playwright browser binaries:**
   * **Windows / macOS:**
     ```bash
     npx playwright install
     ```
   * **Linux (e.g., Ubuntu/Debian, to also install required OS libraries):**
     ```bash
     npx playwright install --with-deps
     ```

4. **Run the full test suite:**
   ```bash
   npx playwright test
   ```
   **Expected outcome:** `21 passed` across Chromium, Firefox, and WebKit.

5. **View the HTML test report:**
   ```bash
   npx playwright show-report
   ```

### Quick Troubleshooting
* **`Executable doesn't exist` error:** Run `npx playwright install` again to download the Playwright-managed browser binaries.
* **`ERR_NAME_NOT_RESOLVED` / `Could not resolve hostname`:** Verify your internet connection and that `https://www.saucedemo.com/` is not blocked by a proxy or firewall.
* **Timeout on a slow network:** Re-run with a higher timeout, e.g. `npx playwright test --timeout=60000`, or run a single browser project first (`npx playwright test --project=chromium`).
