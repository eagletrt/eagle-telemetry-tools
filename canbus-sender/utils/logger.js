const chalk = require('chalk');

class Logger {

    _getTimestamp() {
        return chalk.bold(this.showTimestamp ? `[${this.generateTimestamp()}]` : ``);
    }

    _getService() {
        return chalk.keyword(this.serviceColor).bold(`[${this.serviceName}]`);
    }

    log(message, obj) {
        console.log(`${this._getTimestamp()} ${this._getService()} ${chalk.blue.bold('[LOG]')} ${chalk.blue(message)}`, obj || '');
    }

    debug(message, obj) {
        console.log(`${this._getTimestamp()} ${this._getService()} ${chalk.grey.bold('[DEBUG]')} ${chalk.grey(message)}`, obj || '');
    }

    success(message, obj) {
        console.log(`${this._getTimestamp()} ${this._getService()} ${chalk.green.bold('[SUCCESS]')} ${chalk.green(message)}`, obj || '');
    }

    warning(message, obj) {
        console.log(`${this._getTimestamp()} ${this._getService()} ${chalk.keyword('orange').bold('[WARNING]')} ${chalk.keyword('orange')(message)}`, obj || '');
    }

    error(message, error) {
        console.log(`${this._getTimestamp()} ${this._getService()} ${chalk.red.bold('[ERROR]')} ${chalk.red(message)}`, error || '');
    }

    constructor(config) {
        this.serviceName = config.serviceName;
        this.serviceColor = config.serviceColor || 'yellow';
        this.showTimestamp = config.showTimestamp;
        this.generateTimestamp = config.generateTimestamp || ( () => Date.now() );
    }

}

module.exports = config => new Logger(config);