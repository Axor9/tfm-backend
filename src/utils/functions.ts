import {
  Level,
  Player,
  State,
  Option,
  Treasure,
  Enemy,
  Weapon,
} from '../types/types'

import { StatesTypes, EnemiesTypes } from '../utils/enums'
import { fightVariables } from './constants'

import weapons from '../data/weapons.json'
import enemies from '../data/enemies.json'
import { isEnemy, isPlayer } from './guards'

export const getDamage = (weapon: Weapon, enemy: Enemy): number => {
  if (enemy.type == EnemiesTypes.FLYING) {
    return (
      (weapon.damage * weapon.range) /
      (fightVariables.maxRange / fightVariables.maxRangeMultiplier)
    )
  }
  return weapon.damage
}

export const doBattle = (player: Player, weapon: Weapon, enemy: Enemy) => {
  let attacker: Player | Enemy = player
  let defender: Player | Enemy = enemy

  while (enemy.health > 0) {
    const damage = isPlayer(attacker) ? getDamage(weapon, enemy) : enemy.damage
    defender.health -= damage

    console.log(
      `${isEnemy(attacker) ? 'Enemy' : 'Player'} ataca a ${
        isEnemy(defender) ? 'Enemy' : 'Player'
      } por ${damage} puntos de daño. Vida de ${
        isEnemy(defender) ? 'Enemy' : 'Player'
      } ${defender.health}`
    )
    const random = Math.floor(Math.random() * 100)
    if (isPlayer(attacker) && random > weapon.speed * 10) {
      attacker = enemy
      defender = player
    } else if (isEnemy(attacker)) {
      attacker = player
      defender = enemy
    }

    if (player.health <= 0) {
      return
    }
  }
}

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

export const createState = (
  type: StatesTypes,
  player: Player,
  level: Level,
  options: Option[],
  enemy?: string
) => {
  const state: State = {
    player,
    level,
    options,
    state: type,
    enemy: enemy ?? '',
    voting: '0x1aaa677F2CAed6b68F6aa31db37Ec3b159b86622', //Replaced in contract
  }

  return state
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

export function getWeaponDamage(weapon: Weapon, enemy: Enemy) {
  if (enemy.type == EnemiesTypes.FLYING) {
    return weapon.damage * (weapon.range / (10 / 1.5))
  }
  return weapon.damage
}

export function getEnemy(name: string): Enemy | undefined {
  return enemies.find((enemy) => enemy.name === name)
}

export function getWeapons(player: Player): Weapon[] {
  return player.weapons.map((playerWeapon) => {
    const weapon = weapons.find((weapon) => weapon.name === playerWeapon)

    return {
      name: weapon?.name ?? '',
      damage: weapon?.damage ?? 1,
      range: weapon?.range ?? 1,
      speed: weapon?.speed ?? 1,
    }
  })
}
