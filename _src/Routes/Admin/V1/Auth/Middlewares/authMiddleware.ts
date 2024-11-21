import { Request, Response } from "express";
import { ErrorSenderToClient } from "../../../../../Constants/Errors/ErrorSenderToClient";
import { getWordBasedOnCurrLang } from "../../../../../Constants/Languages";
import { T_ValidLanguages } from "../../../../../Constants/Languages/languageTypes";
import { ErrorsStatusCode } from "../../../../../Constants/Errors/ErrorsStatusCode";
import { AdminUserModel } from "../../../../../MongodbDataManagement/MongoDB_Models/User/UserModel";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../../../../../global";

export const authMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: () => void
) => {
  const language = req.headers.language as T_ValidLanguages;
  const userToken = req.headers.token;

  if (!userToken || typeof userToken !== "string") {
    ErrorSenderToClient(
      {
        data: {},
        expectedType: "string",
        errorData: {
          errorKey: "NOT_FOUND_TOKEN",
          errorMessage: getWordBasedOnCurrLang(
            language as T_ValidLanguages,
            "noToken"
          ),
        },
      },
      ErrorsStatusCode.notAuthorized.standardStatusCode,
      res
    );
    return;
  }

  try {
    const desiredUser = await AdminUserModel.findOne({ userToken });
    if (!desiredUser) {
      throw getWordBasedOnCurrLang(language, "notValidToken");
    }
    req.userId = desiredUser.userId;
    next();
  } catch (err) {
    res.status(401).json({
      error: err || getWordBasedOnCurrLang(language, "notValidToken"),
    });
  }
};
