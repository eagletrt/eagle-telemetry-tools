function updateBmsHv(canData, firstByte, dataLeft, dataRight, timestamp) {
    switch (firstByte) {
        // voltage
        case 0x01:
            canData.bms_hv.voltage.push({
                timestamp,
                value: {
                    total: (dataLeft & 0x00FFFFFF) / 10000,
                    max: ((dataRight >> 16) & 0x0000FFFF) / 10000,
                    min: (dataRight & 0x0000FFFF) / 10000
                }
            });
            break;
        // temperature
        case 0x0A:
            canData.bms_hv.temperature.push({
                timestamp,
                value: {
                    average: ((dataLeft >> 8) & 0x0000FFFF) / 100,
                    max: (((dataLeft & 0x000000FF) * 256) + ((dataRight >> 32) & 0x000000FF)) / 100,
                    min: ((dataRight >> 8) & 0x0000FFFF) / 100
                }
            });
            break;
        // current
        case 0x05:
            canData.bms_hv.current.push({
                timestamp,
                value: {
                    current: ((dataLeft >> 8) & 0x0000FFFF) / 10,
                    pow: (((dataLeft & 0x000000FF) * 256) + ((dataRight >> 32) & 0x000000FF))
                }
            });
            break;
        // errors
        case 0x08:
            canData.bms_hv.errors.push({
                timestamp,
                code: (dataLeft >> 16) & 0x000000FF,
                index: (dataLeft >> 8) & 0x000000FF,
                value: (((dataLeft & 0x000000FF) * 256) + ((dataRight >> 32) & 0x000000FF))
            });
            break;
        // warnings
        case 0x09:
            canData.bms_hv.current.push({ timestamp, value: (dataLeft >> 16) & 0x000000FF });
            break;
    }
}

function updatePedals(canData, firstByte, dataLeft, _dataRight, timestamp) {
    switch (firstByte) {
        // throttle
        case 0x01:
            canData.throttle.push({ timestamp, value: ((dataLeft >> 16) & 255) });
            break;
        // brake
        case 0x02:
            canData.brake.push({ timestamp, value: ((dataLeft >> 16) & 255) });
            break;
    }
}

function updateImuOrSwe(canData, firstByte, dataLeft, dataRight, timestamp) {
    switch (firstByte) {
        // imu gyro xy
        case 0x03:
            canData.imu_gyro.xy.push({
                timestamp,
                value: {
                    x: (dataLeft >> 8) & 0x0000FFFF,
                    y: (dataRight >> 16) & 0x0000FFFF
                }
            });
            break;
        // imy gyro z
        case 0x04:
            canData.imu_gyro.z.push({ timestamp, value: ((dataLeft >> 8) & 0x0000FFFF) });
            break;
        // imu axel
        case 0x05:
            canData.imu_axel.push({
                timestamp,
                value: {
                    x: ((dataLeft >> 16) & 255) * 256 + ((dataLeft >> 8) & 255),
                    y: (dataLeft & 255) * 256 + ((dataLeft >> 24) & 255),
                    z: ((dataRight >> 16) & 255) * 256 + ((dataRight >> 8) & 255)
                }
            });
            break;
        // steering wheel encoder
        case 0x02:
            canData.steering_wheel_encoder.push({ timestamp, value: ((dataLeft >> 16) & 255) });
            break;
    }
}

function updateGpsAndFrontWheelsEncoder(canData, firstByte, dataLeft, dataRight, timestamp) {
    switch (firstByte) {
        // latitude and speed
        case 0x01:
            {
                canData.gps.latspd.push({
                    timestamp,
                    value: {
                        latitude: (((dataLeft >> 16) & 255) * 256 + ((dataLeft >> 8) & 255)) * 100000 + ((dataLeft & 255) * 256 + ((dataRight >> 24) & 255)),
                        lat_o: (dataRight >> 16) & 255,
                        speed: (((dataRight >> 8) & 255) * 256) + (dataRight & 255)
                    }
                });
                break;
            }
        // longitude and altitude
        case 0x02:
            {
                canData.gps.lonalt.push({
                    timestamp,
                    value: {
                        longitude: (((dataLeft >> 16) & 255) * 256 + ((dataLeft >> 8) & 255)) * 100000 + ((dataLeft & 255) * 256 + ((dataRight >> 24) & 255)),
                        lon_o: (dataRight >> 16) & 255,
                        altitude: (((dataRight >> 8) & 255) * 256) + (dataRight & 255)
                    }
                });
                break;
            }
        // front wheels encoder
        case 0x06:
            canData.front_wheels_encoder.push({ timestamp, value: ((dataLeft >> 16) & 255) * 256 + ((dataLeft >> 8) & 255) });
            break;
    }

}

function updateBmsLv(canData, firstByte, dataLeft, dataRight, _timestamp) {
    switch (firstByte) {
        // temp
        case 0xFF:
            canData.bms_lv.temperature.push({ timestamp, value: ((dataLeft & 255) << 8) + ((dataRight >> 24) & 255) });
            break;
    }
}

function completeBytes(bytes) {
    const missing = 8 - bytes.length;
    for (let i = 0; i < missing; i++) {
        bytes.push(0);
    }
}

module.exports = function updateCanData(canData, message, timestamp) {
    // Gets message's bytes
    const bytes = message.data.toJSON().data;
    // Complete bytes if they are not eight
    completeBytes(bytes);
    // Left and right parts of the message
    const dataLeft = (bytes[0] << 24) + (bytes[1] << 16) + (bytes[2] << 8) + bytes[3];
    const dataRight = (bytes[4] << 24) + (bytes[5] << 16) + (bytes[6] << 8) + bytes[7];
    // Message's first byte
    const firstByte = bytes[0];

    switch (message.id) {
        // BmsHv
        case (0XAA):
            updateBmsHv(canData, firstByte, dataLeft, dataRight, timestamp);
            break;
        // Pedals
        case (0xB0):
            updatePedals(canData, firstByte, dataLeft, dataRight, timestamp);
            break;
        // Imu and SteeringWheelEncoder
        case (0xC0):
            updateImuOrSwe(canData, firstByte, dataLeft, dataRight, timestamp);
            break;
        // Gps and FrontWheelsEncoder
        case (0xD0):
            updateGpsAndFrontWheelsEncoder(canData, firstByte, dataLeft, dataRight, timestamp);
            break;
        // BmsLv
        case (0xFF):
            updateBmsLv(canData, firstByte, dataLeft, dataRight, timestamp);
            break;
        // Marker
        case (0xAB):
            canData.marker = true;
            // update data model...
            break;
    }
};