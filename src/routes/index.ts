import { Router } from 'express'
import { stateMachine } from '..'

const router = Router()

router.get('/getCurrentState', async (req, res) => {
  res.json(await stateMachine.getCurrentState())
})

router.post('/changeState', (req, res) => {
  stateMachine.changeState()
  res.status(200).send('OK')
})

export default router
