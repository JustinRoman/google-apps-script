/**
 * Stores simple data in key-value 
 * pairs scoped to one user of the script.
 * 
 * @param properties (object) - map of key value pairs
 */
function createProperties(properties) {
  PropertiesService.getUserProperties().setProperties(properties);
}

/**
 * Fetches all the properties scoped to one user of the script.
 *
 * @returns {*}
 */
function fetchProperties() {
  return PropertiesService.getUserProperties().getProperties();
}

/**
 * Fetches the apiKey from the properties object.
 *
 * @returns {*}
 */
function getApiKeyProperty() {
  return this.fetchProperties()['apiKey'];
}

/**
 * Fetches the url from the properties object.
 *
 * @returns {*}
 */
function getUrlProperty() {
  return this.fetchProperties()['url'];
}