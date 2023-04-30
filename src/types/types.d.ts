import { OptionTypes, StatesTypes } from '../utils/enums'
import { BN } from 'web3-core'

export interface Weapon {
  name: string
  damage: number
  range: number
}

export interface Enemy {
  name: string
  health: number
  damage: number
}

export interface Battle {
  weapon: Weapon
  enemy: Enemy
}

export interface Treasure {
  weapon: Weapon
  isMimic: boolean
}

export interface Player {
  health: any
  weapons: string[]
}

export interface Level {
  name: string
  enemies: string[]
}

export interface State {
  state: StatesTypes
  player: Player
  voting: string
  level: Level
  options: Option[]
}

export interface Option {
  optionType: OptionTypes
  data?: string
  option: string // bytes32 as string
}
