"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoRoutesV1 = void 0;
// Express
const express_1 = require("express");
// Express
// SubRoutes
const Get_BPMN_File_1 = require("./Routes/Get_BPMN_File");
const Get_Formio_File_1 = require("./Routes/Get_Formio_File");
// SubRoutes
// Middlewares
const authMiddleware_1 = require("../../Admin/V1/Auth/Middlewares/authMiddleware");
// Middlewares
exports.DemoRoutesV1 = (0, express_1.Router)();
exports.DemoRoutesV1.get("/bpmn-file", authMiddleware_1.authMiddleware, Get_BPMN_File_1.Get_BPMN_File);
exports.DemoRoutesV1.get("/formio-file", authMiddleware_1.authMiddleware, Get_Formio_File_1.Get_Formio_File);
