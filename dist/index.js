"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.stateMachine = exports.web3 = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const web3_1 = __importDefault(require("web3"));
const stateMachine_1 = __importDefault(require("./stateMachine"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const port = process.env.SERVER_PORT;
const provider = new web3_1.default.providers.HttpProvider((_a = process.env.WEB3_PROVIDER_URL) !== null && _a !== void 0 ? _a : '');
const web3 = new web3_1.default(provider);
exports.web3 = web3;
const stateMachine = new stateMachine_1.default(process.env.CONTRACT_ADDRESS);
exports.stateMachine = stateMachine;
app.use(express_1.default.json());
app.use('', routes_1.default);
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
