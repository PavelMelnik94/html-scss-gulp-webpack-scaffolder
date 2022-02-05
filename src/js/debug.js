/**
 * @class Debug
 * @classdesc A small utility for debugging.
 *
 */
class Debug {
  constructor() {
    this.init();
  }

  /**
   * determines if debugging has been unlocked from sessionStorage
   * @type {boolean}
   */
  get isUnlocked() {
    const storageItem = sessionStorage.getItem('isDebugging');

    return storageItem === 'true';
  }

  /** logs an optionally styled message in the console
   * @method
   * @param  {string} message message to be sent to the console
   * @param  {string} [styles=''] CSS styles to be added to the message
   */
  static logMessage(message, styles = '') {
    console.log(`${styles && '%c'} ${message}`, styles || ' ');
  }

  /**
   * "unlocks" debugging by adding a classname and putting value in sessionStorage
   * @method
   * @static
   */
  static unlock() {
    document.body.classList.add('isDebugging');
    sessionStorage.setItem('isDebugging', 'true');
    Debug.logMessage('debugging unlocked');
  }

  /**
   * binds any events used by debugging
   * This includes event listener that checks for keystrokes
   * @method
   * @static
   */
  static bindEvents() {
    // up up down down left right left right b a
    const keys = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let keysIndex = 0;

    const keydownTracker = (event) => {
      const nextKey = keys[keysIndex++];

      if (event.keyCode === nextKey) {
        if (keysIndex === keys.length) {
          document.removeEventListener('keydown', keydownTracker);
          Debug.unlock();
        }
      }
    };

    document.body.addEventListener('keydown', keydownTracker);
  }

  /**
   * Initializes the module
   */
  init() {
    if (this.isUnlocked) {
      Debug.unlock();
    }
    Debug.logMessage('Debugger available', 'color: #ef8c23');
    Debug.bindEvents();
  }
}

export default Debug;
