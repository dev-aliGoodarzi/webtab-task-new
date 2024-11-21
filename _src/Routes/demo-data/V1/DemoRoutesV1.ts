// Express
import { Router } from "express";
// Express

// SubRoutes
import { Get_BPMN_File } from "./Routes/Get_BPMN_File";
import { Get_Formio_File } from "./Routes/Get_Formio_File";
// SubRoutes

// Middlewares
import { authMiddleware } from "../../Admin/V1/Auth/Middlewares/authMiddleware";
// Middlewares

export const DemoRoutesV1 = Router();

DemoRoutesV1.get("/bpmn-file", authMiddleware, Get_BPMN_File);
DemoRoutesV1.get("/formio-file", authMiddleware, Get_Formio_File);
