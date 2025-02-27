export default class ConsoleSignature {
  constructor() {
    this.message = `created by h4ck3rm1k2`;
    this.url = `https://www.anchor.fm/stre/`;
    this.show();
  }
  show() {
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      const args = [
        `%c ${this.message} %c ${this.url}`,
        `color: #fff; background: #47c; padding:3px 0;`,
        `padding:3px 1px;`,
      ];
      console.log.apply(console, args);
    } else if (window.console) {
      console.log(`${this.message} ${this.url}`);
    }
  }
}
