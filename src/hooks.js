/**
 * @method selection
 * Exposes, preserves and restores cursor selection range in ContentEditable
 *
 * @type {{save: Core.selection.save, restore: Core.selection.restore, insert: Core.selection.insert}}
 */

exports.Hooks = {

  save: function (el) {
    if (!el) {
      return;
    }
    var start, end;
    if (window.getSelection && document.createRange) {
      if (window.getSelection().type === 'NONE' || window.getSelection().rangeCount === 0) {
        return;
      }
      var range = window.getSelection().getRangeAt(0);
      var preSelectionRange = range.cloneRange();

      preSelectionRange.selectNodeContents(el);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      start = preSelectionRange.toString().length;
      end = start + range.toString().length;

      return {
        start: start,
        end: end
      };
    } else if (document.selection && document.body.createTextRange) {
      var selectedTextRange = document.selection.createRange();
      var preSelectionTextRange = document.body.createTextRange();

      preSelectionTextRange.moveToElementText(el);
      preSelectionTextRange.setEndPoint('EndToStart', selectedTextRange);
      start = preSelectionTextRange.text.length;
      end = start + selectedTextRange.text.length;

      return {
        start: start,
        end: end
      };
    }
  },

  restore: function (el, saved_range) {
    if (!el || !saved_range) {
      return;
    }
    if (window.getSelection && document.createRange) {
      var charIndex = 0;
      var range = document.createRange();

      range.setStart(el, 0);
      range.collapse(true);

      var nodeStack = [el];
      var node = null;
      var foundStart = false;
      var stop = false;

      while (!stop && (node = nodeStack.pop())) {
        if (node.nodeType === 3) {
          var nextCharIndex = charIndex + node.length;
          if (!foundStart && saved_range.start >= charIndex && saved_range.start <= nextCharIndex) {
            range.setStart(node, saved_range.start - charIndex);
            foundStart = true;
          }
          if (foundStart && saved_range.end >= charIndex && saved_range.end <= nextCharIndex) {
            range.setEnd(node, saved_range.end - charIndex);
            stop = true;
          }
          charIndex = nextCharIndex;
        } else {
          var i = node.childNodes.length;
          while (i--) {
            nodeStack.push(node.childNodes[i]);
          }
        }
      }

      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (document.selection && document.body.createTextRange) {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(true);
      textRange.moveEnd("character", saved_range.end);
      textRange.moveStart("character", saved_range.start);
      textRange.select();
    }
  },

  insert: function (text) {
    var sel, range, html;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();
        var textNode = document.createTextNode(text);
        range.insertNode(textNode);
        sel.removeAllRanges();
        range = range.cloneRange();
        range.selectNode(textNode);
        range.collapse(false);
        sel.addRange(range);
      }
    } else if (document.selection && document.selection.createRange) {
      range = document.selection.createRange();
      range.pasteHTML(text);
      range.select();
    }
  }
};