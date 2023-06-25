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
import { mimic } from '../../utils/constants'

dotenv.config()

export default class BattleState implements State {
  state?: StatesTypes
  player?: Player
  level?: Level
  enemy?: Enemy

  onEnter(player: Player, level: Level, previousState?: StatesTypes) {
    const randomIndex = Math.floor(Math.random() * level.enemies.length)

    this.state = StatesTypes.Battle
    this.level = level
    this.player = { ...player }
    this.enemy =
      previousState == StatesTypes.Treasure
        ? mimic
        : getEnemy(this.level.enemies[randomIndex])
    if (!this.enemy) throw 'Error no enemy found'

    if (previousState == StatesTypes.Treasure) {
      this.player.weapons.pop()
    }

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
    this.player = player
    return state
  }

  async onLeave(option: Option) {
    if (option.optionType == OptionTypes.Weapon) {
      const weapon = decodeWeaponOption(option.data)
      if (!this.player || !this.enemy) throw 'Error no player or enemy'
      doBattle(this.player, weapon, this.enemy)
    }

    if (option.optionType == OptionTypes.Skip) {
      if (!this.player) throw 'Error no player'
      this.player.health -= 10
    }

    if (this.player?.health == 0) return 'Final' as AvailableStates
    return 'Rest' as AvailableStates
  }
}
