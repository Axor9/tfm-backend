const Game = artifacts.require('GameStates')
const Utils = artifacts.require('Utils')

module.exports = function (deployer) {
    deployer.deploy(Utils)
    deployer.link(Utils, Game)
    deployer.deploy(Game)
}
