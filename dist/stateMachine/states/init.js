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
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../utils/enums");
const functions_1 = require("../../utils/functions");
class InitialState {
    onEnter() {
        this.state = enums_1.StatesTypes.Rest;
        this.level = {
            name: 'home',
            enemies: [],
        };
        this.player = {
            health: 100,
            weapons: [],
        };
        return (0, functions_1.createState)(this.state, this.player, this.level, []);
    }
    onLeave() {
        return __awaiter(this, void 0, void 0, function* () {
            const newState = 'Treasure';
            return newState;
        });
    }
}
exports.default = InitialState;
