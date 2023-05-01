import dotenv from 'dotenv'
import { web3 } from '../../'

import { State, AvailableStates } from '../types'
import { Enemy, Level, Option, Player } from '../../types/types'
import { OptionTypes, StatesTypes } from '../../utils/enums'
import {
  decodeWeaponOption,
  encodeOption,
  stringToBytes32,
} from '../../utils/encoder'
import {
  createState,
  doBattle,
  getEnemy,
  getWeapons,
} from '../../utils/functions'
import { changeState, closeVoting } from '../../utils/contract'

dotenv.config()

export default class BattleState implements State {
  state?: StatesTypes
  player?: Player
  level?: Level
  enemy?: Enemy

  onEnter(address: string, player: Player, level: Level) {
    const randomIndex = Math.floor(Math.random() * level.enemies.length)

    this.state = StatesTypes.Battle
    this.level = level
    this.player = player
    this.enemy = getEnemy(this.level.enemies[randomIndex])
    if (!this.enemy) throw 'Error no enemy found'

    const options: Option[] = getWeapons(this.player).map((weapon) => {
      return {
        optionType: OptionTypes.Weapon,
        data: encodeOption(weapon),
        option: stringToBytes32(`Weapon ${weapon.name}`),
      }
    })

    const state = createState(
      this.state,
      this.player,
      this.level,
      [
        ...options,
        {
          optionType: OptionTypes.Skip,
          data: web3.utils.asciiToHex('Skip'),
          option: stringToBytes32('Skip'),
        },
      ],
      this.enemy.name
    )

    changeState(address, state)
  }

  async onLeave(address: string) {
    const winnerOption = await closeVoting(address)

    if (winnerOption.optionType == OptionTypes.Weapon) {
      const weapon = decodeWeaponOption(winnerOption.data)
      if (!this.player || !this.enemy) throw 'Error no player or enemy'
      doBattle(this.player, weapon, this.enemy)
    }

    const newState: AvailableStates = 'Treasure'
    return newState
  }
}
