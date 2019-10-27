const chalk = require('chalk');

const config = require('../config/config').logger;

class Logger {

    _getTimestamp() {
        return chalk.bold(config.timestamp ? `[${this.generateTimestamp()}]` : ``);
    }

    _getService() {
        return chalk.keyword(this.serviceColor).bold(`[${this.serviceName}]`);
    }

    log(message, obj) {
        console.log(`${this._getTimestamp()} ${this._getService()} ${chalk.blue.bold('[LOG]')} ${chalk.blue(message)}`, obj || '');
    }

    debug(message, obj) {
        if (config.debug) {
            console.log(`${this._getTimestamp()} ${this._getService()} ${chalk.grey.bold('[DEBUG]')} ${chalk.grey(message)}`, obj || '');
        }
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

    constructor(configurations) {
        this.serviceName = configurations.serviceName;
        this.serviceColor = configurations.serviceColor || 'yellow';
        this.generateTimestamp = config.generateTimestamp || (() => Date.now());
    }

}

module.exports = config => new Logger(config);