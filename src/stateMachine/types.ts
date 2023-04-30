import { Level, Player } from '../types/types'
import { StatesTypes } from '../utils/enums'

export type AvailableStates = keyof typeof StatesTypes

export type State = {
  state?: StatesTypes
  player?: Player
  level?: Level
  votingAddress?: string

  onEnter(address?: string, player?: Player, level?: Level): void
  onLeave(address: string): AvailableStates
}

export type StateMachine = {
  init(): void
  changeState(): void
  getCurrentState(): void
}
