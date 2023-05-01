import { Level, Player, Treasure, Weapon } from '../types/types'

export function isObject(obj: any): obj is Record<string, any> {
  return typeof obj === 'object' && obj !== null
}

export function isTreasure(obj: any): obj is Treasure {
  return isObject(obj) && obj.weapon !== undefined && obj.isMimic !== undefined
}

export function isLevel(obj: any): obj is Level {
  return isObject(obj) && obj.name !== undefined && Array.isArray(obj.enemies)
}

export function isWeapon(obj: any): obj is Weapon {
  return (
    isObject(obj) &&
    'name' in obj &&
    'range' in obj &&
    'damage' in obj &&
    'speed' in obj
  )
}

export function isPlayer(obj: any): obj is Player {
  return isObject(obj) && 'health' in obj && 'weapons' in obj
}

export function isEnemy(obj: any): obj is Player {
  return isObject(obj) && 'health' in obj && 'damage' in obj && 'type' in obj
}
