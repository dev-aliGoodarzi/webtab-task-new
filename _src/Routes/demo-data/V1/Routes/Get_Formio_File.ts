// Express
import { Request, Response } from "express";
// Express

// Constants
import { getWordBasedOnCurrLang } from "../../../../Constants/Languages";
import { T_ValidLanguages } from "../../../../Constants/Languages/languageTypes";
import { ErrorsStatusCode } from "../../../../Constants/Errors/ErrorsStatusCode";
import { ErrorSenderToClient } from "../../../../Constants/Errors/ErrorSenderToClient";
// Constants

// Validators
import { checkIsValidByPattern } from "../../../../Validators/checkIsValidByPattern";
// Validators

// Formats
import { formats } from "../../../../Formats/formats";
// Formats

// Utils
import { addDataToExistingObject } from "../../../../Utils/DataAdder/addDataToExistingObject";
// Utils

// Modules
import fs from "fs";
import path from "path";
// Modules

// Models
import { AdminUserModel } from "../../../../MongodbDataManagement/MongoDB_Models/User/UserModel";
// Models

// Types
import { CustomRequest } from "../../../../global";
// Types

export const Get_Formio_File = async (req: CustomRequest, res: Response) => {
  const language = req.headers.language as T_ValidLanguages;
  const { fileId } = req.query;

  const errors: { [key: string]: any } = {};

  const { userId } = req;

  try {
    checkIsValidByPattern(
      fileId as string,
      formats.oneOrTwo,
      getWordBasedOnCurrLang(language, "notInRange"),
      "fileId",
      (errData, errMessage, errorKey) => {
        errors[errorKey] = addDataToExistingObject(errors[errorKey], {
          errMessage,
        });
      }
    );

    const desiredUserData = await AdminUserModel.findOne({
      userId,
    });

    if (!desiredUserData) {
      ErrorSenderToClient(
        {
          data: {},
          errorData: {
            errorKey: "",
            errorMessage: getWordBasedOnCurrLang(
              language as T_ValidLanguages,
              "userNotExist"
            ),
          },
          expectedType: "string",
        },
        ErrorsStatusCode.notExist.standardStatusCode,
        res
      );
      return;
    }

    desiredUserData.formIoTryCount += 1;

    await desiredUserData.save();

    if (fileId === "1") {
      const filePath = path.resolve(
        __dirname,
        "./../../../../../Files/Form/1.json"
      );
      const file = await fs.promises.readFile(filePath);

      res.status(200).send({
        requestedFile: fileId,
        desiredUserData: desiredUserData.email,
        data: file.toString(),
      });
      return;
    }

    if (fileId === "2") {
      const filePath = path.resolve(
        __dirname,
        "./../../../../../Files/Form/2.json"
      );
      const file = await fs.promises.readFile(filePath);

      res.status(200).send({
        requestedFile: fileId,
        desiredUserData: desiredUserData.email,
        data: file.toString(),
      });
      return;
    }

    if (Object.keys(errors).length > 0) {
      res.status(ErrorsStatusCode.notAcceptable.standardStatusCode).send({
        hasError: true,
        errorData: errors,
      });
      return;
    }
  } catch (err) {
    res.status(ErrorsStatusCode.notAcceptable.standardStatusCode).send({
      hasError: true,
      errorData: err,
    });
  }
};
