"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoDataRoutes = void 0;
// Express
const express_1 = require("express");
// Express
// Routes
const DemoRoutesV1_1 = require("./V1/DemoRoutesV1");
// Routes
exports.DemoDataRoutes = (0, express_1.Router)();
exports.DemoDataRoutes.use("/v1", DemoRoutesV1_1.DemoRoutesV1);
