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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Get_Formio_File = void 0;
// Express
// Constants
const Languages_1 = require("../../../../Constants/Languages");
const ErrorsStatusCode_1 = require("../../../../Constants/Errors/ErrorsStatusCode");
const ErrorSenderToClient_1 = require("../../../../Constants/Errors/ErrorSenderToClient");
// Constants
// Validators
const checkIsValidByPattern_1 = require("../../../../Validators/checkIsValidByPattern");
// Validators
// Formats
const formats_1 = require("../../../../Formats/formats");
// Formats
// Utils
const addDataToExistingObject_1 = require("../../../../Utils/DataAdder/addDataToExistingObject");
// Utils
// Modules
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Modules
// Models
const UserModel_1 = require("../../../../MongodbDataManagement/MongoDB_Models/User/UserModel");
// Types
const Get_Formio_File = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const language = req.headers.language;
    const { fileId } = req.query;
    const errors = {};
    const { userId } = req;
    try {
        (0, checkIsValidByPattern_1.checkIsValidByPattern)(fileId, formats_1.formats.oneOrTwo, (0, Languages_1.getWordBasedOnCurrLang)(language, "notInRange"), "fileId", (errData, errMessage, errorKey) => {
            errors[errorKey] = (0, addDataToExistingObject_1.addDataToExistingObject)(errors[errorKey], {
                errMessage,
            });
        });
        const desiredUserData = yield UserModel_1.AdminUserModel.findOne({
            userId,
        });
        if (!desiredUserData) {
            (0, ErrorSenderToClient_1.ErrorSenderToClient)({
                data: {},
                errorData: {
                    errorKey: "",
                    errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "userNotExist"),
                },
                expectedType: "string",
            }, ErrorsStatusCode_1.ErrorsStatusCode.notExist.standardStatusCode, res);
            return;
        }
        desiredUserData.formIoTryCount += 1;
        desiredUserData.requestIp = req.clientIp;
        yield desiredUserData.save();
        if (fileId === "1") {
            const filePath = path_1.default.resolve(__dirname, "./../../../../../Files/Form/1.json");
            const file = yield fs_1.default.promises.readFile(filePath);
            res.status(200).send({
                requestedFile: fileId,
                desiredUserData: desiredUserData.email,
                data: file.toString(),
            });
            return;
        }
        if (fileId === "2") {
            const filePath = path_1.default.resolve(__dirname, "./../../../../../Files/Form/2.json");
            const file = yield fs_1.default.promises.readFile(filePath);
            res.status(200).send({
                requestedFile: fileId,
                desiredUserData: desiredUserData.email,
                data: file.toString(),
            });
            return;
        }
        if (Object.keys(errors).length > 0) {
            res.status(ErrorsStatusCode_1.ErrorsStatusCode.notAcceptable.standardStatusCode).send({
                hasError: true,
                errorData: errors,
            });
            return;
        }
    }
    catch (err) {
        res.status(ErrorsStatusCode_1.ErrorsStatusCode.notAcceptable.standardStatusCode).send({
            hasError: true,
            errorData: err,
        });
    }
});
exports.Get_Formio_File = Get_Formio_File;
