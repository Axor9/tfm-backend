import { web3 } from '..'

import { isWeapon, isLevel, isTreasure } from './guards'
import { Level, Treasure, Weapon } from '../types/types'
import {
  levelEncodeTypes,
  treasureEncodeTypes,
  weaponEncodeTypes,
} from '../utils/constants'

export function stringToBytes32(text: string): string {
  const hex = web3.utils.utf8ToHex(text)
  return web3.utils.padRight(hex, 64)
}

export const encodeOption = (data: Treasure | Weapon | Level) => {
  if (isWeapon(data)) {
    return web3.eth.abi.encodeParameter(weaponEncodeTypes, data)
  }

  if (isLevel(data)) {
    return web3.eth.abi.encodeParameter(levelEncodeTypes, data)
  }

  if (isTreasure(data)) {
    return web3.eth.abi.encodeParameter(treasureEncodeTypes, data)
  }
}

export const decodeLevelOption = (data?: string): Level => {
  if (!data) throw 'Cant decode level option'

  const level = web3.eth.abi.decodeParameter(levelEncodeTypes, data)

  return {
    name: level.name,
    enemies: level.enemies,
  } as Level
}

export const decodeTreasureOption = (data?: string): Treasure => {
  if (!data) throw 'Cant decode treasure option'

  const treasure = web3.eth.abi.decodeParameter(treasureEncodeTypes, data)

  return {
    isMimic: treasure.isMimic,
    weapon: treasure.weapon,
  } as Treasure
}

export const decodeWeaponOption = (data?: string): Weapon => {
  if (!data) throw 'Cant decode weapon option'

  const weapon = web3.eth.abi.decodeParameter(weaponEncodeTypes, data)

  return {
    name: weapon.name,
    damage: weapon.damage,
    range: weapon.range,
    speed: weapon.speed,
  } as Weapon
}
