"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemiesTypes = exports.StatesTypes = exports.OptionTypes = void 0;
var OptionTypes;
(function (OptionTypes) {
    OptionTypes[OptionTypes["Skip"] = 0] = "Skip";
    OptionTypes[OptionTypes["Level"] = 1] = "Level";
    OptionTypes[OptionTypes["Weapon"] = 2] = "Weapon";
    OptionTypes[OptionTypes["Treasure"] = 3] = "Treasure";
})(OptionTypes = exports.OptionTypes || (exports.OptionTypes = {}));
var StatesTypes;
(function (StatesTypes) {
    StatesTypes[StatesTypes["Rest"] = 0] = "Rest";
    StatesTypes[StatesTypes["Battle"] = 1] = "Battle";
    StatesTypes[StatesTypes["Treasure"] = 2] = "Treasure";
    StatesTypes[StatesTypes["Final"] = 3] = "Final";
    StatesTypes[StatesTypes["Init"] = 4] = "Init";
})(StatesTypes = exports.StatesTypes || (exports.StatesTypes = {}));
var EnemiesTypes;
(function (EnemiesTypes) {
    EnemiesTypes[EnemiesTypes["LAND"] = 0] = "LAND";
    EnemiesTypes[EnemiesTypes["FLYING"] = 1] = "FLYING";
})(EnemiesTypes = exports.EnemiesTypes || (exports.EnemiesTypes = {}));
