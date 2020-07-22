/**
 * Runs when a user opens a spreadsheet, document, presentation, 
 * or form that the user has permission to edit.
 *
 * @param {Event} e The onOpen event.
 */
function onOpen(e) {
  SlidesApp.getUi().createAddonMenu()
  .addItem('Open Wezen Add-on', 'showSidebar')
  .addToUi();
}

/**
 * Trigger runs automatically when a user install the add-on.
 * Commonly used to call onOpen to add custom menus.
 *
 * @param {Event} e The onInstall event.
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Shows a sidebar on execution of the script.
 */
function showSidebar() {
  var ui = HtmlService
         .createHtmlOutputFromFile('index')
         .setTitle('Superuser Tools');
  
  SlidesApp.getUi().showSidebar(ui);
}

/**
 * Sends the contents of the presentation for translation.
 *
 * @param {string} url - url for wezen instance
 * @param {string} apiKey - unique identifier to authenticate a user.
 * @param {string} targetLanguage - the target language of the translation.
 *
 * @returns {*}
 */
function sendForTranslation(url, apiKey, targetLanguage) {
  try {
    var createdAt = Utilities.formatDate(new Date(), "GMT+8", "MM/dd/yyy hh:mm a");
    CacheService.getUserCache().put('createdAt', createdAt, 21600);
    this.formatPresentation(url, apiKey, targetLanguage);
    
    CacheService.getUserCache().put('targetLanguage', targetLanguage, 21600);
  } catch (e) {
    console.error(e);
  }
  
  return createdAt;
}

/**
 * Retrieves the translated content.
 */
function getTranslation() {
  try {
    this.processSlideCopy();
    this.removeFromCache();
  } catch (e) {
    console.error(e);
  }
}

/**
 * Get the date when the translation request is created from cache.
 *
 * @returns {ActiveX.IXMLDOMNode | Promise<any> | any | string | IDBRequest<any | undefined> | FormDataEntryValue | Function | Promise<Credential | null>}
 */
function getDateCreated() {
  return CacheService.getUserCache().get('createdAt');
}

/**
 * Get the delivery date from the response of wezen API
 *
 * @returns {*}
 */
function getDeliveryDate() {
  var date = new Date(this.getEstimate()['deliveryDate']['en-US']);
  
  return Utilities.formatDate(date, "GMT+8", "MM/dd/yyy hh:mm a")
}

/**
 * Get the total word count from the response of wezen API
 *
 * @returns {*}
 */
function getWordCount() {
  return this.getEstimate()['totalWordCount'];
}

/**
 * Removes values from the cache of the user.
 */
function removeFromCache() {
  CacheService.getUserCache().removeAll(['createdAt', 'dataStatus', 'targetLanguage']);
}

/**
 * Sets dataStatus to true if it's stored in the cache.
 *
 * @returns {boolean}
 */
function setDataSentAttr() {
  var dataStatus = true;
  CacheService.getUserCache().put('dataStatus', dataStatus, 21600);
  
  return dataStatus;
}

/**
 * Fetches the dataStatus from the users cache.
 *
 * @returns {ActiveX.IXMLDOMNode | Promise<any> | any | string | IDBRequest<any | undefined> | FormDataEntryValue | Function | Promise<Credential | null>}
 */
function getDataSentAttr () {
  return CacheService.getUserCache().get('dataStatus');
}