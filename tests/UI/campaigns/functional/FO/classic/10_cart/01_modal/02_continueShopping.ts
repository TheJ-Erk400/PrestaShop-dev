// Import utils
import testContext from '@utils/testContext';

// Import FO pages
import {cartPage} from '@pages/FO/classic/cart';
import {blockCartModal} from '@pages/FO/classic/modal/blockCart';

import {expect} from 'chai';
import type {BrowserContext, Page} from 'playwright';
import {
  foClassicHomePage,
  foClassicModalQuickViewPage,
  foClassicProductPage,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_classic_cart_modal_continueShopping';

describe('FO - cart : Continue shopping / Proceed to checkout / Close', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  it('should open the shop page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToFo', baseContext);

    await foClassicHomePage.goToFo(page);
    await foClassicHomePage.changeLanguage(page, 'en');

    const isHomePage = await foClassicHomePage.isHomePage(page);
    expect(isHomePage, 'Fail to open FO home page').to.eq(true);
  });

  it('should add the first product to cart by quick view', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'addFirstProductToCart', baseContext);

    await foClassicHomePage.quickViewProduct(page, 1);
    await foClassicModalQuickViewPage.setQuantityAndAddToCart(page, 2);

    const isBlockCartModal = await blockCartModal.isBlockCartModalVisible(page);
    expect(isBlockCartModal).to.equal(true);

    const successMessage = await blockCartModal.getBlockCartModalTitle(page);
    expect(successMessage).to.contains(foClassicHomePage.successAddToCartMessage);
  });

  it('should click on continue shopping button', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'continueShopping', baseContext);

    const isModalNotVisible = await blockCartModal.continueShopping(page);
    expect(isModalNotVisible).to.equal(true);
  });

  it('should go to the second product page and add the product to the cart', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToSecondProductPage', baseContext);

    await foClassicHomePage.goToProductPage(page, 2);
    await foClassicProductPage.clickOnAddToCartButton(page);

    const successMessage = await blockCartModal.getBlockCartModalTitle(page);
    expect(successMessage).to.contains(foClassicHomePage.successAddToCartMessage);
  });

  it('should close the blockCart modal', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'closeBlockCartModal', baseContext);

    const isQuickViewModalClosed = await blockCartModal.closeBlockCartModal(page);
    expect(isQuickViewModalClosed).to.equal(true);
  });

  it('should click on add product to cart button', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart', baseContext);

    await foClassicProductPage.clickOnAddToCartButton(page);

    const successMessage = await blockCartModal.getBlockCartModalTitle(page);
    expect(successMessage).to.contains(foClassicHomePage.successAddToCartMessage);
  });

  it('should close the blockCart modal by clicking outside the modal', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'closeBlockCartModal2', baseContext);

    const isQuickViewModalClosed = await blockCartModal.closeBlockCartModal(page, true);
    expect(isQuickViewModalClosed).to.equal(true);
  });

  it('should click on add product to cart button', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart2', baseContext);

    await foClassicProductPage.clickOnAddToCartButton(page);

    const successMessage = await blockCartModal.getBlockCartModalTitle(page);
    expect(successMessage).to.contains(foClassicHomePage.successAddToCartMessage);
  });

  it('should click on proceed to checkout button', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'proceedToCheckout', baseContext);

    await blockCartModal.proceedToCheckout(page);

    const notificationsNumber = await cartPage.getCartNotificationsNumber(page);
    expect(notificationsNumber).to.equal(5);
  });

  it('should delete the shopping cart', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'deleteProducts', baseContext);

    await cartPage.deleteProduct(page, 2);
    await cartPage.deleteProduct(page, 1);

    const notificationNumber = await cartPage.getCartNotificationsNumber(page);
    expect(notificationNumber).to.be.equal(0);
  });
});
