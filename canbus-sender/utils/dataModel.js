const fs = require('fs');
const path = require('path');

const updateJsonFile = (dataModel) => {
    fs.writeFileSync(path.join(__dirname, '../', 'config', 'dataModel.json'), JSON.stringify(dataModel));
}

let dataModel, handlers;

module.exports = {
    init: () => {
        dataModel = require('../config/config').dataModel;
        handlers = [{ name: 'updateJsonFile', handler: updateJsonFile }];
    },
    update: model => {
        dataModel = model;
        handlers.map(val => val.handler).forEach(listener => listener(dataModel));
    },
    subscribe: (name, handler) => {
        handlers.push({ name, handler });
        return dataModel;
    },
    unsubscribe: name => {
        const index = handlers.findIndex(el => el.name === name);
        handlers.splice(index, 1);
    }
};