import dotenv from 'dotenv'
import { web3 } from '../..'

import { State, AvailableStates } from '../types'
import { Level, Player, Option } from '../../types/types'
import { OptionTypes, StatesTypes } from '../../utils/enums'
import { getContractInstance } from '../../utils/contract'
import {
  createState,
  encodeOption,
  getOptionLevels,
  stringToBytes32,
} from '../../utils/functions'

import levels from '../../data/levels.json'

dotenv.config()

export default class RestState implements State {
  state?: StatesTypes
  player?: Player
  level?: Level
  votingAddress?: string

  onEnter(address: string, player: Player, level: Level) {
    this.state = StatesTypes.Rest
    this.player = player
    this.level = level

    const options: Option[] = getOptionLevels(levels).map((level) => {
      return {
        optionType: OptionTypes.Weapon,
        data: encodeOption(level),
        option: stringToBytes32(`Weapon ${level.name}`),
      }
    })

    const state = createState(this.state, this.player, this.level, [...options])

    const gameInstance = getContractInstance('GameStates', address)

    gameInstance.methods
      .changeState(state)
      .estimateGas({ from: process.env.FROM_ADDRESS ?? '' })
      .then((gasAmount: any) => {
        gameInstance.methods.changeState(state).send({
          from: process.env.FROM_ADDRESS ?? '',
          gas: gasAmount,
        })
      })
      .catch((error: any) => {
        console.error(`Error al estimar el gas: ${error}`)
      })
  }

  onLeave() {
    const newState: AvailableStates = 'Treasure'
    return newState
  }
}
