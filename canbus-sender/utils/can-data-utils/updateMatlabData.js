module.exports = function updateMatlabData(message, timestamp) {
    // Gets id
    const id = message.id;
    // Gets message's bytes
    const bytes = message.data.toJSON().data;
    return {
        id,
        timestamp,
        bytes
    };
};