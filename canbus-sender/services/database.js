const { MongoClient } = require('mongodb');

class Database {

    _getUri() {
        const { host, port, dbName } = this.config;
        return `mongodb://${host}:${port}/${dbName}`;
    }

    _connect() {
        console.debug('Connecting to mongodb...');
        const uri = this._getUri();
        console.log('MongoDB: uri is ', uri);
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (error, database) => {
            if (error) {
                console.error('Error in connecting to MongoDB ', error);
            } else {
                console.debug('Connected to mongodb');
                this.database = database;
            }
        });
    }

    insert(data) {
        if (this.database) {
            console.log(this.database)
            this.database
                .collection(this.config.collection)
                .insertOne(data, (error, _res) => {
                    if (error) {
                        console.error('Error in inserting data to mongodb ', error);
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