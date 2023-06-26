"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const enums_1 = require("../../utils/enums");
const functions_1 = require("../../utils/functions");
dotenv_1.default.config();
class FinalState {
    onEnter(player, level) {
        this.state = enums_1.StatesTypes.Final;
        this.player = player;
        this.level = level;
        const state = (0, functions_1.createState)(this.state, this.player, this.level, []);
        return state;
    }
    onLeave() {
        return __awaiter(this, void 0, void 0, function* () {
            return 'Final';
        });
    }
}
exports.default = FinalState;
