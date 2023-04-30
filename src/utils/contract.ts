import { web3 } from '..'
import { Contract } from 'web3-eth-contract'
import * as fs from 'fs'

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
