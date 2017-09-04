/**
 * @file core.js
 */

import Defaults from './defaults.js';
import Hooks from './hooks.js';
import Utils from './utils.js';

/**
 * @class Core
 *
 * @param {any} el
 * @param {any} options
 * @returns
 */
export default class Core {

  constructor(el, options) {
    console.log('Core', 'initialized', el, options, Defaults, Utils);

    this.el = el;
    this.options = Utils.extend(Defaults.options, options);
    this.range = null;
    this.events = {};

    this.build(this.el, this.options);
  }

  /**
   * @method build
   *
   * Builds Core instance by handling DOM and Binding Events
   */
  build() {
    console.log('Core', 'build', this.el, this.options);
    // Defaults
    this.el.style.display = 'none';

    // Create Core element
    this.wysiwygy_el = Utils.createElement('div', {
      class: 'wysiwygy-container'
    });

    // Create toolbar element
    this.toolbar_el = Utils.createElement('div', {
      class: 'wysiwygy-toolbar'
    }, getToolbarTemplate(Defaults.toolbar, this.options));

    // Create content element
    this.editable_el = Utils.createElement('div', {
      class: 'wysiwygy-content',
      placeholder: 'Type something...',
      contenteditable: true
    }, this.el.value);

    // Create modal element
    this.modal_el = Utils.createElement('div', {
      class: 'wysiwygy-modal',
      style: 'z-index:999;'
    });

    this.modal_el.innerHTML = getModalTemplate();

    this.wysiwygy_el.appendChild(this.toolbar_el);
    this.wysiwygy_el.appendChild(this.editable_el);
    this.wysiwygy_el.appendChild(this.modal_el);
    this.el.parentNode.insertBefore(this.wysiwygy_el, this.el.nextSibling);

    this.editable_el.focus();

    this.connect(); // Connects DOM events

    // Toolbar Template
    function getToolbarTemplate(definitions, defaults) {
      console.log('Core', 'getToolbarTemplate', definitions);
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
        html += '<div class="wysiwygy-button-group">';

        if (config.modal) {
          html += '<button class="wysiwygy-toolbar_item" data-wysiwygy-field="' + config.field + '" ' +
            ' data-wysiwygy-label="' + config.label + '" data-wysiwygy-modal="' + config.command + '" unselectable="on">' +
            '<i class="' + defaults.icons.class + '">' + config.icon + '</i></button>';
        } else if (config.dropdown) {
          html += '<button class="wysiwygy-toolbar_item" data-wysiwygy-label="' + config.label + '" unselectable="on">' +
            '<i class="' + defaults.icons.class + '">' + config.icon + '</i></button>';
          html += getToolbarDropdown(config.dropdown, config.command);
        } else {
          html += '<button class="wysiwygy-toolbar_item" data-wysiwygy-command="' + config.command + '" ' +
            'data-wysiwygy-label="' + config.label + '" unselectable="on"><i class="' + defaults.icons.class + '">' +
            config.icon + '</i></button>';
        }

        html += '</div>';
      });

      return html;
    }

    // Toolbar Dropdown Template
    function getToolbarDropdown(attributes, command) {
      var html = '<div class="wysiwygy-toolbar_item_dropdown">';
      attributes.forEach(function (entity) {
        html += '<a href="javascript:void(0);" data-wysiwygy-value="' + entity.id + '" ' +
          'data-wysiwygy-command="' + command + '">' + entity.label + '</a>';
      });
      html += '</div>';
      return html;
    }

    // Modal Template
    function getModalTemplate(type) {
      var html = '';
      html += '<a href="javascript:void(0);" class="wysiwygy-modal-close" ' +
        'data-wysiwygy-modal="close"><i class="material-icons">clear</i></a>';
      html += '<form class="wysiwygy-modal-form"></form>';
      return html;
    }
  };

  /**
   * @method connect
   *
   * Connects DOM Events and emit necessary events
   */
  connect() {
    console.log('Core', 'connect', this.wysiwygy_el);
    var nativeCommands = this.toolbar_el.querySelectorAll('[data-wysiwygy-command]');
    var modalCommands = this.toolbar_el.querySelectorAll('[data-wysiwygy-modal]');
    var modalForm = this.modal_el.querySelector('.wysiwygy-modal-form');

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

    this.modal_el.querySelector('.wysiwygy-modal-close')
      .addEventListener('click', function (event) {
        this.selection.restore(this.editable_el, this.range);
        this.modal_el.style.display = 'none';
        this.emit('modalclosed', this.getValue());
        event.preventDefault();
      }.bind(this), false);

    this.modal_el.querySelector('.wysiwygy-modal-form')
      .addEventListener('submit', function (event) {
        event.preventDefault();
        var command = event.target.dataset.wysiwygyForm;
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
        if (action.dataset.wysiwygyCommand === 'insertTable') {
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
          this.execute(action.dataset.wysiwygyCommand, action.dataset.wysiwygyValue);
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
        var modal_command = action.dataset.wysiwygyModal;

        this.range = this.selection.save(this.editable_el);
        this.modal_el.style.display = 'block';
        modalForm.setAttribute('data-wysiwygy-form', modal_command);
        modalForm.reset();

        switch (modal_command) {
          case 'foreColor':
            modalForm.style.minWidth = 'inherit';
            form += '<input type="text" name="color" placeholder="Enter HEX or RGBA"/></div>';
            form += '<div class="wysiwygy-form-block"><input type="submit" value="Apply Font Color"/></div>';
            break;
          case 'backColor':
            modalForm.style.minWidth = 'inherit';
            form += '<input type="text" name="color" placeholder="Enter HEX or RGBA"/>';
            form += '<div class="wysiwygy-form-block"><input type="submit" value="Apply Fill Color"/></div>';
            break;
          case 'createLink':
            modalForm.style.minWidth = '70%';
            form += '<input type="text" name="url" placeholder="Enter URL"/>';
            form += '<div class="wysiwygy-form-block"><input type="submit" value="Add Link"/></div>';
            break;
          case 'templates':
            modalForm.style.minWidth = '70%';
            form += '<select name="template"></select>';
            form += '<div class="wysiwygy-form-block"><input type="submit" value="Add Selected Template"/></div>';
            break;
          case 'insertImage':
            modalForm.style.minWidth = '75%';
            form += '<input type="text" name="image" style="width:69%;" placeholder="Enter Image URL"/>';
            form += '<input type="text" name="width" style="width:14%;" placeholder="Width"/>';
            form += '<input type="text" name="height" style="width:14%;" placeholder="Height"/>';
            form += '<div class="wysiwygy-form-block"><input type="submit" value="Insert Image"/></div>';
            break;
          case 'insertHTML':
            modalForm.style.minWidth = '90%';
            form += '<textarea class="wysiwygy-source-html" name="insertHTML">' + this.getValue() + '</textarea>';
            form += '<div class="wysiwygy-form-block"><input type="submit" value="Apply HTML"/></div>';
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
  getValue() {
    return this.editable_el.innerHTML;
  };

  /**
   * @method setValue
   *
   * Sets value passed along in ContentEditable
   *
   * @param value
   */
  setValue(value) {
    this.editable_el.innerHTML = value;
  };

  /**
   * @method destroy
   *
   * Removes instance of Core from the DOM and clear events
   *
   * @param value
   */
  destroy(value) {
    this.el.style.display = 'block';
    this.toolbar_el.remove();
    this.editable_el.remove();
    this.wysiwygy_el.remove();
    this.emit('destroy', this.getValue());
  }

  /**
   * @private
   * @method execute
   *
   * Commands DOM to perform operations
   *
   * @param command
   * @param value
   */
  execute(command, value) {
    console.log('Core', 'execute', command, value, this.range);
    value = (typeof value === 'undefined') ? '' : value;
    document.execCommand(command, false, value);
  }

}