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
const __1 = require("../../");
const enums_1 = require("../../utils/enums");
const functions_1 = require("../../utils/functions");
const encoder_1 = require("../../utils/encoder");
dotenv_1.default.config();
class TreasureState {
    onEnter(player, level) {
        this.state = enums_1.StatesTypes.Treasure;
        this.level = level;
        this.player = player;
        const treasure = (0, functions_1.createTreasure)(this.player, level.name === 'home' ? false : true);
        const state = (0, functions_1.createState)(this.state, this.player, this.level, [
            {
                optionType: enums_1.OptionTypes.Treasure,
                data: (0, encoder_1.encodeOption)(treasure),
                option: (0, encoder_1.stringToBytes32)('Treasure'),
            },
            {
                optionType: enums_1.OptionTypes.Skip,
                data: __1.web3.utils.asciiToHex('Skip'),
                option: (0, encoder_1.stringToBytes32)('Skip'),
            },
        ]);
        return state;
    }
    onLeave(option) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (option.optionType == enums_1.OptionTypes.Treasure) {
                const treasure = (0, encoder_1.decodeTreasureOption)(option.data);
                (_a = this.player) === null || _a === void 0 ? void 0 : _a.weapons.push(treasure.weapon.name);
                if (treasure.isMimic)
                    return 'Battle';
            }
            return 'Rest';
        });
    }
}
exports.default = TreasureState;
