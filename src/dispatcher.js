/**
 * WYSIWYGY Dispatcher
 *
 * @type {Object}
 */

'use strict';

const Dispatcher = {
  /**
   * Bind a callback to an event
   *
   * @param {String} eventName
   * @param {Function} function
   */
  on: function (event, listener) {
    if (typeof this.events[event] !== 'object') {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  },

  /**
   * Bind a callback to an event
   *
   * @param {String} eventName
   * @param {Function} function
   */
  off: function (event, listener) {
    let index = null;

    if (typeof this.events[event] === 'object') {
      index = this.events[event].indexOf(listener);
      if (index > -1) {
        this.events[event].splice(index, 1);
      }
    }
  },

  /**
   * Bind a callback to an event
   *
   * @param {String} eventName
   * @param {Function} function
   */
  emit: function (event) {
    let i, listeners, length, args = [].slice.call(arguments, 1);

    if (typeof this.events[event] === 'object') {
      listeners = this.events[event].slice();
      length = listeners.length;

      for (i = 0; i < length; i++) {
        listeners[i].apply(this, args);
      }
    }
  },

  /**
   * Bind a callback to an event
   *
   * @param {String} eventName
   * @param {Function} function
   */
  once: function (event, listener) {
    this.on(event, function g() {
      this.off(event, g);
      listener.apply(this, arguments);
    });
  }
};

module.exports = Dispatcher;
