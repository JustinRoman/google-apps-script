/**
 * Converts PDF file to a document;
 */
function pdfToDoc() {
  var fileBlob = DriveApp.getFileById(this.createPdfFromSlide()).getBlob();
  var resource = {
    title: fileBlob.getName(),
    mimeType: fileBlob.getContentType()
  };
  var options = {
    ocr: true
  };
  var docFile = Drive.Files.insert(resource, fileBlob, options);
  var docId = docFile.id;
  var values = {
    'docId':  docId,
    'docName': DocumentApp.openById(docId).getName()
  };
  
  CacheService.getUserCache().putAll(values, 21600);
  
  return docId;
}

/**
 * Creates a PDF file from the active slide.
 */
function createPdfFromSlide() {
  var blob = DriveApp.getFileById(this.getPresentationId()).getBlob();
  var pdf = DriveApp.createFile(blob);
  var values = {
    'pdfId':  pdf.getId(),
    'pdfName': pdf.getName()
  };
  
  CacheService.getUserCache().putAll(values, 21600);
  
  return pdf.getId();
}

/**
 * Returns the html value of a google document.
 */
function docAsHtml() {
  var url = "https://docs.google.com/feeds/download/documents/export/Export?id=" 
  + this.pdfToDoc() + 
    "&exportFormat=html";
  var param = {
    method: 'get',
    headers: {'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()}
  };
  
  CacheService.getUserCache().put('slideHtml', UrlFetchApp.fetch(url, param).getContentText('UTF-8'), 21600);
  
  this.createTranslate(this.getPresentationContent());
  this.deleteCreatedFiles();
}

/**
 * Deletes the files created.
 */
function deleteCreatedFiles() {
  var docName = CacheService.getUserCache().get('docName');
  var pdfName = CacheService.getUserCache().get('pdfName');
  
  if (DriveApp.getFilesByName(pdfName).hasNext()) {
    Drive.Files.remove(this.getPdfIdFromCache());
  } else {
    console.error();
  }
  if (DriveApp.getFilesByName(docName).hasNext()) {
    Drive.Files.remove(this.getDocIdFromCache());
  } else {
    console.error();
  }
}

/**
 * Gets the content of the created document through the pdfToDoc method.
 */
function getDocumentContent() {
  var doc = DocumentApp.openById(this.pdfToDoc());
  
  this.textFormattingToHtml(doc.getBody());
}