// Express
import { Router } from "express";
// Express

// Routes
import { DemoRoutesV1 } from "./V1/DemoRoutesV1";
import { Get_BPMN_File } from "./V1/Routes/Get_BPMN_File";
// Routes

export const DemoDataRoutes = Router();

DemoDataRoutes.use("/v1", DemoRoutesV1);
