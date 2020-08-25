function getFilesFromFolder() {
  let folderId = '12oQQNcvHTuNpndKzc-3X63LEV8VkXknR';
  let files = DriveApp.getFolderById(folderId).getFiles();
  let filesArray = [];
  
  while (files.hasNext()) {
    var file = files.next();
    
    if (file.getMimeType() !== MimeType.GOOGLE_APPS_SCRIPT && file.getMimeType() !== MimeType.GOOGLE_SHEETS) {
      filesArray.push(file.getName());
    }
  }
  
  console.log(filesArray);
}