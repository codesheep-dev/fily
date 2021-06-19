"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
var disk_types_1 = require("./../utils/disk-types");
var disks_1 = require("../utils/disks");
var local_1 = require("./local");
var ftp_1 = require("./ftp");
/**
 * Store a file and return the hash
 *
 * @param file: ExpressFileUploadFile
 * @param options: Options
 * @return Promise<string|void|null>
 */
function store(file, options) {
    return __awaiter(this, void 0, void 0, function () {
        var filename, driver, _a, disk, hash, _b, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 10, , 11]);
                    filename = options && (options === null || options === void 0 ? void 0 : options.filename) ? options === null || options === void 0 ? void 0 : options.filename : file.name;
                    if (!(options && (options === null || options === void 0 ? void 0 : options.driver))) return [3 /*break*/, 1];
                    _a = options === null || options === void 0 ? void 0 : options.driver;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, disks_1.getDefaultDiskDriver()];
                case 2:
                    _a = _c.sent();
                    _c.label = 3;
                case 3:
                    driver = _a;
                    return [4 /*yield*/, disks_1.getDisk(driver)];
                case 4:
                    disk = _c.sent();
                    if (!disk) {
                        throw new Error("No disk could be found for the driver " + driver + ".");
                    }
                    hash = null;
                    _b = disk.type;
                    switch (_b) {
                        case disk_types_1.DISK_TYPES.LOCAL: return [3 /*break*/, 5];
                        case disk_types_1.DISK_TYPES.FTP: return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 8];
                case 5:
                    hash = local_1.storeLocal(file, filename, disk);
                    return [3 /*break*/, 9];
                case 6: return [4 /*yield*/, ftp_1.storeFtp(file, filename, disk)];
                case 7:
                    hash = _c.sent();
                    return [3 /*break*/, 9];
                case 8: throw new Error("The provided disk type " + disk.type + " is not supported.");
                case 9: return [2 /*return*/, Promise.resolve(hash)];
                case 10:
                    error_1 = _c.sent();
                    return [2 /*return*/, Promise.reject(error_1)];
                case 11: return [2 /*return*/];
            }
        });
    });
}
exports.store = store;
