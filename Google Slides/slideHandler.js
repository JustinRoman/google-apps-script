/**
 * Adds HTML tags based on the text formatting of each word inside a text-box shape.
 *
 * @param {string} url - 
 * @param {string} apiKey - unique identifier to authenticate a user.
 * @param {string} targetLanguage - the target translation locale
 */
function formatPresentation(url, apiKey, targetLanguage) {
  try {
    var presentation = SlidesApp.openById(this.getPresentationId());
    var slides = presentation.getSlides();
    var output = [],
        listCounters = [];
        
    for (var i = 0; i < this.getSlidesCount(presentation); i++) {
      var slide = slides[i];
      var shapes = slide.getShapes();
      
      output.push('<div data-slide="' + slides[i].getObjectId() + '">');
      
      for (var j = 0; j < shapes.length; j++) {
        if (shapes[j].getShapeType() === SlidesApp.ShapeType.TEXT_BOX) {
          var textRange = shapes[j].getText();
          var runs = textRange.getRuns();

          output.push('<div data-shape="' + shapes[j].getObjectId() + '">');
          output.push(this.fromatShapesToHtml(runs, output));
          output.push('</div>');
        }
      }
      output.push('</div>');
    }
    
    //removes empty tags
    var outputString = output.join('').replace(/<(\w+)\b(?:\s+[\w\-.:]+(?:\s*=\s*(?:"[^"]*"|"[^"]*"|[\w\-.:]+))?)*\s*\/?>\s*<\/\1\s*>/g, '');
    //Removes all line breaks from string
    var cleanOutput = outputString.replace(/\r?\n|\r/g, ' ');

   var payload = this.createJsonPayload(
     cleanOutput,
     this.getPresentationName(),
     targetLanguage
   );

   this.createTranslate(payload, apiKey, url);
    
   SlidesApp.getUi().alert('Presentation sent for translation!');
  } catch(e) {
    console.error(e);
  }
}

/**
 * Iterates through the translation and replaces the content with its translation.
 */
function processSlideCopy() {
  try {
    if(this.isDelivered(this.getPresentationName())) {
      // regex to get attributes of divs
      const REGEX_SLIDE_ID = /data-slide="([^"]*)"/;
      // regex to get attributes of paragraphs
      const REGEX_SHAPE_ID = /data-shape="([^"]*)"/;
      // regex to get the span inside the paragraphs
      const REGEX_SPANS = /<span.*?>(.*?)<\/span>/g;
      var contentObj = JSON.parse(this.fetchTranslate(this.getPresentationName()));
      var translation = contentObj['fragments'][0].localizations['fr-FR'];
      // regex to get all by divs and creates array out of the result
      var divsArray = translation.match(/<div.*?>.*?<\/div>/g);
      var presentation = SlidesApp.openById(this.duplicatePresentation());
      var slides = presentation.getSlides();
      var matchSlide, matchShape;
      
      //  Loop for the slides of a presentation
      for (var i = 0; i < this.getSlidesCount(presentation); i++) {
        var slide = slides[i];
        var slideId = slide.getObjectId();
        var shapes = slide.getShapes();
        
        if((matchSlide = REGEX_SLIDE_ID.exec(divsArray[i])) !== null) {
          if (matchSlide[1] === slideId) {
            var paragraphs = divsArray[i].match(/<p.*?>.*?<\/p>/g);
            
            // Loop for the shapes inside a slide
            for (var j = 0; j < shapes.length; j++) {
              if (shapes[j].getShapeType() === SlidesApp.ShapeType.TEXT_BOX) {
                if ((matchShape = REGEX_SHAPE_ID.exec(paragraphs[j])) !== null) {
                  if(matchShape[1] === shapes[j].getObjectId()) {
                    var runs = shapes[j].getText().getRuns();
                    
                    this.replaceContent(runs, paragraphs[j].match(REGEX_SPANS));
                  }
                }
              }
            }
          }
        }
      }
      
      SlidesApp.getUi().alert('Translation Finished!');
    } else {
      SlidesApp.getUi().alert('Translation is in Progress');
    }
  } catch(e) {
    console.error(e);
  }
}

/**
 * Processes the text-boxes within a presentation depending on there text formatting.
 * 
 * @param runs {array} - the text runs that overlap the current text range
 * @param spans {array} - paragraphs that was translated.
 */
function replaceContent(runs, spans) {
  try {
    // regex to get the specific attribute (specifically inside a span)
    const REGEX_ATTR = /data-style="([^"]*)"/;
    // regex to get the span inside the paragraphs
    const REGEX_SPAN = /<span.*?>(.*?)<\/span>/;
    var matchSpan, matchAttr;
    
    runs = this.filterRuns(runs);
    
    if (runs.length === spans.length) {
      for (var i = 0; i < runs.length; i++) {
        if ((matchSpan = REGEX_SPAN.exec(spans[i])) !== null) {
          if ((matchAttr = REGEX_ATTR.exec(spans[i])) !== null) {
            this.fromatText(runs[i], matchSpan[1], matchAttr[1]);
          }
        }
      }
    }
  } catch(e) {
    console.error(e);
  }
}