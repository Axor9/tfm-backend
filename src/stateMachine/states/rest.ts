import dotenv from 'dotenv'

import { State, AvailableStates } from '../types'
import { Level, Player, Option } from '../../types/types'
import { OptionTypes, StatesTypes } from '../../utils/enums'
import { changeState, closeVoting } from '../../utils/contract'
import {
  encodeOption,
  stringToBytes32,
  decodeLevelOption,
} from '../../utils/encoder'
import { createState, getOptionLevels } from '../../utils/functions'

import levels from '../../data/levels.json'

dotenv.config()

export default class RestState implements State {
  state?: StatesTypes
  player?: Player
  level?: Level

  onEnter(player: Player, level: Level) {
    this.state = StatesTypes.Rest
    this.player = player
    this.level = level

    const options: Option[] = getOptionLevels(levels).map((level) => {
      return {
        optionType: OptionTypes.Level,
        data: encodeOption(level),
        option: stringToBytes32(`Level ${level.name}`),
      }
    })

    const state = createState(this.state, this.player, this.level, [...options])

    return state
  }

  async onLeave(option: Option) {
    if (option.optionType == OptionTypes.Level) {
      this.level = decodeLevelOption(option.data)
    }

    if (Math.random() > 0.5) {
      return 'Battle' as AvailableStates
    }

    return 'Treasure' as AvailableStates
  }
}
