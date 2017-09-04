const Utils = {

  /**
   * @function Validate Element
   *
   * @param {any} obj
   * @returns
   */
  validateElement: function validateElement(obj) {
    try {
      return obj instanceof window.HTMLElement;
    } catch (e) {
      return (typeof obj === "object") &&
        (obj.nodeType === 1) && (typeof obj.style === "object") &&
        (typeof obj.ownerDocument === "object");
    }
  },

  /**
   * @function Create Element
   *
   * @param {any} tagName
   * @param {any} attributes
   * @param {any} html
   * @returns
   */
  createElement: function createElement(tagName, attributes, html) {
    var el = document.createElement('div');

    for (var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        el.setAttribute(key, attributes[key]);
      }
    }

    el.innerHTML = html || '';

    return el;
  },

  /**
   * @function Object Extend
   *
   * @param {any} a
   * @param {any} b
   * @returns
   */
  extend: function extend(a, b) {
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  },

  /**
   * @function Object to CSS converter
   *
   * @param {any} obj
   * @returns
   */
  objectToCss: function objectToCss(obj) {
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

};

module.exports = Utils;