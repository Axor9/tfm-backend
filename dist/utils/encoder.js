"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeWeaponOption = exports.decodeTreasureOption = exports.decodeLevelOption = exports.encodeOption = exports.stringToBytes32 = void 0;
const __1 = require("..");
const guards_1 = require("./guards");
const constants_1 = require("../utils/constants");
function stringToBytes32(text) {
    const hex = __1.web3.utils.utf8ToHex(text);
    return __1.web3.utils.padRight(hex, 64);
}
exports.stringToBytes32 = stringToBytes32;
const encodeOption = (data) => {
    if ((0, guards_1.isWeapon)(data)) {
        return __1.web3.eth.abi.encodeParameter(constants_1.weaponEncodeTypes, data);
    }
    if ((0, guards_1.isLevel)(data)) {
        return __1.web3.eth.abi.encodeParameter(constants_1.levelEncodeTypes, data);
    }
    if ((0, guards_1.isTreasure)(data)) {
        return __1.web3.eth.abi.encodeParameter(constants_1.treasureEncodeTypes, data);
    }
};
exports.encodeOption = encodeOption;
const decodeLevelOption = (data) => {
    if (!data)
        throw 'Cant decode level option';
    const level = __1.web3.eth.abi.decodeParameter(constants_1.levelEncodeTypes, data);
    return {
        name: level.name,
        enemies: level.enemies,
    };
};
exports.decodeLevelOption = decodeLevelOption;
const decodeTreasureOption = (data) => {
    if (!data)
        throw 'Cant decode treasure option';
    const treasure = __1.web3.eth.abi.decodeParameter(constants_1.treasureEncodeTypes, data);
    return {
        isMimic: treasure.isMimic,
        weapon: treasure.weapon,
    };
};
exports.decodeTreasureOption = decodeTreasureOption;
const decodeWeaponOption = (data) => {
    if (!data)
        throw 'Cant decode weapon option';
    const weapon = __1.web3.eth.abi.decodeParameter(constants_1.weaponEncodeTypes, data);
    return {
        name: weapon.name,
        damage: weapon.damage,
        range: weapon.range,
        speed: weapon.speed,
    };
};
exports.decodeWeaponOption = decodeWeaponOption;
