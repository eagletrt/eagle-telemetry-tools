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
        imu_gyro: {
            xy: [],
            z: []
        },
        bms_lv: {
            temperature: [],
            voltage: [],
            current: []
        },
        imu_axel: [],
        front_wheels_encoder: [],
        steering_wheel_encoder: [],
        throttle: [],
        brake: []
    };
};