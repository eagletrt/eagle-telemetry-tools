function updateBmsHv(canData, firstByte, dataLeft, _dataRight, timestamp) {
    // If none is received, create a new object
    if (!(canData.receivedBmsHvVolt || canData.receivedBmsHvTemp)) {
        canData.bmsHv.push({ timestamp });
    }
    // Gets the index of the last element
    const last = this.bmsHv.length - 1;
    // Switch on the first byte
    switch (firstByte) {
        // volt
        case 0x01:
            canData.bms_hv[last].volt = dataLeft & 16777215;
            canData.receivedBmsHvVolt = true;
            break;
        // temp
        case 0x0A:
            canData.bms_hv[last].temp = (dataLeft >> 8) & 65535;
            canData.receivedBmsHvTemp = true;
            break;
    }
    // If both are received, make them false so that a new object will be created next time
    if (canData.receivedBmsHvVolt && canData.receivedBmsHvTemp) {
        canData.receivedBmsHvVolt = false;
        canData.receivedBmsHvTemp = false;
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

function updateImuOrSwe(canData, firstByte, dataLeft, dataLeft, timestamp) {
    switch (firstByte) {
        // imu gyro
        case 0x04:
            canData.imu_gyro.push({
                timestamp,
                value: {
                    x: ((dataLeft >> 16) & 255) * 256 + ((dataLeft >> 8) & 255),
                    y: (dataLeft & 255) * 256 + ((dataLeft >> 24) & 255),
                    z: ((dataLeft >> 16) & 255) * 256 + ((dataLeft >> 8) & 255)
                }
            });
            break;
        // imu axel
        case 0x05:
            canData.imu_axel.push({
                timestamp,
                value: {
                    x: ((dataLeft >> 16) & 255) * 256 + ((dataLeft >> 8) & 255),
                    y: (dataLeft & 255) * 256 + ((dataLeft >> 24) & 255),
                    z: ((dataLeft >> 16) & 255) * 256 + ((dataLeft >> 8) & 255)
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

    // If none is received, create a new object
    function gpsNoneReceived() {
        if (!(canData.receivedLatitude || canData.receivedLongitude)) {
            canData.gps.push({ timestamp });
        }
    }

    // If both are received, make them false so that a new object will be created next time
    function gpsBothReceived() {
        if (canData.receivedLatitude && canData.receivedLongitude) {
            canData.receivedLatitude = false;
            canData.receivedLongitude = false;
        }
    }

    // Switch on the first byte
    switch (firstByte) {
        // latitude and speed
        case 0x01: {
            // If none is received, create a new object
            gpsNoneReceived();
            // Gets the index of the last element
            const last = canData.gps.length - 1;
            // Updates the last element
            canData[last].latitude = (((dataLeft >> 16) & 255) * 256 + ((dataLeft >> 8) & 255)) * 100000 + ((dataLeft & 255) * 256 + ((dataRight >> 24) & 255));
            canData[last].lat_o = (dataRight >> 16) & 255;
            canData[last].speed = (((dataRight >> 8) & 255) * 256) + (dataRight & 255);
            // Set receivedLatitude to true
            canData.receivedLatitude = true;
            // If both are received, make them false so that a new object will be created next time
            gpsBothReceived();
            break;
        }
        // longitude and altitude
        case 0x02: {
            // If none is received, create a new object
            gpsNoneReceived();
            // Gets the index of the last element
            const last = canData.gps.length - 1;
            // Updates the last element
            canData[last].longitude = (((dataLeft >> 16) & 255) * 256 + ((dataLeft >> 8) & 255)) * 100000 + ((dataLeft & 255) * 256 + ((dataRight >> 24) & 255));
            canData[last].lon_o = (dataRight >> 16) & 255;
            canData[last].altitude = (((dataRight >> 8) & 255) * 256) + (dataRight & 255);
            // Set receivedLongitude to true
            canData.receivedLongitude = true;
            // If both are received, make them false so that a new object will be created next time
            gpsBothReceived();
            break;
        }
        // front wheels encoder
        case 0x06:
            canData.front_wheels_encoder.push({ timestamp, value: ((dataLeft >> 16) & 255) * 256 + ((dataLeft >> 8) & 255) });
            break;
    }

}

function updateBmsLv(canData, firstByte, dataLeft, dataRight, _timestamp) {
    if (!canData.bms_lv.length) {
        canData.bms_lv.push({});
    }
    switch (firstByte) {
        // temp
        case 0xFF:
            canData.bms_lv[0].temp = ((dataLeft & 255) << 8) + ((dataRight >> 24) & 255);
            break;
    }
}

module.exports = function updateCanData(canData, message, timestamp) {
    console.log(canData)
    // Gets message's bytes
    const bytes = message.data.toJSON().data;
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