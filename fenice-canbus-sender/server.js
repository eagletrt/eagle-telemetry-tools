const mqtt = require('mqtt');
const config = require('./config/config.json');
const os = require('os');
const can = require('socketcan');

// Getting shit from config
const { topic: TOPIC, host: HOST, port: PORT, interval: TIME_INTERVAL } = config.mqtt;
const CAN = config.can.port;
const MQTT_URI = 'mqtt://' + HOST + ':' + PORT;

// Connecting to can and mqtt
const channel = can.createRawChannel(CAN, true);
const client = mqtt.connect(MQTT_URI);

// Logging os shit
console.log(" OS: " + os.type() + " " + os.release() + " (" + os.arch() + ")");
console.log("RAM: " + os.totalmem() / 1048576 + " MB (total), " + os.freemem() / 1048576 + " MB (free)");
console.log("CPU: " + os.cpus()[0].speed + " MHz " + os.cpus()[0].model + "\n");

// Initializing can data structure
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

// Mqtt logic
client.on('connect', () => {
    console.log('Connecting to ' + TOPIC + '...');
    client.subscribe(TOPIC, err => {
        if (err) {
            console.error('Error in connecting ', err);
        } else {
            console.log('Connected')
            // Publish every TIME_INTERVAL milliseconds
            setInterval(() => {
                client.publish(TOPIC, JSON.stringify(canData))
                //TODO: INSERT DB di CanData
                canData = defaultCanData();
            }, TIME_INTERVAL)
        }
    });

});

// When mqtt offline
client.on('offline', () => {
    client.unsubscribe(TOPIC);
    console.log('Disconnected from /' + TOPIC + '.');
});

// On can message and start can channel
channel.addListener("onMessage",
    message => {
        updateCANData(message);
    }
);
channel.start();

// Function to update the can data structure
function updateCANData(message) {

    const countGPS = canData.gps.length - 1;

    const bytes = message.data.toJSON().data;
    const firstByte = bytes[0];
    let received7 = 0;
    let received8 = 0;

    switch (message.id) {
        case (0xAA):
            if (firstByte == 0x01) {
                canData.bms_hv[0].volt = bytes[7] + bytes[6] * 10 + bytes[5] * 100 + bytes[4] * 1000 + bytes[3] * 10000; + bytes[2] * 100000;
            } else if (firstByte == 0x0A) {
                // TODO: add right code
                canData.bms_hv[0].temp = 3 //(data1 >> 8) & 65535; //0xFFFF
            }
            break;
        case (0xB0):
            if (firstByte == 0x01) {
                canData.throttle.push(bytes[1]);
            } else if (firstByte == 0x02) {
                canData.brake.push(bytes[1]);
            }
            break;
        case (0xC0):
            if (firstByte == 0x03) {
                canData.imu_gyro.push({
                    x: (bytes[2] === 1 ? -(bytes[0] * 256 + bytes[1]) : (bytes[0] * 256 + bytes[1])),
                    y: (bytes[5] === 1 ? -(bytes[3] * 256 + bytes[4]) : (bytes[3] * 256 + bytes[4])),
                    z: 6
                });
            }
            /* else if (firstByte == 0x04) {
                console.log('---gyro-z')
                canData.imu_gyro.push({
                    z: (bytes[2] === 1 ? -(bytes[0] * 256 + bytes[1]) : (bytes[0] * 256 + bytes[1]))
                });
            } */
            else if (firstByte == 0x05) {
                canData.imu_axel.push({
                    x: bytes[1] * 256 + bytes[2],
                    y: bytes[3] * 256 + bytes[4],
                    z: bytes[5] * 256 + bytes[6]
                });
            } else if (firstByte == 0x02) {
                canData.steering_wheel_encoder.push(bytes[0]);
            }
            break;
        case (0xD0):
            if (firstByte == 0x07) {
                canData.gps[countGPS].latitude = 5 //(((data1 >> 16) & 255) * 256 + ((data1 >> 8) & 255)) * 100000 + ((data1 & 255) * 256 + ((data2 >> 24) & 255));
                canData.gps[countGPS].lat_o = 5 //(data2 >> 16) & 255;
                canData.gps[countGPS].speed = 5 //(((data2 >> 8) & 255) * 256) + (data2 & 255);
                if (received8 == 1) {
                    received8 = 0;
                    countGPS.push({});
                } else {
                    received7 = 1;
                }
            } else if (firstByte == 0x08) {
                canData.gps[countGPS].longitude = 7 //(((data1 >> 16) & 255) * 256 + ((data1 >> 8) & 255)) * 100000 + ((data1 & 255) * 256 + ((data2 >> 24) & 255));
                canData.gps[countGPS].lon_o = 7 //(data2 >> 16) & 255;
                canData.gps[countGPS].altitude = 7 //(((data2 >> 8) & 255) * 256) + (data2 & 255);
                if (received7 == 1) {
                    received7 = 0;
                    countGPS.push({});
                } else {
                    received8 = 1;
                }
            } else if (firstByte == 0x06) {
                canData.front_wheels_encoder.push((bytes[0] * 256 + bytes[1]) * (bytes[2] === 1 ? -1 : 1));
            }
            break;
        case (0xFF):
            if (firstByte == 0x01) {
                canData.bms_lv[0].temp = bytes[1];
            }
            break;
        case (0xAB):
            canData.marker = 1;
            break;
    }
}