/**
 * Processes the text-boxes within a presentation depending on there text formatting.
 * 
 * @param runs {array} - cotains the runs inside a presentations textbox
 * @param output {array} -  the array that will contain the final output
 */
function fromatShapesToHtml(runs, output) {
  try {
    for (var i = 0; i < runs.length; i++) {
     if (runs[i].asString() !== ' ') {
       if (runs[i].getTextStyle().isBold()) {
         output.push('<span data-style=' + '"strong">');
       }
       if(runs[i].getTextStyle().isItalic()) {
         output.push('<span data-style=' + '"italic">');
       }
       if (runs[i].getTextStyle().isStrikethrough()) {
         output.push('<span data-style=' + '"strikethrough">');
       }
       if (runs[i].getTextStyle().isUnderline()) {
         output.push('<span data-style=' + '"underline">');
       }
       if(!runs[i].getTextStyle().isBold() &&
          !runs[i].getTextStyle().isItalic() &&
         !runs[i].getTextStyle().isStrikethrough() &&
           !runs[i].getTextStyle().isUnderline()) {
             output.push('<span data-style=' + '"normal">');
           }

       output.push()

       if (runs[i].getTextStyle().isBold()) {
         output.push('</span>');
       }
       if(runs[i].getTextStyle().isItalic()) {
         output.push('</span>');
       }
       if (runs[i].getTextStyle().isStrikethrough()) {
         output.push('</span>');
       }
       if (runs[i].getTextStyle().isUnderline()) {
         output.push('</span>')
       }
       if(!runs[i].getTextStyle().isBold() &&
          !runs[i].getTextStyle().isItalic() &&
         !runs[i].getTextStyle().isStrikethrough() &&
           !runs[i].getTextStyle().isUnderline()) {
             output.push('</span>');
           }
     }
    }
  } catch(e) {
    console.error(e);
  }
}

/**
 * Sets the contents text formatting depending on the attribute present in each span.
 * 
 * @param run {object} - is a segment of text where all the characters have the same text style.
 * @param matchSpan {string} - the text between span tags
 * @param matchAttr {string} - the attribute inside a span
 */
function fromatText(run, matchSpan, matchAttr) {
  try {
    if (run.getTextStyle().isBold() && matchAttr === 'strong') {
      this.setToBold(run, matchSpan);
    }
    
    if (run.getTextStyle().isItalic() && matchAttr === 'italic') {
      this.setToItalic(run, matchSpan);
    }
    
    if (run.getTextStyle().isStrikethrough() && matchAttr === 'strikethrough') {
      this.setToStrikethrough(run, matchSpan);
    }
    
    if (run.getTextStyle().isUnderline() && matchAttr === 'underline') {
      this.setToUnderline(run, matchSpan);
    }
  
    if (!run.getTextStyle().isBold() && !run.getTextStyle().isItalic() && 
      !run.getTextStyle().isStrikethrough() && !run.getTextStyle().isUnderline() && 
        matchAttr === 'normal'
    ) {
      this.setNormalText(run, matchSpan);
    }
  } catch(e) {
    console.error(e);
  }
}

/**
 * Removes blank spaces and newlines from the runs.
 * 
 * @param runs {array} - the text runs that overlap the current text range
 */
function filterRuns(runs) {
  try {
    for (var i = 0; i < runs.length; i++) {
      if (runs[i].asString() === ' ' || runs[i].asString() === '\n') {
        runs.splice(i, 1);
      }
    }
  } catch(e) {
    console.error(e);
  }
  
  return runs;
}