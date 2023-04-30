import dotenv from 'dotenv'
import { web3 } from '../../'

import { State, AvailableStates } from '../types'
import { Level, Player } from '../../types/types'
import { OptionTypes, StatesTypes } from '../../utils/enums'
import {
  createState,
  createTreasure,
  encodeOption,
  stringToBytes32,
} from '../../utils/functions'
import { getContractInstance } from '../../utils/contract'

dotenv.config()

export default class TreasureState implements State {
  state?: StatesTypes
  player?: Player
  level?: Level
  votingAddress?: string

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

  onLeave(address: string) {
    const gameInstance = getContractInstance('GameStates', address)
    gameInstance.methods
      .closeVoting()
      .send({ from: process.env.FROM_ADDRESS ?? '' })

    const newState: AvailableStates = 'Battle'

    return newState
  }
}
