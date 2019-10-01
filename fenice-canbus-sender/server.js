var mqtt = require('mqtt');
var config = require('./config/config.json');
const os = require('os');

var can = require('socketcan');

var topic = config.mqtt.topic[0];
var hostname = config.mqtt.hostname;
var port = config.mqtt.port;
var mqttUri = 'mqtt://' + hostname + ':' + port;

var channel = can.createRawChannel("vcan0", true);

var client = mqtt.connect(mqttUri);

console.log(" OS: " + os.type() + " " + os.release() + " (" + os.arch() + ")");
console.log("RAM: " + os.totalmem() / 1048576 + " MB (total), " + os.freemem() / 1048576 + " MB (free)");
console.log("CPU: " + os.cpus()[0].speed + " MHz " + os.cpus()[0].model + "\n");

function updateCANData(message) {
    for (let i = 0; i < message.length; i = i + 3) {

        const countTHR = canData.throttle.length;
        const countBRK = canData.brake.length;
        const countGPS = canData.gps.length - 1;

        let id_gathered = message[i];
        let data1 = message[i + 1];
        let data2 = message[i + 2];
        let received7 = 0;
        let received8 = 0;

        let firstByte = ((data1 >> 24) & 255);
        switch (id_gathered) {
            case (0xAA):
                if (firstByte == 0x01) {
                    canData.bms_hv[0].volt = data1 & 16777215; //0xFFFFFF
                } else if (firstByte == 0x0A) {
                    canData.bms_hv[0].temp = (data1 >> 8) & 65535; //0xFFFF
                }
                break;
            case (0xB0):
                if (firstByte == 0x01 && countTHR < 20) {
                    canData.throttle.push((data1 >> 16) & 255);
                } else if (firstByte == 0x02 && countBRK < 10) {
                    canData.brake.push((data1 >> 16) & 255);
                }
                break;
            case (0xC0):
                if (firstByte == 0x04) {
                    canData.imu_gyro.push({
                        x: ((data1 >> 16) & 255) * 256 + ((data1 >> 8) & 255),
                        y: (data1 & 255) * 256 + ((data1 >> 24) & 255),
                        z: ((data2 >> 16) & 255) * 256 + ((data2 >> 8) & 255)
                    });
                } else if (firstByte == 0x05) {
                    canData.imu_axel.push({
                        x: ((data1 >> 16) & 255) * 256 + ((data1 >> 8) & 255),
                        y: (data1 & 255) * 256 + ((data1 >> 24) & 255),
                        z: ((data2 >> 16) & 255) * 256 + ((data2 >> 8) & 255)
                    });
                } else if (firstByte == 0x02) {
                    canData.steering_wheel_encoder.push((data1 >> 16) & 255);
                }
                break;
            case (0xD0):
                if (firstByte == 0x07) {
                    canData.gps[countGPS].latitude = (((data1 >> 16) & 255) * 256 + ((data1 >> 8) & 255)) * 100000 + ((data1 & 255) * 256 + ((data2 >> 24) & 255));
                    canData.gps[countGPS].lat_o = (data2 >> 16) & 255;
                    canData.gps[countGPS].speed = (((data2 >> 8) & 255) * 256) + (data2 & 255);
                    if (received8 == 1) {
                        received8 = 0;
                        countGPS.push({});
                    } else {
                        received7 = 1;
                    }
                } else if (firstByte == 0x08) {
                    canData.gps[countGPS].longitude = (((data1 >> 16) & 255) * 256 + ((data1 >> 8) & 255)) * 100000 + ((data1 & 255) * 256 + ((data2 >> 24) & 255));
                    canData.gps[countGPS].lon_o = (data2 >> 16) & 255;
                    canData.gps[countGPS].altitude = (((data2 >> 8) & 255) * 256) + (data2 & 255);
                    if (received7 == 1) {
                        received7 = 0;
                        countGPS.push({});
                    } else {
                        received8 = 1;
                    }
                } else if (firstByte == 0x06) {
                    canData.front_wheels_encoder.push(((data1 >> 16) & 255) * 256 + ((data1 >> 8) & 255));
                }
                break;
            case (0xFF):
                if (firstByte == 0x01) {
                    canData.bms_lv[0].temp = (((data1 & 255) << 8) + ((data2 >> 24) & 255));
                }
                break;
            case (0xAB):
                canData.marker = 1;
                break;
        }
    }
}

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
canData = defaultCanData();

client.on('connect', () => {
    console.log('Connecting to ' + topic + '...')

    client.subscribe(topic, function (err) {
        if (err) {
            console.error('Error in connecting ', err);
        } else {
            console.log('Connected')
            setInterval(() => {
                client.publish(topic, JSON.stringify(canData))
                //INSERT DB di CanData
                canData = defaultCanData();
            }, 1000)
        }
    });

});

client.on('offline', () => {
    client.unsubscribe(topic);
    console.log('Disconnected from /' + topic + '.');
});

// Log any message
channel.addListener("onMessage",
    function (msg) {
        console.log(msg);
        updateCANData(msg);
    }
);

channel.start();

/* for (let i = 0; i < data_lenght; i = i + 3) {

    let id_gathered = data.data_raw[i] = data_gathered[i];
    let data1 = data.data_raw[i + 1] = data_gathered[i + 1];
    let data2 = data.data_raw[i + 2] = data_gathered[i + 2];
    //check if gps data are complete
    let received7 = 0;
    let received8 = 0;

    //printf("%d %d %d\n", i, i+1, i+2);
    let firstByte = ((data1 >> 24) & 255);
    switch (id_gathered) {
        case (0xAA):
            if (firstByte == 0x01) {
                //volt
                data.bms_hv[0].volt = data1 & 16777215; //0xFFFFFF
            } else if (firstByte == 0x0A) {
                //temp
                data.bms_hv[0].temp = (data1 >> 8) & 65535; //0xFFFF
            }
            break;
        case (0xB0):
            //pedals
            if (firstByte == 0x01 && countTHR < 20) {
                //throttle
                data.throttle[countTHR++] = ((data1 >> 16) & 255);
            } else if (firstByte == 0x02 && countBRK < 10) {
                //brake
                data.brake[countBRK++] = ((data1 >> 16) & 255);
            }
            break;
        case (0xC0):
            //swe, imu gyro and axel
            if (firstByte == 0x04) {
                //imu gyro
                data.imu_gyro[countIMG].x = ((data1 >> 16) & 255) * 256 + ((data1 >> 8) & 255);
                data.imu_gyro[countIMG].y = (data1 & 255) * 256 + ((data1 >> 24) & 255);
                data.imu_gyro[countIMG++].z = ((data2 >> 16) & 255) * 256 + ((data2 >> 8) & 255);
            } else if (firstByte == 0x05) {
                //imu axel
                data.imu_axel[countIMA].x = ((data1 >> 16) & 255) * 256 + ((data1 >> 8) & 255);
                data.imu_axel[countIMA].y = (data1 & 255) * 256 + ((data1 >> 24) & 255);
                data.imu_axel[countIMA++].z = ((data2 >> 16) & 255) * 256 + ((data2 >> 8) & 255);
            } else if (firstByte == 0x02) {
                //swe
                data.steering_wheel_encoder[countSWE++] = ((data1 >> 16) & 255);
            }
            break;
        case (0xD0):
            //gps and fwe
            if (firstByte == 0x07) {
                //gps1
                data.gps[countGPS].latitude = (((data1 >> 16) & 255) * 256 + ((data1 >> 8) & 255)) * 100000 + ((data1 & 255) * 256 + ((data2 >> 24) & 255));
                data.gps[countGPS].lat_o = (data2 >> 16) & 255;
                data.gps[countGPS].speed = (((data2 >> 8) & 255) * 256) + (data2 & 255);
                if (received8 == 1) {
                    received8 = 0;
                    countGPS++;
                } else {
                    received7 = 1;
                }
            } else if (firstByte == 0x08) {
                //gps2
                data.gps[countGPS].longitude = (((data1 >> 16) & 255) * 256 + ((data1 >> 8) & 255)) * 100000 + ((data1 & 255) * 256 + ((data2 >> 24) & 255));
                data.gps[countGPS].lon_o = (data2 >> 16) & 255;
                data.gps[countGPS].altitude = (((data2 >> 8) & 255) * 256) + (data2 & 255);
                if (received7 == 1) {
                    received7 = 0;
                    countGPS++;
                } else {
                    received8 = 1;
                }
            } else if (firstByte == 0x06) {
                //fwe
                data.front_wheels_encoder[countFWE++] = ((data1 >> 16) & 255) * 256 + ((data1 >> 8) & 255);
            }
            break;
        case (0xFF):
            if (firstByte == 0x01) {
                data.bms_lv[0].temp = ((data1 & 255) << 8) + ((data2 >> 24) & 255);
            }
            break;
        case (0xAB):
            data.marker = 1;
            break;
    }
} */