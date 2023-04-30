import { web3 } from '..'
import * as fs from 'fs'

import { Level, Player, State, Option, Treasure, Battle } from '../types/types'
import {
  StatesTypes,
  battleEncodeTypes,
  levelEncodeTypes,
  treasureEncodeTypes,
} from '../utils/enums'
import { isBattle, isLevel, isTreasure } from './guards'

import weapons from '../data/weapons.json'

export const deployContract = async (
  name: string,
  from: string,
  params?: any[],
  libraryAddress?: string
) => {
  const artifactsPath = `build/contracts/${name}.json`

  const artifact = fs.readFileSync(artifactsPath, { encoding: 'utf-8' })
  const artifactData = JSON.parse(artifact)

  const abi = artifactData.abi
  let bytecode = artifactData.bytecode

  if (libraryAddress)
    bytecode = bytecode.replace(/_.*_/, libraryAddress.replace('0x', ''))

  const contract = new web3.eth.Contract(abi)
  const gas = await contract
    .deploy({
      data: bytecode,
      arguments: params,
    })
    .estimateGas()

  return await contract
    .deploy({
      data: bytecode,
      arguments: params,
    })
    .send({ from, gas })
    .then((gameContractInstance) => {
      console.log(
        'Contract deployed at address: ' + gameContractInstance.options.address
      )
      return gameContractInstance.options.address
    })
}

export const encodeOption = (data: Treasure | Battle | Level) => {
  if (isBattle(data)) {
    return web3.eth.abi.encodeParameter(battleEncodeTypes, data)
  }

  if (isLevel(data)) {
    return web3.eth.abi.encodeParameter(levelEncodeTypes, data)
  }

  if (isTreasure(data)) {
    return web3.eth.abi.encodeParameter(treasureEncodeTypes, data)
  }
}

export const createState = (
  type: StatesTypes,
  player: Player,
  level: Level,
  options: Option[]
) => {
  const state: State = {
    player,
    level,
    options,
    state: type,
    voting: '0x1aaa677F2CAed6b68F6aa31db37Ec3b159b86622', //Replaced in contract
  }

  return state
}

export function stringToBytes32(text: string): string {
  const hex = web3.utils.utf8ToHex(text)
  return web3.utils.padRight(hex, 64)
}

export function createTreasure(mimic: boolean): Treasure {
  const randomIndex = Math.floor(Math.random() * weapons.length)

  if (mimic) {
    if (Math.random() > 0.1) {
      mimic = false
    }
  }

  return {
    isMimic: mimic,
    weapon: weapons[randomIndex],
  }
}
