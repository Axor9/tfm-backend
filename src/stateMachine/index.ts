import dotenv from 'dotenv'

import { AvailableStates, State, StateMachine } from './types'
import { State as StateType } from '../types/types'
import * as States from './states'
import {
  addAccount,
  changeState,
  closeVoting,
  deployContract,
  getContractInstance,
} from '../utils/contract'
import { StatesTypes } from '../utils/enums'
import { getEnemy } from '../utils/functions'

dotenv.config()

export default class StateMachineImpl implements StateMachine {
  currentState: State
  contractAddress: string | undefined
  account: string
  isInitialState: boolean

  constructor(contract?: string) {
    this.currentState = new States.InitState.default()
    this.currentState.onEnter()
    this.account = addAccount() ?? ''
    this.isInitialState = true

    if (contract) {
      this.synchronizeState(contract)
      return
    }

    this.init()
  }

  async synchronizeState(contract: string) {
    this.contractAddress = contract
    const currentState = await this.getCurrentState()

    const state: AvailableStates =
      currentState.state == StatesTypes.Battle
        ? 'Battle'
        : currentState.state == StatesTypes.Rest
        ? 'Rest'
        : currentState.state == StatesTypes.Treasure
        ? 'Treasure'
        : currentState.state == StatesTypes.Final
        ? 'Final'
        : 'Init'

    this.currentState = new States[`${state}State`].default()
    this.currentState.enemy = getEnemy(currentState.enemy)
    this.currentState.level = currentState.level
    this.currentState.player = currentState.player
    this.currentState.state = currentState.state

    if (state !== 'Init') this.isInitialState = false
  }

  async init() {
    this.account = (await addAccount()) ?? ''
    deployContract('Utils', this.account ?? '').then((res) => {
      deployContract('GameStates', this.account ?? '', undefined, res).then(
        (res) => (this.contractAddress = res)
      )
    })
  }

  async changeState() {
    if (!this.contractAddress) throw 'Cant change state (no contact address)'
    let winnerOption

    if (!this.isInitialState) {
      winnerOption = await closeVoting(this.contractAddress, this.account)
    }
    const newStateKey = await this.currentState.onLeave(winnerOption)
    const newState = new States[`${newStateKey}State`].default()

    if (!this.currentState.player || !this.currentState.level)
      throw 'Cant change state (no level or player)'

    const newStateObject = newState.onEnter(
      this.currentState.player,
      this.currentState.level,
      this.currentState.state
    )

    changeState(this.contractAddress, newStateObject, this.account)
    this.currentState = newState
    this.isInitialState = false
  }

  async getCurrentState() {
    const gameInstance = getContractInstance(
      'GameStates',
      this.contractAddress ?? ''
    )
    const currentStateResponse = await gameInstance.methods
      .getCurrentState()
      .call()

    const currentState: StateType = {
      id: currentStateResponse.id,
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
      enemy: currentStateResponse.enemy,
      options: currentStateResponse.options,
    }
    return currentState
  }

  async getStates() {
    const gameInstance = getContractInstance(
      'GameStates',
      this.contractAddress ?? ''
    )

    const statesResponse = await gameInstance.methods.getGameStates().call()
    const states = statesResponse.map((stateResponse: StateType) => {
      return {
        id: stateResponse.id,
        state: stateResponse.state,
        voting: stateResponse.voting,
        player: {
          health: stateResponse.player.health,
          weapons: stateResponse.player.weapons,
        },
        level: {
          name: stateResponse.level.name,
          enemies: stateResponse.level.enemies,
        },
        options: stateResponse.options,
      }
    })
    return states
  }

  async getCurrentStateVotes() {
    const currentState = await this.getCurrentState()
    const votingInstance = getContractInstance('Voting', currentState.voting)

    const addresses = await votingInstance.methods.getAddressHasVoted().call()
    const votes = Promise.all(
      addresses.map(async (address: string) => {
        return {
          address: address,
          amount: await votingInstance.methods
            .getAddressVotedAmount(address)
            .call(),
        }
      })
    )
    return votes
  }

  async getWinnerOption(id: string) {
    const gameInstance = getContractInstance(
      'GameStates',
      this.contractAddress ?? ''
    )

    try {
      const winnerOption = await gameInstance.methods.getWinnerOption(id).call()
      return winnerOption
    } catch (error) {
      console.error(error)
    }
  }

  async finishGame() {
    if (!this.contractAddress) throw 'Cant change state (no contact address)'
    let winnerOption

    if (!this.isInitialState) {
      winnerOption = await closeVoting(this.contractAddress, this.account)
    }
    await this.currentState.onLeave(winnerOption)
    const finalState = new States.FinalState.default()

    if (!this.currentState.player || !this.currentState.level)
      throw 'Cant change state (no level or player)'

    const finalStateObject = finalState.onEnter(
      this.currentState.player,
      this.currentState.level
    )

    changeState(this.contractAddress, finalStateObject, this.account)
    this.currentState = finalState
  }
}
