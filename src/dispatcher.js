/**
 * WYSIWYGY Dispatcher
 *
 * @type {Object}
 */

import Core from './core.js';

class Dispatcher extends Core {

  constructor() {
    super(this);
  }

  /**
   * Bind a callback to an event
   *
   * @param {String} eventName
   * @param {Function} function
   */
  on(event, listener) {
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
  off(event, listener) {
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
  emit(event) {
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
  once(event, listener) {
    this.on(event, function g() {
      this.off(event, g);
      listener.apply(this, arguments);
    });
  }
};

module.exports = Dispatcher;