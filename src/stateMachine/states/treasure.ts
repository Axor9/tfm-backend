import dotenv from 'dotenv'
import { web3 } from '../../'

import { State, AvailableStates } from '../types'
import { Level, Player } from '../../types/types'
import { OptionTypes, StatesTypes } from '../../utils/enums'
import { createState, createTreasure } from '../../utils/functions'
import {
  encodeOption,
  stringToBytes32,
  decodeTreasureOption,
} from '../../utils/encoder'
import { closeVoting, changeState } from '../../utils/contract'

dotenv.config()

export default class TreasureState implements State {
  state?: StatesTypes
  player?: Player
  level?: Level

  onEnter(address: string, player: Player, level: Level) {
    this.state = StatesTypes.Treasure
    this.level = level
    this.player = player

    const treasure = createTreasure(level.name === 'home' ? false : true)

    const state = createState(this.state, this.player, this.level, [
      {
        optionType: OptionTypes.Treasure,
        data: encodeOption(treasure),
        option: stringToBytes32('Treasure'),
      },
      {
        optionType: OptionTypes.Skip,
        data: web3.utils.asciiToHex('Skip'),
        option: stringToBytes32('Skip'),
      },
    ])

    changeState(address, state)
  }

  async onLeave(address: string) {
    const winnerOption = await closeVoting(address)

    if (winnerOption.optionType == OptionTypes.Treasure) {
      const treasure = decodeTreasureOption(winnerOption.data)
      this.player?.weapons.push(treasure.weapon.name)

      if (treasure.isMimic) return 'Battle' as AvailableStates
    }

    return 'Rest' as AvailableStates
  }
}
