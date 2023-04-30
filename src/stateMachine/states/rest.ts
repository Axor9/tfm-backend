import dotenv from 'dotenv'

import { State, AvailableStates } from '../types'
import { Level, Player } from '../../types/types'
import { StatesTypes } from '../../utils/enums'

dotenv.config()

export default class RestState implements State {
  state?: StatesTypes
  player?: Player
  level?: Level
  votingAddress?: string

  onEnter() {}

  onLeave() {
    const newState: AvailableStates = 'Treasure'
    return newState
  }
}
