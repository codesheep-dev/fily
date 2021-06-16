const { getConfigFile } = require("../env/config")

module.exports = {
    async getDisk(driver) {
        const config = await getConfigFile();

        if (!config.filesystems) {
            throw new Error('No filesystems configuration was found in the config file.');
        }

        const disks = config.filesystems.disks;

        if (!disks || disks.length < 1) {
            throw new Error('No disks was detected in the config file. Make sure to provide at least one disk.');
        }

        return disks.find((disk) => disk.driver === driver);
    },
    async getDefaultDiskDriver() {
        const config = await getConfigFile();

        if (!config.filesystems) {
            throw new Error('No filesystems configuration was found in the config file.');
        }

        const disks = config.filesystems.disks;
        const defaultDisk = config.filesystems.default;

        if (!disks || !defaultDisk) {
            throw new Error('No default disk was detected in the config file. Make sure to provide a default disk or provide one in the methods.');
        }

        const disk = disks.find((disk) => disk.driver === defaultDisk);

        if (!disk) {
            throw new Error(`A default disk was defined as ${defaultDisk}, but no such disk could be found in the "disks" array.`);
        }

        return disk.driver;
    },
}