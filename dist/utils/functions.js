"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeapons = exports.getEnemy = exports.getWeaponDamage = exports.createTreasure = exports.createState = exports.getOptionLevels = exports.doBattle = exports.getDamage = void 0;
const enums_1 = require("../utils/enums");
const constants_1 = require("./constants");
const weapons_json_1 = __importDefault(require("../data/weapons.json"));
const enemies_json_1 = __importDefault(require("../data/enemies.json"));
const guards_1 = require("./guards");
const getDamage = (weapon, enemy) => {
    if (enemy.type == enums_1.EnemiesTypes.FLYING) {
        return ((weapon.damage * weapon.range) /
            (constants_1.fightVariables.maxRange / constants_1.fightVariables.maxRangeMultiplier));
    }
    return weapon.damage;
};
exports.getDamage = getDamage;
const doBattle = (player, weapon, enemy) => {
    let attacker = player;
    let defender = enemy;
    while (enemy.health > 0) {
        const damage = (0, guards_1.isPlayer)(attacker) ? (0, exports.getDamage)(weapon, enemy) : enemy.damage;
        defender.health -= damage;
        console.log(`${(0, guards_1.isEnemy)(attacker) ? 'Enemy' : 'Player'} ataca a ${(0, guards_1.isEnemy)(defender) ? 'Enemy' : 'Player'} por ${damage} puntos de daño. Vida de ${(0, guards_1.isEnemy)(defender) ? 'Enemy' : 'Player'} ${defender.health}`);
        const random = Math.floor(Math.random() * 100);
        if ((0, guards_1.isPlayer)(attacker) && random > weapon.speed * 10) {
            attacker = enemy;
            defender = player;
        }
        else if ((0, guards_1.isEnemy)(attacker)) {
            attacker = player;
            defender = enemy;
        }
        if (player.health <= 0) {
            player.health = 0;
            return;
        }
    }
};
exports.doBattle = doBattle;
const getOptionLevels = (levels) => {
    const randomIndexes = [];
    while (randomIndexes.length < 3) {
        const randomIndex = Math.floor(Math.random() * levels.length);
        if (!randomIndexes.includes(randomIndex)) {
            randomIndexes.push(randomIndex);
        }
    }
    return randomIndexes.map((index) => levels[index]);
};
exports.getOptionLevels = getOptionLevels;
const createState = (type, player, level, options, enemy) => {
    const state = {
        id: 0,
        player,
        level,
        options,
        state: type,
        enemy: enemy !== null && enemy !== void 0 ? enemy : '',
        voting: '0x1aaa677F2CAed6b68F6aa31db37Ec3b159b86622', //Replaced in contract
    };
    return state;
};
exports.createState = createState;
function createTreasure(player, mimic) {
    let randomIndex = Math.floor(Math.random() * weapons_json_1.default.length);
    if (player.weapons.length != weapons_json_1.default.length) {
        while (player.weapons.find((weapon) => weapon === weapons_json_1.default[randomIndex].name)) {
            randomIndex = Math.floor(Math.random() * weapons_json_1.default.length);
        }
    }
    if (mimic) {
        if (Math.random() > 0.5) {
            mimic = false;
        }
    }
    return {
        isMimic: mimic,
        weapon: weapons_json_1.default[randomIndex],
    };
}
exports.createTreasure = createTreasure;
function getWeaponDamage(weapon, enemy) {
    if (enemy.type == enums_1.EnemiesTypes.FLYING) {
        return weapon.damage * (weapon.range / (10 / 1.5));
    }
    return weapon.damage;
}
exports.getWeaponDamage = getWeaponDamage;
function getEnemy(name) {
    return enemies_json_1.default.find((enemy) => enemy.name === name);
}
exports.getEnemy = getEnemy;
function getWeapons(player) {
    return player.weapons.map((playerWeapon) => {
        var _a, _b, _c, _d;
        const weapon = weapons_json_1.default.find((weapon) => weapon.name === playerWeapon);
        return {
            name: (_a = weapon === null || weapon === void 0 ? void 0 : weapon.name) !== null && _a !== void 0 ? _a : '',
            damage: (_b = weapon === null || weapon === void 0 ? void 0 : weapon.damage) !== null && _b !== void 0 ? _b : 1,
            range: (_c = weapon === null || weapon === void 0 ? void 0 : weapon.range) !== null && _c !== void 0 ? _c : 1,
            speed: (_d = weapon === null || weapon === void 0 ? void 0 : weapon.speed) !== null && _d !== void 0 ? _d : 1,
        };
    });
}
exports.getWeapons = getWeapons;
