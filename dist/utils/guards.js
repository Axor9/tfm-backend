"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEnemy = exports.isPlayer = exports.isWeapon = exports.isLevel = exports.isTreasure = exports.isObject = void 0;
function isObject(obj) {
    return typeof obj === 'object' && obj !== null;
}
exports.isObject = isObject;
function isTreasure(obj) {
    return isObject(obj) && obj.weapon !== undefined && obj.isMimic !== undefined;
}
exports.isTreasure = isTreasure;
function isLevel(obj) {
    return isObject(obj) && obj.name !== undefined && Array.isArray(obj.enemies);
}
exports.isLevel = isLevel;
function isWeapon(obj) {
    return (isObject(obj) &&
        'name' in obj &&
        'range' in obj &&
        'damage' in obj &&
        'speed' in obj);
}
exports.isWeapon = isWeapon;
function isPlayer(obj) {
    return isObject(obj) && 'health' in obj && 'weapons' in obj;
}
exports.isPlayer = isPlayer;
function isEnemy(obj) {
    return isObject(obj) && 'health' in obj && 'damage' in obj && 'type' in obj;
}
exports.isEnemy = isEnemy;
