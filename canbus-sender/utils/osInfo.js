const os = require('os');

module.exports = () => {
    console.log();
    console.log();
    console.log("OS: " + os.type() + " " + os.release() + " (" + os.arch() + ")");
    console.log("RAM: " + os.totalmem() / 1048576 + " MB (total), " + os.freemem() / 1048576 + " MB (free)");
    console.log("CPU: " + os.cpus()[0].speed + " MHz " + os.cpus()[0].model + "\n");
};