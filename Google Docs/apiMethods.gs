/**
 * Check translation status and create a file.
 *
 * @author  Justin Amargo
 */
function checkStatus() {
  var response = UrlFetchApp.fetch('https://sandbox.wezen.com/api/translate/document/status?customerContext_id='+ this.getDocumentName() + '&customerContext_jobId=' + this.getDocumentName() + '&api_key=phDev-369b20512cea');
  var response = JSON.parse(response);
  var status = response.status['fr-FR'];
  
  if(status === 'Delivered') {
    var content = JSON.parse(this.fetchTranslate(this.getDocumentName()));
    var ui = DocumentApp.getUi();
    var translation = content['fragments'][0].localizations['fr-FR'];
    var uiResponse = ui.alert('Translated succsessfully, would you like to create a file?', ui.ButtonSet.YES_NO);
    
    if (uiResponse == ui.Button.YES) {
      this.createDoc(translation);
    }
  } else {
    DocumentApp.getUi().alert('Translation is in Progress');
  }
}

/**
 * To GET data from wezen API
 *
 * @author  Justin Amargo
 */
function fetchTranslate(contextId) {
  return UrlFetchApp.fetch('https://sandbox.wezen.com/api/translate/document?customerContext_id=' + contextId + '&api_key=phDev-369b20512cea');
}

/**
 * To POST data to wezen API
 *
 * @author  Justin Amargo
 */
function createTranslate() {
  var options = {
    'method': 'POST',
    'contentType': 'application/json',
    'payload': JSON.stringify(this.createJsonPayload())
  }
  
  var response = UrlFetchApp.fetch('https://sandbox.wezen.com/api/translate/document?api_key=phDev-369b20512cea', options);
}