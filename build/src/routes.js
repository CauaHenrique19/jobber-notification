"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helthRoutes = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const router = (0, express_1.Router)();
function helthRoutes() {
    router.get("/notification-health", (_req, res) => {
        res.status(http_status_codes_1.StatusCodes.OK).send("Notification service is healthy and OK.");
    });
    return router;
}
exports.helthRoutes = helthRoutes;
//# sourceMappingURL=routes.js.map