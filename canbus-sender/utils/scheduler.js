const { interval, insertDatabase, publishMqtt } = require('../config/config').scheduler;
const updateCanData = require('./updateCanData');

function defaultCanData() {
    return {
        bms_hv: [{}],
        bms_lv: [{}],
        gps: [{}],
        imu_gyro: [],
        imu_axel: [],
        front_wheels_encoder: [],
        steering_wheel_encoder: [],
        throttle: [],
        brake: [],
    };
}
let canData = defaultCanData();

function insert(database) {
    if (insertDatabase) {
        database.insertData(canData)
    }
}

function publish(mqtt) {
    if (publishMqtt) {
        mqtt.publish(canData);
    }
}

module.exports = {
    init: (mqtt, database) => {
        setInterval(() => {
            insert(database);
            publish(mqtt);
            canData = defaultCanData();
        }, interval);
    },
    update: message => {
        updateCanData(canData, message);
    }
};