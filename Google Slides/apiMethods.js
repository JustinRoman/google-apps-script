/**
 * Get translation status.
 *
 * @param contextId {string} - the ID to use as reference to check if the translation is delivered.
 * @returns {*}
 */
function getTranslationStatus(contextId) {
  try {
    contextId = contextId || this.getPresentationName();
  
    var response =  UrlFetchApp.fetch(
      'https://sandbox.wezen.com/api/translate/document/status?customerContext_id=' 
      + contextId + 
      '&customerContext_jobId='
      + contextId + 
      '&api_key=phDev-369b20512cea'
    );
    
    response = JSON.parse(response);
  } catch(e) {
    console.error(e);
  }
  
  return response.status['fr-FR'];
}

/**
 * Fetches the translation target language from wezen API.
 *
 * @returns {string}
 */
function getTranslationTargetLanguage() {
  var response = UrlFetchApp.fetch(
    'https://sandbox.wezen.com/api/translate/document/status?customerContext_id=' 
      + this.getPresentationName() + 
      '&customerContext_jobId='
      + this.getPresentationName() + 
      '&api_key=phDev-369b20512cea'
  );
  
  response = JSON.parse(response);
  response = response['status'];
  var targetLanguage = Object.keys(response);
  
  return targetLanguage[0];
}

/**
 * Check translation status.
 *
 * @param contextId {string} - the ID to use as reference to check if the translation is delivered.
 *
 * @returns {boolean}
 */
function isDelivered(contextId) {
  try {
    var response = this.getTranslationStatus(contextId);
  } catch(e) {
    console.error(e);
  }
  
  return response === 'Delivered';
}

/**
 * To GET data from wezen API
 *
 * @param contextId {string} - the ID to use as reference to get the proper translation task.
 *
 * @returns {*|Promise<Response>}
 */
function fetchTranslate(contextId) {
  return UrlFetchApp.fetch(
    'https://sandbox.wezen.com/api/translate/document?customerContext_id='
    + contextId +
    '&api_key=phDev-369b20512cea'
  );
}

/**
 * To POST data to wezen API
 *
 * @param payload {object} - the data to be sent for translation formatted as an object
 * @param apiKey {string} - unique identifier to authenticate a user.
 * @param url {string} - the url where we send the request.
 */
function createTranslate(payload, apiKey, url) {
  var options = {
    'method': 'POST',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch(
    url + '/api/translate/document?api_key=' + apiKey, 
    options
  );
}

/**
 * To POST data to wezen API for translation
 * 
 * @param payload {object} - data to be sent for estimation.
 *
 * @returns {*|Promise<Response>}
 */
function createEstimate(payload) {
  var options = {
    'method': 'POST',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };
  
  var response = UrlFetchApp.fetch(
    'https://sandbox.wezen.com/api/translate/document/estimate?api_key=phDev-369b20512cea',
    options
  );
  
  response = JSON.parse(response);

  return response;
}

/**
 * Gets an estimate by feeding the wezen API the content of the slides and sending it.
 *
 * @returns {*|Promise<Response>}
 */
function getEstimate() {
  var presentation = SlidesApp.openById(this.getPresentationId());
  var slides = presentation.getSlides();
  var output = [];
  
  for (var i = 0; i < this.getSlidesCount(presentation); i++) {
    var slide = slides[i];
    var shapes = slide.getShapes();
    
    for (var j = 0; j< shapes.length; j++) {
      if (shapes[j].getShapeType() === SlidesApp.ShapeType.TEXT_BOX) {
        var textRange = shapes[j].getText();
        
        output.push(textRange.asString());
      }
    }
  }

  output = output.join('').replace(/\r?\n|\r/g, ' ');

  var estimatePayload = this.createEstimateJsonPayload(output, this.getPresentationName());
  var estimateObj = this.createEstimate(estimatePayload);
  
  CacheService.getUserCache().put('estimate', estimateObj, 21600);
  
  return estimateObj;
}