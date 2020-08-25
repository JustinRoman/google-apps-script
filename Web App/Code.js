/**
 * HTTP GET request
 *
 * @param e {object} - event
 */
function doGet(e){
  return HtmlService.createTemplateFromFile('index').evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)
}

/**
 * Imports the specified file content into the current file.
 *
 * @param file {object} - file to be included in the main html file.
 */
function include(File) {
  return HtmlService.createHtmlOutputFromFile(File).getContent();
}

/**
 * Gets the file by ID and checks it's mime type and proceeds with the proper action from there.
 *
 * @param fileId {string} - the ID of the doc file that is to be converted to HTML.
 * @param apiKey {string} - unique identifier to authenticate a user.
 * @param url {string} - api url to make request to.
 */
function getFile(fileId, apiKey, url) {
  try {
    let file =  DriveApp.getFileById(fileId).getMimeType();
  
    if (file === MimeType.GOOGLE_DOCS) {
      this.docToHtml(fileId, apiKey, url);
    } else if (file === MimeType.GOOGLE_SLIDES) {
      console.log('this is a gslides');
    } else if (file === MimeType.GOOGLE_SHEETS) {
      console.log('this is a spreadsheet');
    }
  } catch(e) {
    console.log('Timed out: Restarting! ' + e.toString());
  }
}