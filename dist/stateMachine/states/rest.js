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
const encoder_1 = require("../../utils/encoder");
const functions_1 = require("../../utils/functions");
const levels_json_1 = __importDefault(require("../../data/levels.json"));
dotenv_1.default.config();
class RestState {
    onEnter(player, level) {
        this.state = enums_1.StatesTypes.Rest;
        this.player = player;
        this.level = level;
        const options = (0, functions_1.getOptionLevels)(levels_json_1.default).map((level) => {
            return {
                optionType: enums_1.OptionTypes.Level,
                data: (0, encoder_1.encodeOption)(level),
                option: (0, encoder_1.stringToBytes32)(`Level ${level.name}`),
            };
        });
        const state = (0, functions_1.createState)(this.state, this.player, this.level, [...options]);
        return state;
    }
    onLeave(option) {
        return __awaiter(this, void 0, void 0, function* () {
            if (option.optionType == enums_1.OptionTypes.Level) {
                this.level = (0, encoder_1.decodeLevelOption)(option.data);
            }
            if (Math.random() > 0.5) {
                return 'Battle';
            }
            return 'Treasure';
        });
    }
}
exports.default = RestState;
