import { State, AvailableStates } from '../types'
import { Level, Player } from '../../types/types'
import { StatesTypes } from '../../utils/enums'
import { web3 } from '../../'

export default class InitialState implements State {
  state?: StatesTypes
  player?: Player
  level?: Level
  votingAddress?: string

  async onEnter() {
    this.state = StatesTypes.Rest
    this.level = {
      name: 'home',
      enemies: [],
    }
    this.player = {
      health: 100,
      weapons: [],
    }
  }

  onLeave() {
    const newState: AvailableStates = 'Treasure'
    return newState
  }
}
