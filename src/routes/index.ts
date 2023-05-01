import { Router } from 'express'
import { stateMachine } from '..'

const router = Router()

router.get('/getCurrentState', async (req, res) => {
  res.json(await stateMachine.getCurrentState())
})

router.get('/getStates', async (req, res) => {
  res.json(await stateMachine.getStates())
})

router.post('/changeState', async (req, res) => {
  await stateMachine.changeState()
  res.status(200).send('OK')
})

export default router
