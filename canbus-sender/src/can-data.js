'use strict'


function returnRandomFloat(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

function fromCANtoJSON(msg) {

}

var self = module.exports = {
    setData: function() {
        fromCANtoJSON(msg)
    }
    startStream: function() {

        var streamInterval = setInterval(function() {

            latitude = returnRandomFloat(-100, 100);
            longitude = returnRandomFloat(-100, 100);
            elevation = returnRandomFloat(-10, 10);
            speed = returnRandomFloat(0, 50);
            odometry = returnRandomFloat(0, 100);
            steering_angle = returnRandomFloat(-20, 20);
            throttle = returnRandomFloat(0, 1);
            brake = returnRandomFloat(0, 1);
            x_a = returnRandomFloat(-0.5, 0.5);
            y_a = returnRandomFloat(-.05, 0.5);
            z_a = returnRandomFloat(-0.1, 0.1);
            x_b = returnRandomFloat(-0.5, 0.5);
            y_b = returnRandomFloat(-0.5, 0.5);
            z_b = returnRandomFloat(-0.1, 0.1);
            x_c = returnRandomFloat(-3, 3);
            y_c = returnRandomFloat(-3, 3);
            z_c = returnRandomFloat(-3, 3);
            voltage = returnRandomFloat(300, 400);
            current_a = returnRandomFloat(1.0, 1.1);
            current_b = returnRandomFloat(1.0, 1.1);
            current_c = returnRandomFloat(1.0, 1.1);
            temperature_a = returnRandomFloat(37, 47);

            /* Publish random data to the corresponding MQTT topic as a JSON string  */
            client.publish(topic, JSON.stringify({

                'latitude': latitude,
                'longitude': longitude,
                'elevation': elevation,
                'speed': speed,
                'odometry': odometry,
                'steering_angle': steering_angle,
                'throttle': throttle,
                'brake': brake,
                'x_a': x_a,
                'y_a': y_b,
                'z_a': z_c,
                'x_b': x_b,
                'y_b': y_b,
                'z_b': z_b,
                'x_c': x_c,
                'y_c': y_b,
                'z_c': y_c,
                'voltage': voltage,
                'current_a': current_a,
                'current_b': current_b,
                'current_c': current_c,
                'temperature_a': temperature_a

            }));

        }, msFrequency);
    }
}