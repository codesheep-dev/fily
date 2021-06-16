const path = require('path');
const { checkExistingDiskRootFolder } = require('../utils/filesystem');

function storeLocal(file, filename, disk) {
    try {
        const destination = path.join(process.cwd(), disk.root);

        checkExistingDiskRootFolder(destination);

        file.mv(path.join(destination, filename), (error) => {
            if (error) throw new Error(`Error moving the file to the disk: ${error}`);
        });
    } catch (error) {
        throw new Error(`Something went wrong storing the file locally: ${error}`);
    }
}

module.exports = {
    storeLocal,
};