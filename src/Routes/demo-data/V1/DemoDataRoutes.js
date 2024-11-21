"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoDataRoutes = void 0;
// Express
const express_1 = require("express");
// Express
// Routes
const AdminRoutesV1_1 = require("./V1/AdminRoutesV1");
// Routes
exports.DemoDataRoutes = (0, express_1.Router)();
exports.DemoDataRoutes.use("/v1", AdminRoutesV1_1.AdminRoutesV1);
