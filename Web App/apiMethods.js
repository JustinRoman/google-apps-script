/**
 * To POST data to wezen API
 *
 * @param payload {object} - the data to be sent for translation formatted as an object
 * @param apiKey {string} - unique identifier to authenticate a user.
 * @param url {string} - api url to make request to.
 */
function createTranslate(payload, apiKey, url) {
  try {
    var options = {
      'method': 'POST',
      'contentType': 'application/json',
      'payload': JSON.stringify(payload)
    }
    
    UrlFetchApp.fetch(
      url + '/api/translate/document?api_key=' + apiKey, 
      options
    );
  } catch(e) {
    console.log('Timed out: Restarting! ' + e.toString());
  }
}