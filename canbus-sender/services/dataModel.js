const fs = require('fs');
const path = require('path');

class DataModel {

    _updateDataModelJson(model) {
        fs.writeFileSync(this.modelPath, JSON.stringify(model, null, 3));
    }

    update(model) {
        this.model = model;
        this.handlers
            .map(val => val.handler)
            .forEach(listener => listener(this.model));
    }

    subscribe(name, handler) {
        this.handlers.push({ name, handler });
        return this.model;
    }

    unsubscribe(name) {
        this.handlers = this.handlers.filter(handler => handler.name !== name);
    }

    constructor(config) {
        this.config = config;
        const modelRelativePath = path.relative(__dirname, this.config.path);
        this.model = require(modelRelativePath);
        this.modelPath = path.join(__dirname, this.config.path);
        this.handlers = [{ name: 'updateDataModelJson', handler: model => this._updateDataModelJson(model) }];
    }

}

module.exports = DataModel;