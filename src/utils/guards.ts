import { Battle, Level, Treasure } from '../types/types'

export function isObject(obj: any): obj is Record<string, any> {
  return typeof obj === 'object' && obj !== null
}

export function isTreasure(obj: any): obj is Treasure {
  return isObject(obj) && obj.weapon !== undefined && obj.isMimic !== undefined
}

export function isLevel(obj: any): obj is Level {
  return isObject(obj) && obj.name !== undefined && Array.isArray(obj.enemies)
}

export function isBattle(obj: any): obj is Battle {
  return isObject(obj) && 'weapon' in obj && 'enemy' in obj
}
