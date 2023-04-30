import express from 'express'
import dotenv from 'dotenv'
import statesRouter from './routes'
import Web3 from 'web3'
import StateMachine from './stateMachine'

dotenv.config()

const app = express()
const port = process.env.SERVER_PORT

const provider = new Web3.providers.HttpProvider(
  process.env.WEB3_PROVIDER_URL ?? ''
)

const web3 = new Web3(provider)
const stateMachine = new StateMachine()

app.use('', statesRouter)

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})

export { web3, stateMachine }
