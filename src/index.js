/**
 * 
 * @author Shobhit Sharma
 */

import Core from './core.js';
export default class WYSIWYGY {

  constructor(options) {
    this.options = options || {};
  }

  render(el, options) {
    console.log('-render-', el, options);

    this.x = new Core(el, options);
  }
}