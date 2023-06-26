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
const encoder_1 = require("../../utils/encoder");
const functions_1 = require("../../utils/functions");
const constants_1 = require("../../utils/constants");
dotenv_1.default.config();
class BattleState {
    onEnter(player, level, previousState) {
        const randomIndex = Math.floor(Math.random() * level.enemies.length);
        this.state = enums_1.StatesTypes.Battle;
        this.level = level;
        this.player = Object.assign({}, player);
        this.enemy =
            previousState == enums_1.StatesTypes.Treasure
                ? constants_1.mimic
                : (0, functions_1.getEnemy)(this.level.enemies[randomIndex]);
        if (!this.enemy)
            throw 'Error no enemy found';
        if (previousState == enums_1.StatesTypes.Treasure) {
            this.player.weapons.pop();
        }
        const options = (0, functions_1.getWeapons)(this.player).map((weapon) => {
            return {
                optionType: enums_1.OptionTypes.Weapon,
                data: (0, encoder_1.encodeOption)(weapon),
                option: (0, encoder_1.stringToBytes32)(`Weapon ${weapon.name}`),
            };
        });
        const state = (0, functions_1.createState)(this.state, this.player, this.level, [
            ...options,
            {
                optionType: enums_1.OptionTypes.Skip,
                data: __1.web3.utils.asciiToHex('Skip'),
                option: (0, encoder_1.stringToBytes32)('Skip'),
            },
        ], this.enemy.name);
        this.player = player;
        return state;
    }
    onLeave(option) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (option.optionType == enums_1.OptionTypes.Weapon) {
                const weapon = (0, encoder_1.decodeWeaponOption)(option.data);
                if (!this.player || !this.enemy)
                    throw 'Error no player or enemy';
                (0, functions_1.doBattle)(this.player, weapon, this.enemy);
            }
            if (option.optionType == enums_1.OptionTypes.Skip) {
                if (!this.player)
                    throw 'Error no player';
                this.player.health -= 10;
            }
            if (((_a = this.player) === null || _a === void 0 ? void 0 : _a.health) == 0)
                return 'Final';
            return 'Rest';
        });
    }
}
exports.default = BattleState;
