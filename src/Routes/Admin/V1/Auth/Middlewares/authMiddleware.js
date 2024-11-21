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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const ErrorSenderToClient_1 = require("../../../../../Constants/Errors/ErrorSenderToClient");
const Languages_1 = require("../../../../../Constants/Languages");
const ErrorsStatusCode_1 = require("../../../../../Constants/Errors/ErrorsStatusCode");
const UserModel_1 = require("../../../../../MongodbDataManagement/MongoDB_Models/User/UserModel");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const language = req.headers.language;
    const userToken = req.headers.token;
    if (!userToken || typeof userToken !== "string") {
        (0, ErrorSenderToClient_1.ErrorSenderToClient)({
            data: {},
            expectedType: "string",
            errorData: {
                errorKey: "NOT_FOUND_TOKEN",
                errorMessage: (0, Languages_1.getWordBasedOnCurrLang)(language, "noToken"),
            },
        }, ErrorsStatusCode_1.ErrorsStatusCode.notAuthorized.standardStatusCode, res);
        return;
    }
    try {
        const desiredUser = yield UserModel_1.AdminUserModel.findOne({ userToken });
        if (!desiredUser) {
            throw (0, Languages_1.getWordBasedOnCurrLang)(language, "notValidToken");
        }
        req.userId = desiredUser.userId;
        next();
    }
    catch (err) {
        res.status(401).json({
            error: err || (0, Languages_1.getWordBasedOnCurrLang)(language, "notValidToken"),
        });
    }
});
exports.authMiddleware = authMiddleware;
