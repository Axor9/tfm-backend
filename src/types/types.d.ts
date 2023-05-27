import { OptionTypes, StatesTypes } from '../utils/enums'

export interface Weapon {
  name: string
  damage: number
  range: number
  speed: number
}

export interface Enemy {
  name: string
  health: number
  damage: number
  type: EnemiesTypes
}

export interface Treasure {
  weapon: Weapon
  isMimic: boolean
}

export interface Player {
  health: number
  weapons: string[]
}

export interface Level {
  name: string
  enemies: string[]
}

export interface State {
  id: number
  state: StatesTypes
  player: Player
  voting: string
  level: Level
  enemy: string
  options: Option[]
}

export interface Option {
  optionType: OptionTypes
  data?: string
  option: string // bytes32 as string
}
