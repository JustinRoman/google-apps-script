/**
* Get the number of slides in a presentation.
*
* @param presentation {object} - the active presentation
*/
function getSlidesCount(presentation) {
  return presentation.getSlides().length;
}

/**
* Get the name of the current slides.
*/
function getPresentationName() {
  return SlidesApp.getActivePresentation().getName();
}

/**
* Creates a copy of the current active slide and returns the ID of the duplicate.
*/
function duplicatePresentation() {
  return DriveApp.getFilesByName(
    this.getPresentationName()
  ).next().makeCopy(
    this.getPresentationName() + ' Translated'
  ).getId();
}

/**
 * Gets the id of the active presentation.
 */
function getPresentationId() {
  return SlidesApp.getActivePresentation().getId();
}

/**
 * Prepares the data for translation by creating a 
 * JSON object with the content that is set for translation.
 *
 * @param content {string} - data to be sent to the wezen API
 * @param contextId {string} - the value to be set in the customerContext_id attribute
 * @param targetLanguage {string} - the target language of the translation.
 *
 * * @returns {
 *              {
 *                targetLanguages: [*],
 *                customerContext_jobId: *,
 *                personalData: boolean,
 *                name: string,
 *                fragments: [
 *                  {
 *                    maxCharCount: number,
 *                    sourceContent: *,
 *                    localizations: {},
 *                    htmlAllowed: boolean,
 *                    maxExpansionRatio: number,
 *                    name: string,
 *                    key: string,
 *                    translationContext: {}
 *                   }
 *                 ],
 *                tag: {},
 *                customerContext_id: *,
 *                urgent: boolean,
 *                sourceLanguage: string,
 *                labels: [string],
 *                translationContext: {}
 *                }
 *              }
 */
function createJsonPayload(content, contextId, targetLanguage) {
    return translate = {
      "customerContext_id": contextId,
      "customerContext_jobId": contextId,
      "name": "",
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
        targetLanguage
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
 * Prepares the data for estimation by creating a JSON object.
 *
 * @param content {string} - data to be sent to the wezen API
 *
 * @returns {
 *           {
 *            targetLanguages: [string],
 *            fragments: [
 *              {
 *                maxCharCount: number,
 *                sourceContent: *,
 *                localizations: {},
 *                htmlAllowed: boolean,
 *                maxExpansionRatio: number,
 *                name: string,
 *                key: string,
 *                translationContext: {}
 *              }],
 *              urgent: boolean,
 *              sourceLanguage: string
 *            }
 *           }
 */
function createEstimateJsonPayload(content) {
  return estimate =  {
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
    "sourceLanguage": "fr-FR",
    "targetLanguages": [
      "en-US"
    ],
    "urgent": true
  }
}

/**
 * Replaces the content of text boxes inside each slide of a presentation 
 * with the data fetched from the wezen API
 *
 * @param presentationCopyId {string} - the Id of the duplicate presentation
 * @param slideId {string} - the id of the slide to compare to
 * @param shapeId {string} - the id of the shape to compare to
 * @param content {string} - the content received from wezen API
 */
function replacePresentationContent(presentationCopyId, slideId, shapeId, content) {
  try {
     var presentationCopy = SlidesApp.openById(presentationCopyId);
    var slidesCopy = presentationCopy.getSlides();
    
    for (var i = 0; i < this.getSlidesCount(presentationCopy); i++) {
      var slideCopy = slidesCopy[i];
      var slidesCopyId = slideCopy.getObjectId();
      var shapesCopy = slideCopy.getShapes();
      
      if (slidesCopyId === slideId) {
        for (var j = 0; j < shapesCopy.length; j++) {
          if (shapesCopy[j].getObjectId() === shapeId) {
            var textRange = shapesCopy[j].getText();
            textRange.setText(content);
          }
        }
      }
    }
  } catch(e) {
    console.error(e);
  }
}