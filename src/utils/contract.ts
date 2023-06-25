import { web3 } from '..'
import { Contract } from 'web3-eth-contract'
import * as fs from 'fs'
import { Option, State } from '../types/types'

export const getContractInstance = (
  contract: string,
  address: string
): Contract => {
  const artifact = fs.readFileSync(`build/contracts/${contract}.json`, {
    encoding: 'utf-8',
  })
  const artifactData = JSON.parse(artifact)
  const abi = artifactData.abi

  return new web3.eth.Contract(abi, address)
}

export const addAccount = () => {
  try {
    web3.eth.accounts.wallet.add({
      privateKey: process.env.FROM_PRIVATE_KEY ?? '',
      address: process.env.FROM_ADDRESS ?? '',
    })
    return process.env.FROM_ADDRESS
  } catch (error) {
    console.error('Could not add account')
  }
}

export const changeState = async (
  address: string,
  state: State,
  from: string
) => {
  const gameInstance = getContractInstance('GameStates', address)

  gameInstance.methods
    .changeState(state)
    .estimateGas({ from })
    .then((gasAmount: any) => {
      gameInstance.methods.changeState(state).send({
        from,
        gas: gasAmount,
      })
    })
    .catch((error: any) => {
      console.error(`Error al estimar el gas: ${error}`)
    })
}

export const closeVoting = async (
  address: string,
  from: string
): Promise<Option> => {
  const gameInstance = getContractInstance('GameStates', address)
  const gas = await gameInstance.methods.closeVoting().estimateGas({ from })

  await gameInstance.methods.closeVoting().send({ from, gas })

  const currentStateResponse = await gameInstance.methods
    .getCurrentState()
    .call()
  return await gameInstance.methods
    .getWinnerOption(currentStateResponse.id)
    .call()
}

export const deployContract = async (
  name: string,
  from: string,
  params?: any[],
  libraryAddress?: string
): Promise<string> => {
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
