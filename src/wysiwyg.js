'use strict';

/**
 * @class Redaktor
 *
 * @param {any} el
 * @param {any} options
 * @returns
 */
function Redaktor(el, options) {
  console.log('Redaktor', 'initialized', el, options);
  this.el = el;
  this.options = extend(Redaktor.defaults.options, options);
  this.range = null;
  this.events = {};

  this.build(this.el, this.options);

  return this;
}

/**
 * @method Defaults
 *
 * @type {object}
 */
Redaktor.defaults = {

  options: {
    style: true,
    toolbar: [],
    colors: [],
    templates: [],
    icons: {
      class: 'material-icons',
      definitions: {}
    }
  },

  toolbar: {

    format: {
      icon: 'title',
      label: 'Headline Format',
      command: 'formatBlock',
      dropdown: [{
          id: 'h1',
          label: 'Header 1'
        },
        {
          id: 'h2',
          label: 'Header 2'
        },
        {
          id: 'h3',
          label: 'Header 3'
        },
        {
          id: 'h4',
          label: 'Header 4'
        },
        {
          id: 'p',
          label: 'Paragraph'
        },
        {
          id: 'pre',
          label: 'Preformatted'
        },
        {
          id: 'blockquote',
          label: 'Quote'
        }
      ]
    },

    fontSize: {
      icon: 'format_size',
      label: 'Font Size',
      command: 'fontSize',
      dropdown: [{
          id: 1,
          label: 'Minimum'
        },
        {
          id: 2,
          label: 'Smaller'
        },
        {
          id: 3,
          label: 'Normal'
        },
        {
          id: 4,
          label: 'Medium'
        },
        {
          id: 5,
          label: 'Large'
        },
        {
          id: 6,
          label: 'Extra Large'
        },
        {
          id: 7,
          label: 'Maximum'
        }
      ]
    },

    fontColor: {
      icon: 'format_color_text',
      label: 'Font Color',
      command: 'foreColor',
      field: 'colors',
      modal: true
    },

    fontBackground: {
      icon: 'format_color_fill',
      label: 'Font Background',
      command: 'backColor',
      field: 'colors',
      modal: true
    },

    source: {
      icon: 'code',
      label: 'Show HTML',
      command: 'insertHTML',
      modal: true
    },

    undo: {
      icon: 'undo',
      label: 'Undo',
      command: 'undo'
    },

    redo: {
      icon: 'redo',
      label: 'Redo',
      command: 'redo'
    },

    reformat: {
      icon: 'format_clear',
      label: 'Remove Formatting',
      command: 'removeFormat'
    },

    bold: {
      icon: 'format_bold',
      label: 'Bold',
      command: 'bold'
    },

    italic: {
      icon: 'format_italic',
      label: 'Italic',
      command: 'italic'
    },

    underline: {
      icon: 'format_underlined',
      label: 'Underline',
      command: 'underline'
    },

    strike: {
      icon: 'format_strikethrough',
      label: 'Strike',
      command: 'strikeThrough'
    },

    leftAlign: {
      icon: 'format_align_left',
      label: 'Left Align',
      command: 'justifyLeft'
    },

    rightAlign: {
      icon: 'format_align_right',
      label: 'Right Align',
      command: 'justifyRight'
    },

    centerAlign: {
      icon: 'format_align_center',
      label: 'Center Align',
      command: 'justifyCenter'
    },

    fullAlign: {
      icon: 'format_align_justify',
      label: 'Justify',
      command: 'justifyFull'
    },

    numberedList: {
      icon: 'format_list_bulleted',
      label: 'Ordered List',
      command: 'insertOrderedList'
    },

    orderedList: {
      icon: 'format_list_bulleted',
      label: 'Unordered List',
      command: 'insertUnorderedList'
    },

    link: {
      icon: 'insert_link',
      label: 'Link',
      command: 'createLink',
      modal: true
    },

    unlink: {
      icon: 'wb_iridescent',
      label: 'Unlink',
      command: 'unlink'
    },

    image: {
      icon: 'camera_alt',
      label: 'Image',
      command: 'insertImage',
      modal: true
    },

    table: {
      icon: 'grid_on',
      label: 'Table',
      command: 'insertTable'
    },

    templates: {
      icon: 'description',
      label: 'Templates',
      command: 'template',
      field: 'templates',
      modal: true
    }
  },

  events: {

    on: function (event, listener) {
      if (typeof this.events[event] !== 'object') {
        this.events[event] = [];
      }

      this.events[event].push(listener);
    },

    off: function (event, listener) {
      var index;

      if (typeof this.events[event] === 'object') {
        index = this.events[event].indexOf(listener);

        if (index > -1) {
          this.events[event].splice(index, 1);
        }
      }
    },

    emit: function (event) {
      var i, listeners, length, args = [].slice.call(arguments, 1);

      if (typeof this.events[event] === 'object') {
        listeners = this.events[event].slice();
        length = listeners.length;

        for (i = 0; i < length; i++) {
          listeners[i].apply(this, args);
        }
      }
    },

    once: function (event, listener) {
      this.on(event, function g() {
        this.off(event, g);
        listener.apply(this, arguments);
      });
    }
  }

};

Redaktor.prototype = Object.create(Redaktor.defaults.events);

/**
 * @method build
 *
 * Builds Redaktor instance by handling DOM and Binding Events
 */
Redaktor.prototype.build = function () {
  console.log('Redaktor', 'build', this.el, this.options);
  // Defaults
  this.el.style.display = 'none';

  // Create Redaktor element
  this.redaktor_el = createElement('div', {
    class: 'redaktor-container'
  });

  // Create toolbar element
  this.toolbar_el = createElement('div', {
    class: 'redaktor-toolbar'
  }, getToolbarTemplate(Redaktor.defaults.toolbar, this.options));

  // Create content element
  this.editable_el = createElement('div', {
    class: 'redaktor-content',
    placeholder: 'Type something...',
    contenteditable: true
  }, this.el.value);

  // Create modal element
  this.modal_el = createElement('div', {
    class: 'redaktor-modal',
    style: 'z-index:999;'
  });

  this.modal_el.innerHTML = getModalTemplate();

  this.redaktor_el.appendChild(this.toolbar_el);
  this.redaktor_el.appendChild(this.editable_el);
  this.redaktor_el.appendChild(this.modal_el);
  this.el.parentNode.insertBefore(this.redaktor_el, this.el.nextSibling);

  this.editable_el.focus();

  this.connect(); // Connects DOM events

  // Toolbar Template
  function getToolbarTemplate(definitions, defaults) {
    console.log('Redaktor', 'getToolbarTemplate', definitions);
    var html = '';
    var enabled = [];

    for (var key in definitions) {
      if (definitions.hasOwnProperty(key)) {
        if (defaults.toolbar.indexOf(key) !== -1) {
          enabled.push({
            key: key,
            config: definitions[key]
          });
        }
      }
    }

    enabled.sort(function (a, b) {
      return (defaults.toolbar.indexOf(a.key) - defaults.toolbar.indexOf(b.key));
    });

    enabled.forEach(function (entity) {
      var config = entity.config;
      html += '<div class="redaktor-button-group">';

      if (config.modal) {
        html += '<button class="redaktor-toolbar_item" data-redaktor-field="' + config.field + '" ' +
          ' data-redaktor-label="' + config.label + '" data-redaktor-modal="' + config.command + '" unselectable="on">' +
          '<i class="' + defaults.icons.class + '">' + config.icon + '</i></button>';
      } else if (config.dropdown) {
        html += '<button class="redaktor-toolbar_item" data-redaktor-label="' + config.label + '" unselectable="on">' +
          '<i class="' + defaults.icons.class + '">' + config.icon + '</i></button>';
        html += getToolbarDropdown(config.dropdown, config.command);
      } else {
        html += '<button class="redaktor-toolbar_item" data-redaktor-command="' + config.command + '" ' +
          'data-redaktor-label="' + config.label + '" unselectable="on"><i class="' + defaults.icons.class + '">' +
          config.icon + '</i></button>';
      }

      html += '</div>';
    });

    return html;
  }

  // Toolbar Dropdown Template
  function getToolbarDropdown(attributes, command) {
    var html = '<div class="redaktor-toolbar_item_dropdown">';
    attributes.forEach(function (entity) {
      html += '<a href="javascript:void(0);" data-redaktor-value="' + entity.id + '" ' +
        'data-redaktor-command="' + command + '">' + entity.label + '</a>';
    });
    html += '</div>';
    return html;
  }

  // Modal Template
  function getModalTemplate(type) {
    var html = '';
    html += '<a href="javascript:void(0);" class="redaktor-modal-close" ' +
      'data-redaktor-modal="close"><i class="material-icons">clear</i></a>';
    html += '<form class="redaktor-modal-form"></form>';
    return html;
  }
};

/**
 * @method connect
 *
 * Connects DOM Events and emit necessary events
 */
Redaktor.prototype.connect = function () {
  console.log('Redaktor', 'connect', this.redaktor_el);
  var nativeCommands = this.toolbar_el.querySelectorAll('[data-redaktor-command]');
  var modalCommands = this.toolbar_el.querySelectorAll('[data-redaktor-modal]');
  var modalForm = this.modal_el.querySelector('.redaktor-modal-form');

  this.editable_el.addEventListener('input', function (event) {
    this.emit('change', this, this.getValue());
  }.bind(this), false);

  this.editable_el.addEventListener('paste', function (event) {
    this.emit('paste', this, this.getValue());
  }.bind(this), false);

  this.editable_el.addEventListener('cut', function (event) {
    this.emit('cut', this, this.getValue());
  }.bind(this), false);

  this.editable_el.addEventListener('copy', function (event) {
    this.emit('copy', this, this.getValue());
  }.bind(this), false);

  this.editable_el.addEventListener('focus', function (event) {
    this.emit('focus', this, this.getValue());
  }.bind(this), false);

  this.editable_el.addEventListener('blur', function (event) {
    this.emit('blur', this, this.getValue());
  }.bind(this), false);

  this.modal_el.querySelector('.redaktor-modal-close')
    .addEventListener('click', function (event) {
      this.selection.restore(this.editable_el, this.range);
      this.modal_el.style.display = 'none';
      this.emit('modalclosed', this.getValue());
      event.preventDefault();
    }.bind(this), false);

  this.modal_el.querySelector('.redaktor-modal-form')
    .addEventListener('submit', function (event) {
      event.preventDefault();
      var command = event.target.dataset.redaktorForm;
      var attributes = event.target.querySelectorAll('[name]') || [];
      var formData = Array.prototype.map.call(attributes, function (entity) {
        return {
          name: entity.getAttribute('name'),
          value: entity.value
        };
      });

      this.selection.restore(this.editable_el, this.range);
      this.modal_el.style.display = 'none';

      if (!formData) {
        return;
      }

      if (command === 'insertImage') {
        var image = '<img src="' + formData[0].value + '"';
        if (!isNaN(formData[1].value)) {
          image += ' width="' + parseInt(formData[1].value, 10) + '"';
        }
        if (!isNaN(formData[2].value)) {
          image += ' height="' + parseInt(formData[2].value, 10) + '"';
        }
        image += '/>';
        this.execute('insertHTML', image);
      } else if (command === 'insertHTML') {
        this.setValue(formData[0].value);
      } else {
        this.execute(command, formData[0].value);
      }
      this.emit('update', this.getValue());
      event.preventDefault();
    }.bind(this), false);

  /**
   * @event commands
   * Runs native browser contenteditable manipulation commands
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#Commands
   */
  Array.prototype.forEach.call(nativeCommands, function (action) {
    action.addEventListener('mousedown', function (e) {
      e.preventDefault();
      this.range = this.selection.save(this.editable_el);
      if (action.dataset.redaktorCommand === 'insertTable') {
        this.execute('insertHTML', (
          '<table><tbody>' +
          '<tr><td>--</td><td>--</td><td>--</td></tr>' +
          '<tr><td>--</td><td>--</td><td>--</td></tr>' +
          '<tr><td>--</td><td>--</td><td>--</td></tr>' +
          '<tr><td>--</td><td>--</td><td>--</td></tr>' +
          '<tr><td>--</td><td>--</td><td>--</td></tr>' +
          '</tbody></table>'
        ));
      } else {
        this.execute(action.dataset.redaktorCommand, action.dataset.redaktorValue);
      }
      this.emit('update', this.getValue());
    }.bind(this), false);
  }.bind(this));

  /**
   * @event Modal Insert Commands
   */
  Array.prototype.forEach.call(modalCommands, function (action) {
    action.addEventListener('mousedown', function (e) {
      e.preventDefault();
      var form = '';
      var modal_command = action.dataset.redaktorModal;

      this.range = this.selection.save(this.editable_el);
      this.modal_el.style.display = 'block';
      modalForm.setAttribute('data-redaktor-form', modal_command);
      modalForm.reset();

      switch (modal_command) {
        case 'foreColor':
          modalForm.style.minWidth = 'inherit';
          form += '<input type="text" name="color" placeholder="Enter HEX or RGBA"/></div>';
          form += '<div class="redaktor-form-block"><input type="submit" value="Apply Font Color"/></div>';
          break;
        case 'backColor':
          modalForm.style.minWidth = 'inherit';
          form += '<input type="text" name="color" placeholder="Enter HEX or RGBA"/>';
          form += '<div class="redaktor-form-block"><input type="submit" value="Apply Fill Color"/></div>';
          break;
        case 'createLink':
          modalForm.style.minWidth = '70%';
          form += '<input type="text" name="url" placeholder="Enter URL"/>';
          form += '<div class="redaktor-form-block"><input type="submit" value="Add Link"/></div>';
          break;
        case 'templates':
          modalForm.style.minWidth = '70%';
          form += '<select name="template"></select>';
          form += '<div class="redaktor-form-block"><input type="submit" value="Add Selected Template"/></div>';
          break;
        case 'insertImage':
          modalForm.style.minWidth = '75%';
          form += '<input type="text" name="image" style="width:69%;" placeholder="Enter Image URL"/>';
          form += '<input type="text" name="width" style="width:14%;" placeholder="Width"/>';
          form += '<input type="text" name="height" style="width:14%;" placeholder="Height"/>';
          form += '<div class="redaktor-form-block"><input type="submit" value="Insert Image"/></div>';
          break;
        case 'insertHTML':
          modalForm.style.minWidth = '90%';
          form += '<textarea class="redaktor-source-html" name="insertHTML">' + this.getValue() + '</textarea>';
          form += '<div class="redaktor-form-block"><input type="submit" value="Apply HTML"/></div>';
          break;
      }

      modalForm.innerHTML = form;
      this.emit('modalopened', this.getValue());
    }.bind(this), false);
  }.bind(this));
};

/**
 * @method getValue
 *
 * Returns HTML value for ContentEditable
 *
 * @returns {*|any|string|string}
 */
Redaktor.prototype.getValue = function () {
  return this.editable_el.innerHTML;
};

/**
 * @method setValue
 *
 * Sets value passed along in ContentEditable
 *
 * @param value
 */
Redaktor.prototype.setValue = function (value) {
  this.editable_el.innerHTML = value;
};

/**
 * @method destroy
 *
 * Removes instance of Redaktor from the DOM and clear events
 *
 * @param value
 */
Redaktor.prototype.destroy = function (value) {
  this.el.style.display = 'block';
  this.toolbar_el.remove();
  this.editable_el.remove();
  this.redaktor_el.remove();
  this.emit('destroy', this.getValue());
};

/**
 * @private
 * @method execute
 *
 * Commands DOM to perform operations
 *
 * @param command
 * @param value
 */
Redaktor.prototype.execute = function (command, value) {
  console.log('Redaktor', 'execute', command, value, this.range);
  value = (typeof value === 'undefined') ? '' : value;
  document.execCommand(command, false, value);
};

/**
 * @method selection
 *
 * Exposes, preserves and restores cursor selection range in ContentEditable
 *
 * @type {{save: Redaktor.selection.save, restore: Redaktor.selection.restore, insert: Redaktor.selection.insert}}
 */
Redaktor.prototype.selection = {

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

/**
 * @method il18n
 *
 * Translation Data
 */
Redaktor.prototype.il18n = function () {};

/**
 * @function Validate Element
 *
 * @param {any} obj
 * @returns
 */
function validateElement(obj) {
  try {
    return obj instanceof window.HTMLElement;
  } catch (e) {
    return (typeof obj === "object") &&
      (obj.nodeType === 1) && (typeof obj.style === "object") &&
      (typeof obj.ownerDocument === "object");
  }
}

/**
 * @function Create Element
 *
 * @param {any} tagName
 * @param {any} attributes
 * @param {any} html
 * @returns
 */
function createElement(tagName, attributes, html) {
  var el = document.createElement('div');

  for (var key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      el.setAttribute(key, attributes[key]);
    }
  }

  el.innerHTML = html || '';

  return el;
}

/**
 * @function Object Extend
 *
 * @param {any} a
 * @param {any} b
 * @returns
 */
function extend(a, b) {
  for (var key in b) {
    if (b.hasOwnProperty(key)) {
      a[key] = b[key];
    }
  }
  return a;
}

/**
 * @function Object to CSS converter
 *
 * @param {any} obj
 * @returns
 */
function objectToCss(obj) {
  var css = '';
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var props = obj[key];

      css += key + '{' + addCssRules(props) + '}';
    }
  }
  return css;

  function addCssRules(props) {
    var rule = '';
    for (var key in props) {
      if (props.hasOwnProperty(key)) {
        rule += key + ':' + props[key] + ';';
      }
    }
    return rule;
  }
}

return Redaktor;