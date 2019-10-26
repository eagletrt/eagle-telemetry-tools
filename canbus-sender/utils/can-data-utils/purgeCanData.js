module.exports = function purgeCanData(canData, dataModel) {
    // Delete "received" parameters
    delete canData.receivedLatitude;
    delete canData.receivedLongitude;
    delete canData.receivedBmsHvVolt;
    delete canData.receivedBmsHvTemp;

    // Delete parameters which are not in the dataModel
    for (const param in dataModel) {
        if (!dataModel.param) {
            delete canData[param];
        }
    }
};