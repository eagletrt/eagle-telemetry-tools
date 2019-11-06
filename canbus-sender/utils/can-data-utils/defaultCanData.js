module.exports = function defaultCanData() {
    return {
        bms_hv: {
            temperature: [],
            voltage: [],
            current: [],
            errors: [],
            warnings: []
        },
        gps: {
            latspd: [],
            lonalt: []
        },
        bms_lv: {
            values: [],
            errors: []
        },
        imu_axel: [],
        imu_gyro: [],
        front_wheels_encoder: [],
        steering_wheel_encoder: [],
        throttle: [],
        brake: []
    };
};