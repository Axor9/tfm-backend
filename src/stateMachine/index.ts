import dotenv from 'dotenv'
import fs from 'fs'
import { web3 } from '..'

import { State, StateMachine } from './types'
import { State as StateType } from '../types/types'
import * as States from './states'
import { deployContract } from '../utils/functions'

dotenv.config()

export default class StateMachineImpl implements StateMachine {
  currentState: State
  contractAddress: string | undefined

  constructor() {
    this.currentState = new States.InitState.default()
    this.currentState.onEnter()
    this.init()
  }

  async init() {
    deployContract('Utils', process.env.FROM_ADDRESS ?? '').then((res) => {
      deployContract(
        'GameStates',
        process.env.FROM_ADDRESS ?? '',
        undefined,
        res
      ).then((res) => (this.contractAddress = res))
    })
  }

  changeState() {
    if (!this.contractAddress) throw 'Cant change state (no contact address)'

    const newStateKey = this.currentState.onLeave(this.contractAddress)
    const newState = new States[`${newStateKey}State`].default()

    if (!this.currentState.player || !this.currentState.level)
      throw 'Cant change state (no level or player)'

    newState.onEnter(
      this.contractAddress,
      this.currentState.player,
      this.currentState.level
    )

    this.currentState = newState
  }

  async getCurrentState(): Promise<StateType> {
    const artifact = fs.readFileSync('build/contracts/GameStates.json', {
      encoding: 'utf-8',
    })
    const artifactData = JSON.parse(artifact)
    const abi = artifactData.abi

    const gameInstance = new web3.eth.Contract(abi, this.contractAddress)
    const currentStateResponse = await gameInstance.methods
      .getCurrentState()
      .call()

    const currentState: StateType = {
      state: currentStateResponse.state,
      voting: currentStateResponse.voting,
      player: {
        health: currentStateResponse.player.health,
        weapons: currentStateResponse.player.weapons,
      },
      level: {
        name: currentStateResponse.level.name,
        enemies: currentStateResponse.level.enemies,
      },
      options: currentStateResponse.options,
    }
    return currentState
  }
}
