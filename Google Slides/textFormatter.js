/**
 * Sets the text formatting to bold and replaces the text with the translated value.
 *
 * @param run {object} - is a segment of text where all the characters have the same text style.
 * @param matchSpan {string} - the text between span tags
 **/
function setToBold(run, matchSpan) {
  try {
    run.setText(matchSpan);
    run.getTextStyle().setBold(true);
  } catch (e) {
    console.error(e);
  }
}

/**
 * Sets the text formatting  to italic and replaces the text with the translated value.
 *
 * @param run {object} - is a segment of text where all the characters have the same text style.
 * @param matchSpan {string} - the text between span tags
 **/
function setToItalic(run, matchSpan) {
  try {
    run.setText(matchSpan);
    run.getTextStyle().setItalic(true);
  } catch (e) {
    console.error(e);
  }
}

/**
 * Sets text formatting  to strikethrough and eplaces the text with the translated value.
 *
 * @param run {object} - is a segment of text where all the characters have the same text style.
 * @param matchSpan {string} - the text between span tags
 **/
function setToStrikethrough(run, matchSpan) {
  try {
    run.setText(matchSpan);
    run.getTextStyle().setStrikethrough(true);
  } catch (e) {
    console.error(e);
  }
}

/**
 * Sets text formatting to underline and replaces the text with the translated value.
 *
 * @param run {object} - is a segment of text where all the characters have the same text style.
 * @param matchSpan {string} - the text between span tags
 **/
function setToUnderline(run, matchSpan) {
  try {
    run.setText(matchSpan);
    run.getTextStyle().setUnderline(true);
  } catch (e) {
    console.error(e);
  }
}

/**
 * Replaces the text with the translated value.
 *
 * @param run {object} - is a segment of text where all the characters have the same text style.
 * @param matchSpan {string} - the text between span tags
 **/
function setNormalText(run, matchSpan) {
  try {
    run.setText(matchSpan);
  } catch (e) {
    console.error(e);
  }
}
