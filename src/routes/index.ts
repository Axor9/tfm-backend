import { Router } from 'express'
import { stateMachine } from '..'
import { doBattle } from '../utils/functions'

const router = Router()

router.get('/getCurrentState', async (req, res) => {
  res.json(await stateMachine.getCurrentState())
})

router.get('/getStates', async (req, res) => {
  res.json(await stateMachine.getStates())
})

router.get('/getVotes', async (req, res) => {
  res.json(await stateMachine.getCurrentStateVotes())
})

router.post('/changeState', async (req, res) => {
  await stateMachine.changeState()
  res.status(200).send('OK')
})

router.post('/battle', (req, res) => {
  doBattle(req.body.player, req.body.weapon, req.body.enemy)
})

router.get('/winner', async (req, res) => {
  res.json(await stateMachine.getWinnerOption(req.query.id as string))
})

router.get('/finish', async (req, res) => {
  await stateMachine.finishGame()
  res.status(200).send('OK')
})

export default router
