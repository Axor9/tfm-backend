export enum OptionTypes {
  Skip,
  Level,
  Weapon,
  Treasure,
}

export enum StatesTypes {
  Rest,
  Battle,
  Treasure,
  Init,
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

export const battleEncodeTypes = {
  battle: {
    weapon: {
      name: 'string',
      damage: 'uint256',
      range: 'uint256',
    },
    enemy: {
      name: 'string',
      health: 'uint256',
      damage: 'uint256',
    },
  },
}

export const levelEncodeTypes = {
  level: {
    name: 'string',
    enemies: 'string[]',
  },
}
