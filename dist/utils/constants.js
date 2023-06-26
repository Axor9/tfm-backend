"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mimic = exports.levelEncodeTypes = exports.weaponEncodeTypes = exports.treasureEncodeTypes = exports.stateEncodeTypes = exports.fightVariables = void 0;
exports.fightVariables = {
    maxRange: 10,
    maxRangeMultiplier: 1.5,
};
exports.stateEncodeTypes = {
    state: {
        state: 'uint256',
        voting: 'address',
        player: {
            health: 'uint',
            weapons: 'string[]',
        },
        level: {
            name: 'string',
            enemies: 'string[]',
        },
        options: [
            {
                optionType: 'uint256',
                data: 'bytes',
                option: 'bytes32',
            },
        ],
    },
};
exports.treasureEncodeTypes = {
    treasure: {
        isMimic: 'bool',
        weapon: {
            name: 'string',
            damage: 'uint256',
            range: 'uint256',
        },
    },
};
exports.weaponEncodeTypes = {
    weapon: {
        name: 'string',
        damage: 'uint256',
        range: 'uint256',
        speed: 'uint256',
    },
};
exports.levelEncodeTypes = {
    level: {
        name: 'string',
        enemies: 'string[]',
    },
};
exports.mimic = {
    name: 'mimic',
    health: 40,
    damage: 20,
    type: 0,
};
