const Game = artifacts.require('GameStates')
const Web3 = require('web3')

const web3 = new Web3('http://localhost:7545')

const treasureType = {
    treasure: {
        weapon: {
            name: 'string',
            damage: 'uint',
            range: 'uint',
        },
        isMimic: 'bool',
    },
}

contract('Game', () => {
    it('should be in initial state', async () => {
        const gameInstance = await Game.deployed()

        const treasure = {
            weapon: {
                name: 'sword',
                damage: 10,
                range: 4,
            },
            isMimic: false,
        }

        const initalState = {
            state: 2,
            voting: '0x1aaa677F2CAed6b68F6aa31db37Ec3b159b86622',
            player: {
                health: 100,
                weapons: [],
            },
            level: {
                name: 'home',
                enemies: [],
            },
            options: [
                {
                    optionType: 1,
                    data: web3.utils.utf8ToHex('Skip'),
                    option: web3.utils.padRight(
                        web3.utils.utf8ToHex('Skip'),
                        64
                    ),
                },
                {
                    optionType: 3,
                    data: web3.eth.abi.encodeParameter(
                        treasureType,
                        Object.values(treasure)
                    ),
                    option: web3.utils.padRight(
                        web3.utils.utf8ToHex('Treasure'),
                        64
                    ),
                },
            ],
        }

        const initalStateTuple = Object.values(initalState)

        await gameInstance.changeState(initalStateTuple)
        const initialState = await gameInstance.getCurrentState()
        assert.equal(initialState.player.health, 100)
        assert.equal(initialState.player.weapons.length, 0)
        assert.equal(initialState.level.name, 'home')
        assert.equal(initialState.options.length, 2)
    })
})
