function document() {
  var doc = DocumentApp.openById(CacheService.getUserCache().get('docId')).getBody();
  var numChildren = doc.getNumChildren();
  var output = [], 
      images = [], 
      listCounters = [];
  
  for (var i = 0; i < numChildren; i ++) {
    var child = doc.getChild(i);
    output.push(this.processDocument(child, listCounters, images));
  }
  
  var html = output.join('\n');
  
  return output;
}

/**
 * Checks and process the document to add necessary tags depending on the text formatting.
 *
 * @param item {object} - the number of children inside a document
 * @param listCounters {array}
 * @param images {array}
 */
function processDocument(item, listCounters, images) {
  var output = [];
  var prefix = '', suffix = '';

  if (item.getType() == DocumentApp.ElementType.PARAGRAPH) {
    switch(item.getHeading()) {
      case DocumentApp.ParagraphHeading.HEADING6:
        prefix = '<h6>', suffix = '</h6>'; 
        break;
      case DocumentApp.ParagraphHeading.HEADING5:
        prefix = '<h5>', suffix = '</h5>'; 
        break;
      case DocumentApp.ParagraphHeading.HEADING4:
        prefix = '<h4>', suffix = '</h4>'; 
        break;
      case DocumentApp.ParagraphHeading.HEADING3:
        prefix = '<h3>', suffix = '</h3>'; 
        break;
      case DocumentApp.ParagraphHeading.HEADING2:
        prefix = '<h2>', suffix = '</h2>'; 
        break;
      case DocumentApp.ParagraphHeading.HEADING1:
        prefix = '<h1>', suffix = '</h1>'; 
        break;
      default:
        prefix = '<p>', suffix = '</p>';
    }
    
    if (item.getNumChildren == 0) {
      return "";
    }
  } else if (item.getType() == DocumentApp.ElementType.INLINE_IMAGE) {
    this.processImage(item, images, output);
  } else if (item.getType() == DocumentApp.ElementType.LIST_ITEM) {
    var listItem = item;
    var glyphType = listItem.getGlyphType();
    var key = listItem.getListId() + '.' + listItem.getNestingLevel();
    var counter = listCounters[key] || 0;
    
    if (counter == 0) {
      if (glyphType == DocumentApp.GlyphType.BULLET || 
          glyphType == DocumentApp.GlyphType.HOLLOW_BULLET ||
          glyphType == DocumentApp.GlyphType.SQUARE_BULLET
         ) {
        prefix = '<ul><li>', suffix = '</li>';
        
        suffix += '</ul>';
      } else {
        prefix = '<ol><li>', suffix = '</li>';
      }
    } else {
      prefix = '<li>';
      suffix = '</li>';
    }
    
    if (
      item.isAtDocumentEnd() || 
      (item.getNextSibling() && 
      (item.getNextSibiling().getType() != DocumentApp.ElementType.LIST_ITEM))
      ) {
      if (glyphType == DocumentApp.GlyphType.BULLET || 
          glyphType == DocumentApp.GlyphType.HOLLOW_BULLET ||
          glyphType == DocumentApp.GlyphType.SQUARE_BULLET
         ) {
        suffix += '</ul>';
      } else {
        suffix += '</ol>';
      }
    }
    
    counter++;
    listCounters[key] = counter;
  }
  
  output.push(prefix);
  
  if(item.getType() == DocumentApp.ElementType.TEXT) {
    this.processText(item, output);
  } else {
    if(item.getNumChildren) {
      var numChildren = item.getNumChildren();
      
      for (var i = 0; i < numChildren; i++) {
        var child = item.getChild(i);
        output.push(this.processDocument(child, listCounters, images));
      }
    }
  }
  
  output.push(suffix);
  return output.join('');
}

/**
 * Process the text and adds the necessary tags.
 *
 * @param item {array} - a child inside a document
 * @param output {array} - where we push our processed text
 */
function processText(item, output) {
  var text = item.getText();
  var indices = item.getTextAttributeIndices();
  
  if (indices.length <= 1) {
    if (item.isBold()) {
      output.push('<strong>' + text + '</strong>');
    } else if (item.isItalic) {
      output.push('<blockquote>' + text + '</blockquote>');
    } else if (text.trim().indexOf('http://') == 0) {
      output.push('<a href="' + text + '" rel="nofollow">' + text + '</a>');
    } else {
      output.push(text);
    }
  } else {
    for (var i = 0; i < indices.length; i++) {
      var partAtts = item.getAttributes(indices[i])
      var offset = indices[i];
      var startPosition = offset;
      var endPosition = i + 1 < indices.length ? indices[i + 1] : text.length;
      var partText = text.substring(startPosition, endPosition);
      
      if (partAtts.BOLD) {
        output.push('<strong>');
      }
      if (partAtts.ITALIC) {
        output.push('<i>');
      }
      if (partAtts.UNDERLINE) {
        output.push('<u>');
      }
      if(partAtts.STRIKETHROUGH) {
        output.push('<s>');
      }
      if(partAtts.SUPERSCRIPT) {
        output.push('<sup>' + partText + '</sup>');
      }
      if(partAtts.SUBSCRIPT) {
        output.push('<sub>' + partText + '</sub>');
      }
      
      output.push(partText.replace(/\s/g, ''));
      
      if (partAtts.BOLD) {
        output.push(' </strong>');
      }
      if (partAtts.ITALIC) {
        output.push(' </i>');
      }
      if (partAtts.UNDERLINE) {
        output.push('</u>');
      }
      if(partAtts.STRIKETHROUGH) {
        output.push('</s>');
      }
    }
  }
}

function processImage() {
  
}