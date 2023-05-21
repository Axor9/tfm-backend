import { Enemy, Level, Player } from '../types/types'
import { StatesTypes } from '../utils/enums'
import { State as StateType } from '../types/types'

export type AvailableStates = keyof typeof StatesTypes

export type State = {
  state?: StatesTypes
  player?: Player
  level?: Level
  enemy?: Enemy

  onEnter(
    address?: string,
    player?: Player,
    level?: Level,
    previousState?: StatesTypes
  ): void
  onLeave(address: string): Promise<AvailableStates>
}

export type StateMachine = {
  init(): void
  changeState(): void
  getCurrentState(): Promise<StateType>
  getStates(): Promise<StateType[]>
}
