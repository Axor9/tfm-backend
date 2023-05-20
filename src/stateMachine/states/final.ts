import dotenv from 'dotenv'
import { web3 } from '../../'

import { State, AvailableStates } from '../types'
import { Enemy, Level, Option, Player } from '../../types/types'
import { OptionTypes, StatesTypes } from '../../utils/enums'
import { createState } from '../../utils/functions'
import { changeState } from '../../utils/contract'

dotenv.config()

export default class FinalState implements State {
  state?: StatesTypes
  player?: Player
  level?: Level

  onEnter(address: string, player: Player, level: Level) {
    this.state = StatesTypes.Final
    this.player = player
    this.level = level

    const state = createState(this.state, this.player, this.level, [])

    changeState(address, state)
  }

  async onLeave(address: string) {
    return 'Final' as AvailableStates
  }
}
