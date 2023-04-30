import { web3 } from '..'

import { Level, Player, State, Option, Treasure, Battle } from '../types/types'
import {
  StatesTypes,
  battleEncodeTypes,
  levelEncodeTypes,
  treasureEncodeTypes,
} from '../utils/enums'
import { isBattle, isLevel, isTreasure } from './guards'

import weapons from '../data/weapons.json'

export const getOptionLevels = (levels: Level[]) => {
  const randomIndexes: number[] = []
  while (randomIndexes.length < 3) {
    const randomIndex = Math.floor(Math.random() * levels.length)
    if (!randomIndexes.includes(randomIndex)) {
      randomIndexes.push(randomIndex)
    }
  }

  return randomIndexes.map((index) => levels[index])
}

export const encodeOption = (data: Treasure | Battle | Level) => {
  if (isBattle(data)) {
    return web3.eth.abi.encodeParameter(battleEncodeTypes, data)
  }

  if (isLevel(data)) {
    return web3.eth.abi.encodeParameter(levelEncodeTypes, data)
  }

  if (isTreasure(data)) {
    return web3.eth.abi.encodeParameter(treasureEncodeTypes, data)
  }
}

export const createState = (
  type: StatesTypes,
  player: Player,
  level: Level,
  options: Option[]
) => {
  const state: State = {
    player,
    level,
    options,
    state: type,
    voting: '0x1aaa677F2CAed6b68F6aa31db37Ec3b159b86622', //Replaced in contract
  }

  return state
}

export function stringToBytes32(text: string): string {
  const hex = web3.utils.utf8ToHex(text)
  return web3.utils.padRight(hex, 64)
}

export function createTreasure(mimic: boolean): Treasure {
  const randomIndex = Math.floor(Math.random() * weapons.length)

  if (mimic) {
    if (Math.random() > 0.1) {
      mimic = false
    }
  }

  return {
    isMimic: mimic,
    weapon: weapons[randomIndex],
  }
}
