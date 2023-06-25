import { State, AvailableStates } from '../types'
import { Level, Player } from '../../types/types'
import { StatesTypes } from '../../utils/enums'
import { createState } from '../../utils/functions'

export default class InitialState implements State {
  state?: StatesTypes
  player?: Player
  level?: Level

  onEnter() {
    this.state = StatesTypes.Rest
    this.level = {
      name: 'home',
      enemies: [],
    }
    this.player = {
      health: 100,
      weapons: [],
    }

    return createState(this.state, this.player, this.level, [])
  }

  async onLeave() {
    const newState: AvailableStates = 'Treasure'
    return newState
  }
}
