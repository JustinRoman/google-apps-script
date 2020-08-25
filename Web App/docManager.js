/**
 * Convert Google Doc to HTML
 *
 * @param fileId {string} - the ID of the doc file that is to be converted to HTML.
 * @param apiKey {string} - unique identifier to authenticate a user.
 * @param url {string} - api url to make request to.
 */
function docToHtml(fileId, apiKey, url) {
  try {
    let docName = DriveApp.getFileById(fileId).getName();
  
    let doConvertionUrl = "https://docs.google.com/feeds/download/documents/export/Export?id=" + fileId + "&exportFormat=html";
    let options = 
        {
          method      : "get",
          headers     : {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
          muteHttpExceptions: true,
        };
  
    let html = UrlFetchApp.fetch(doConvertionUrl, options).getContentText();
    
//    this.createDocFromHtml(html, docName);
  
    let payload = this.createJsonPayload(docName, html);
    this.createTranslate(payload, apiKey, url);
  } catch(e) {
    console.log('Timed out: Restarting! ' + e.toString());
  }
}

/**
 * Creates a google document from HTML.
 *
 * @param content {string} - the HTML with necessary styles
 * @param docName {string} - name of the document file that will be created
 */
function createDocFromHtml(content, docName) {
  try {
    let newFile = DriveApp.createFile(docName, content, MimeType.HTML);
  
    Drive.Files.copy({title: 'docName'}, newFile.getId(), {convert: true}).id;
  } catch(e) {
    console.log('Timed out: Restarting! ' + e.toString());
  }
}