/**
 * Trigger runs automatically when a user install the add-on.
 * Commonly used to call onOpen to add custom menus.
 *
 * @author  Justin Amargo
 */
function onInstall(e) {
  onOpen(e);
}

function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
  .addItem('Translate', 'showSidebar')
  .addToUi();
}

function showSidebar() {
  var ui = HtmlService
         .createHtmlOutputFromFile('index')
         .setTitle('Translate');
  
  DocumentApp.getUi().showSidebar(ui);
}

/**
 * Get the content of a document that is to be sent for translation through the wezen API
 *
 * @author  Justin Amargo
 */
function getDocumentContent() {
  var docId = DocumentApp.getActiveDocument().getId();
  var doc = DocumentApp.openById(docId);
  
  return doc.getBody().getText();
}

/**
* Get the name of the current document.
*
* @author Justin Amargo
*/
function getDocumentName() {
  return DocumentApp.getActiveDocument().getName();
}

/**
 * Prepares the data for translation by creating a 
 * JSON object with the content that is set for translation.
 *
 * @author  Justin Amargo
 */
function createJsonPayload() {
  return translate = {
    "customerContext_id": this.getDocumentName(),
    "customerContext_jobId": this.getDocumentName(),
    "name": this.getDocumentName(),
    "fragments": [
      {
        "key": "",
        "name": "",
        "sourceContent": this.getDocumentContent(),
        "localizations": {},
        "maxCharCount": 0,
        "maxExpansionRatio": 0,
        "htmlAllowed": true,
        "translationContext": {}
      }
    ],
    "sourceLanguage": "en-US",
    "targetLanguages": [
      "fr-FR"
    ],
    "labels": [
      "string"
    ],
    "tag": {},
    "translationContext": {},
    "urgent": true,
    "personalData": true
  }
}

/**
 * Creates a document from the data fetched from the wezen API
 *
 * @author  Justin Amargo
 */
function createDoc(content) {
  var doc = DocumentApp.create(this.getDocumentName());
  
  doc.getBody().appendParagraph(content);
}
