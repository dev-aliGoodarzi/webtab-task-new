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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._auth_services = void 0;
// Express
// Models
const UserModel_1 = require("../../../../../MongodbDataManagement/MongoDB_Models/User/UserModel");
// Schema
// Utils
const bcrypt_1 = __importDefault(require("bcrypt"));
// Utils
// Constants
const DoneStatusCode_1 = require("../../../../../Constants/Done/DoneStatusCode");
const Languages_1 = require("../../../../../Constants/Languages");
const ErrorSenderToClient_1 = require("../../../../../Constants/Errors/ErrorSenderToClient");
const ErrorsStatusCode_1 = require("../../../../../Constants/Errors/ErrorsStatusCode");
const generateNewToken_1 = require("../../../../../Utils/Generators/generateNewToken");
// Constants
class _auth_services {
    static isUserExist(useEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const desiredUser = yield UserModel_1.AdminUserModel.findOne({
                email: useEmail,
            });
            if (desiredUser)
                return true;
            return false;
        });
    }
    static registerUser(email, password, pipeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const language = pipeData.req.headers.language;
            try {
                const hashPW = yield bcrypt_1.default.hash(password, Number(process.env.SALT_ROUNDS));
                const allAdminUsersCount = yield UserModel_1.AdminUserModel.find({});
                const newUserData = {
                    email,
                    isRegisterCompleted: false,
                    lastName: "Doe",
                    name: "John",
                    password: hashPW,
                    role: "ADMIN",
                    userId: `ADMIN_${Date.now()}_${allAdminUsersCount.length}`,
                    refreshToken: "",
                    userToken: "",
                    loginTryCount: 0,
                    bpmnTryCount: 0,
                    formIoTryCount: 0,
                    requestIp: pipeData.req.clientIp,
                };
                const newUser = new UserModel_1.AdminUserModel(newUserData);
                yield newUser.save();
                pipeData.res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).send({
                    message: (0, Languages_1.getWordBasedOnCurrLang)(language, "operationSuccess"),
                });
            }
            catch (err) {
                console.log(err);
                (0, ErrorSenderToClient_1.ErrorSenderToClient)({
                    data: {
                        unexpectedErr: err,
                    },
                    errorData: {
                        errorKey: "",
                        errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "unExpectedError"),
                    },
                    expectedType: "string",
                }, ErrorsStatusCode_1.ErrorsStatusCode.unExpectedError.standardStatusCode, pipeData.res);
            }
        });
    }
    static loginWithEmailAndPassword(pipeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = pipeData.req.body;
            const language = pipeData.req.headers.language;
            const selectedAdmin = yield UserModel_1.AdminUserModel.findOne({
                email,
            });
            if (!selectedAdmin) {
                (0, ErrorSenderToClient_1.ErrorSenderToClient)({
                    data: {},
                    errorData: {
                        errorKey: "",
                        errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "userNotExist"),
                    },
                    expectedType: "string",
                }, ErrorsStatusCode_1.ErrorsStatusCode.notExist.standardStatusCode, pipeData.res);
                return null;
            }
            const isPasswordAsSameAs = yield bcrypt_1.default.compare(password, selectedAdmin.password);
            if (!isPasswordAsSameAs) {
                (0, ErrorSenderToClient_1.ErrorSenderToClient)({
                    data: {},
                    errorData: {
                        errorKey: "",
                        errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "notEqualPassword"),
                    },
                    expectedType: "string",
                }, ErrorsStatusCode_1.ErrorsStatusCode.notAcceptable.standardStatusCode, pipeData.res);
                return;
            }
            const accessToken = (0, generateNewToken_1.generateNewToken)({
                email: selectedAdmin.email,
                id: selectedAdmin.userId,
            }, "1h");
            const refreshToken = (0, generateNewToken_1.generateNewToken)({
                email: selectedAdmin.email,
                id: selectedAdmin.userId,
            }, "2d");
            selectedAdmin.userToken = accessToken;
            selectedAdmin.refreshToken = refreshToken;
            selectedAdmin.loginTryCount += 1;
            selectedAdmin.requestIp = pipeData.req.clientIp;
            yield selectedAdmin.save();
            const _a = selectedAdmin.toObject(), { password: NOT_SEND_THIS_FIELD_1, _id, loginTryCount, bpmnTryCount, formIoTryCount, requestIp } = _a, others = __rest(_a, ["password", "_id", "loginTryCount", "bpmnTryCount", "formIoTryCount", "requestIp"]);
            pipeData.res.status(DoneStatusCode_1.DoneStatusCode.done.standardStatusCode).send({
                data: others,
            });
            return selectedAdmin;
        });
    }
    static reSubmitUserAuth(pipeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, lastName } = pipeData.req.body;
            // const currentUser = (await AdminUserModel.findOne({
            //   email,
            // }))!;
            // currentUser.name = name;
            // currentUser.lastName = lastName;
        });
    }
}
exports._auth_services = _auth_services;
