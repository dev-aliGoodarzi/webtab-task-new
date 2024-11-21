"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Get_BPMN_File = void 0;
const Languages_1 = require("../../../../Constants/Languages");
const checkIsValidByPattern_1 = require("../../../../Validators/checkIsValidByPattern");
const formats_1 = require("../../../../Formats/formats");
const addDataToExistingObject_1 = require("../../../../Utils/DataAdder/addDataToExistingObject");
const Get_BPMN_File = (req, res) => {
    const language = req.headers.language;
    const { fileId } = req.query;
    const errors = {};
    console.log("x");
    try {
        (0, checkIsValidByPattern_1.checkIsValidByPattern)(fileId, formats_1.formats.oneOrTwo, (0, Languages_1.getWordBasedOnCurrLang)(language, "notInRange"), "fileId", (errData, errMessage, errorKey) => {
            errors[errorKey] = (0, addDataToExistingObject_1.addDataToExistingObject)(errors[errorKey], {
                errMessage,
            });
        });
        if (Object.keys(errors).length > 0) {
            res.status(422).send({
                hasError: true,
                errorData: errors,
            });
            return;
        }
    }
    catch (err) { }
};
exports.Get_BPMN_File = Get_BPMN_File;
