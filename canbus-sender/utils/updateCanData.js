module.exports = (canData, message) => {
    const countGPS = canData.gps.length - 1;

    const bytes = message.data.toJSON().data;
    const firstByte = bytes[0];
    let received7 = 0;
    let received8 = 0;

    switch (message.id) {
        case (0xAA):
            if (firstByte == 0x01 /*&& BMS_HV*/ ) {
                canData.bms_hv[0].volt = bytes[7] + bytes[6] * 10 + bytes[5] * 100 + bytes[4] * 1000 + bytes[3] * 10000; + bytes[2] * 100000;
            } else if (firstByte == 0x0A /*&& BMS_HV*/ ) {
                // TODO: add right code
                canData.bms_hv[0].temp = 3 //(data1 >> 8) & 65535; //0xFFFF
            }
            break;
        case (0xB0):
            if (firstByte == 0x01 /*&& THROTTLE*/ ) {
                canData.throttle.push(bytes[1]);
            } else if (firstByte == 0x02 /*&& BRAKE*/ ) {
                canData.brake.push(bytes[1]);
            }
            break;
        case (0xC0):
            if (firstByte == 0x03 /*&& IMU_GYRO*/ ) {
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
            else if (firstByte == 0x05 /* && IMU_AXEL*/ ) {
                canData.imu_axel.push({
                    x: bytes[1] * 256 + bytes[2],
                    y: bytes[3] * 256 + bytes[4],
                    z: bytes[5] * 256 + bytes[6]
                });
            } else if (firstByte == 0x02 /*&& STEERIGN_WHEEL_ENCODER*/ ) {
                canData.steering_wheel_encoder.push(bytes[0]);
            }
            break;
        case (0xD0):
            if (firstByte == 0x07 /* && GPS*/ ) {
                canData.gps[countGPS].latitude = 5 //(((data1 >> 16) & 255) * 256 + ((data1 >> 8) & 255)) * 100000 + ((data1 & 255) * 256 + ((data2 >> 24) & 255));
                canData.gps[countGPS].lat_o = 5 //(data2 >> 16) & 255;
                canData.gps[countGPS].speed = 5 //(((data2 >> 8) & 255) * 256) + (data2 & 255);
                if (received8 == 1) {
                    received8 = 0;
                    countGPS.push({});
                } else {
                    received7 = 1;
                }
            } else if (firstByte == 0x08 /* && GPS*/ ) {
                canData.gps[countGPS].longitude = 7 //(((data1 >> 16) & 255) * 256 + ((data1 >> 8) & 255)) * 100000 + ((data1 & 255) * 256 + ((data2 >> 24) & 255));
                canData.gps[countGPS].lon_o = 7 //(data2 >> 16) & 255;
                canData.gps[countGPS].altitude = 7 //(((data2 >> 8) & 255) * 256) + (data2 & 255);
                if (received7 == 1) {
                    received7 = 0;
                    countGPS.push({});
                } else {
                    received8 = 1;
                }
            } else if (firstByte == 0x06 /*&& FRONT_WHEELS_ENCODER*/ ) {
                canData.front_wheels_encoder.push((bytes[0] * 256 + bytes[1]) * (bytes[2] === 1 ? -1 : 1));
            }
            break;
        case (0xFF):
            if (firstByte == 0x01 /* && BMS_LV*/ ) {
                canData.bms_lv[0].temp = bytes[1]
            }
            break;
        case (0xAB):
            if (firstByte == 0xFF) {
                const lucagump = {
                    "bms_hv": true,
                    "bms_lv": true,
                    "gps": true,
                    "imu_gyro": true,
                    "imu_axel": true,
                    "front_wheels_encoder": true,
                    "steering_wheel_encoder": true,
                    "throttle": true,
                    "brake": false
                };
                dataModel.update(lucagump);
            }
            canData.marker = 1;
            break;

    }
};