/**
 * Prepares the data for translation by creating a 
 * JSON object with the content that is set for translation.
 *
 * @param fileName {string} - name of the file to be sent for translation
 * @param content {string} - the ocntent of the file to be sent for translation
 *
 * @returns translate {object} - JSON object that contaings the content of the file that is to be translated.
 */
function createJsonPayload(fileName, content) {
  return translate = {
    "customerContext_id": fileName,
    "customerContext_jobId": fileName,
    "name": fileName,
    "fragments": [
      {
        "key": "",
        "name": "",
        "sourceContent": content,
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