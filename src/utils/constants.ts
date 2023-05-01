export const fightVariables = {
  maxRange: 10,
  maxRangeMultiplier: 1.5,
}

export const stateEncodeTypes = {
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
}

export const treasureEncodeTypes = {
  treasure: {
    isMimic: 'bool',
    weapon: {
      name: 'string',
      damage: 'uint256',
      range: 'uint256',
    },
  },
}

export const weaponEncodeTypes = {
  weapon: {
    name: 'string',
    damage: 'uint256',
    range: 'uint256',
    speed: 'uint256',
  },
}

export const levelEncodeTypes = {
  level: {
    name: 'string',
    enemies: 'string[]',
  },
}
