module.exports = function updateDataModel(message, dataModel) {
    if (message.id === 0xAB) {
        // Gets message's bytes
        const bytes = message.data.toJSON().data;
        // Left and right parts of the message
        const dataLeft = (bytes[0] << 24) + (bytes[1] << 16) + (bytes[2] << 8) + bytes[3];
        const dataRight = (bytes[4] << 24) + (bytes[5] << 16) + (bytes[6] << 8) + bytes[7];
        // Get new model
        // const model = ...
        // Update model
        // dataModel.update(model);
    }
};