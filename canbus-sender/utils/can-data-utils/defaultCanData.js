module.exports = function defaultCanData() {
    return {
        bms_hv: [],
        bms_lv: [],
        gps: [],
        imu_gyro: [],
        imu_axel: [],
        front_wheels_encoder: [],
        steering_wheel_encoder: [],
        throttle: [],
        brake: [],
        receivedLatitude: false,
        receivedLongitude: false,
        receivedBmsHvVolt: false,
        receivedBmsHvTemp: false
    };
};