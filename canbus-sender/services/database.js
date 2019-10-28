const { MongoClient } = require('mongodb');
const log = require('../utils/logger')({ 
    serviceName: 'DB',
    serviceColor: 'yellow'
});

class Database {

    _getUri() {
        const { host, port, dbName } = this.config;
        return `mongodb://${host}:${port}/${dbName}`;
    }

    _connect() {
        log.log('Connecting to mongodb...');
        const uri = this._getUri();
        log.log('MongoDB: uri is ' + uri);
        this.structuredCollection = `${this.config.collection.structured}-${(new Date()).toLocaleString().replace(/\s/g,'-')}`
        log.log('MongoDB: structured collection is ' + this.structuredCollection);
        this.matlabCollection = `${this.config.collection.matlab}-${(new Date()).toLocaleString().replace(/\s/g,'-')}`
        log.log('MongoDB: matlab collectoin is ' + this.matlabCollection);
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (error, database) => {
            if (error) {
                log.error('Error in connecting to MongoDB ', error);
            } else {
                log.success('Connected to mongodb');
                this.database = database;
            }
        });
    }

    insertStructured(data) {
        if (this.database) {
            log.debug('Inserting structured data');
            this.database
                .db(this.config.dbName)
                .collection(this.structuredCollection)
                .insertOne(data, (error, _res) => {
                    if (error) {
                        log.error('Error in inserting structured data to mongodb ', error);
                    }
                });
        }
    }

    insertMatlab(data) {
        if (this.database) {
            log.debug('Inserting matlab data');
            this.database
                .db(this.config.dbName)
                .collection(this.matlabCollection)
                .insertOne(data, (error, _res) => {
                    if (error) {
                        log.error('Error in inserting matlab data to mongodb ', error);
                    }
                });
        }
    }

    constructor(config) {
        this.config = config;

        this._connect();
    }

}

module.exports = Database;