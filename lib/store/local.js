"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeLocal = void 0;
var path_1 = require("path");
var filesystem_1 = require("../utils/filesystem");
var fs_1 = require("fs");
/**
 * Store a file locally using express-fileupload package
 *
 * @param file: ExpressFileUploadFile
 * @param filename: string
 * @param disk: Disk
 * @return string|null
 */
function storeLocal(file, filename, disk) {
    try {
        var destination = path_1.join(process.cwd(), disk.root);
        filesystem_1.checkExistingDiskRootFolder(destination);
        if (file.tempFilePath !== '') {
            fs_1.rename(file.tempFilePath, destination, function (error) {
                if (error)
                    throw new Error("Something went wrong: " + error);
                return file === null || file === void 0 ? void 0 : file.md5;
            });
        }
        else if (!!file.mv) {
            file.mv(path_1.join(destination, filename), function (error) {
                if (error)
                    throw new Error("Error moving the file to the disk: " + error);
                return file === null || file === void 0 ? void 0 : file.md5;
            });
        }
        else {
            throw new Error('The provided file does not support Express File Upload.');
        }
    }
    catch (error) {
        throw new Error("Something went wrong storing the file locally: " + error);
    }
    return null;
}
exports.storeLocal = storeLocal;
