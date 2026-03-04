"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = require("body-parser");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const requestLogger_1 = require("./middleware/requestLogger");
const errorHandler_1 = require("./middleware/errorHandler");
const env_1 = require("./config/env");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: env_1.config.cors.origin,
    credentials: env_1.config.cors.credentials
}));
app.use((0, helmet_1.default)());
app.use((0, body_parser_1.json)());
app.use((0, cookie_parser_1.default)());
app.use(requestLogger_1.requestLogger);
// Import routes
const health_routes_1 = __importDefault(require("./modules/health/health.routes"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const subject_routes_1 = __importDefault(require("./modules/subjects/subject.routes"));
const video_routes_1 = __importDefault(require("./modules/videos/video.routes"));
const progress_routes_1 = __importDefault(require("./modules/progress/progress.routes"));
// Mount routes
app.use('/api/health', health_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/subjects', subject_routes_1.default);
app.use('/api/videos', video_routes_1.default);
app.use('/api/progress', progress_routes_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
