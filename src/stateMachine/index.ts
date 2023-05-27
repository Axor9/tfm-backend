import dotenv from 'dotenv'

import { State, StateMachine } from './types'
import { State as StateType } from '../types/types'
import * as States from './states'
import { deployContract, getContractInstance } from '../utils/contract'

dotenv.config()

export default class StateMachineImpl implements StateMachine {
  currentState: State
  contractAddress: string | undefined

  constructor(contract?: string) {
    this.currentState = new States.InitState.default()
    this.currentState.onEnter()

    if (contract) {
      this.contractAddress = contract
      return
    }

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

  async changeState() {
    if (!this.contractAddress) throw 'Cant change state (no contact address)'

    const newStateKey = await this.currentState.onLeave(this.contractAddress)
    const newState = new States[`${newStateKey}State`].default()

    if (!this.currentState.player || !this.currentState.level)
      throw 'Cant change state (no level or player)'

    newState.onEnter(
      this.contractAddress,
      this.currentState.player,
      this.currentState.level,
      this.currentState.state
    )

    this.currentState = newState
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

    const winnerOption = await gameInstance.methods.getWinnerOption(id).call()
    return winnerOption
  }

  async getCandidates(address: string) {
    const votingInstance = getContractInstance('Voting', address)

    const candidates = await votingInstance.methods.getCandidates().call()
    return candidates
  }

  async getWinner(address: string) {
    const votingInstance = getContractInstance('Voting', address)

    const candidates = await votingInstance.methods.getWinner().call()
    return candidates
  }

  async getCandidatesVotes(address: string, candidate: string) {
    const votingInstance = getContractInstance('Voting', address)

    const candidates = await votingInstance.methods.getVotes(candidate).call()
    return candidates
  }
}
