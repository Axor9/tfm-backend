import {
  Enemy,
  Level,
  Option,
  Player,
  State as StateObject,
} from '../types/types'
import { StatesTypes } from '../utils/enums'
import { State as StateType } from '../types/types'

export type AvailableStates = keyof typeof StatesTypes

export type State = {
  state?: StatesTypes
  player?: Player
  level?: Level
  enemy?: Enemy

  onEnter(
    player?: Player,
    level?: Level,
    previousState?: StatesTypes
  ): StateObject
  onLeave(option?: Option): Promise<AvailableStates>
}

export type StateMachine = {
  init(): void
  changeState(): void
  synchronizeState(contract: string): Promise<void>
  getCurrentState(): Promise<StateType>
  getStates(): Promise<StateType[]>
  finishGame(): Promise<void>
}
