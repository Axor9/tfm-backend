const Voting = artifacts.require('Voting')

module.exports = function (deployer) {
    const candidates = [
        '0x1023758722d164db2283dc2572380f3f4983ea35ae0a7b980e32fe3aad377270',
        '0xf9612abbe2f481cd3f3118bce11368ede08347c7cf380e7766dbfc26811d391f',
        '0x50a606aab22cf73212cd7e381cb2282f79a10087e8cb6c54e2a95ae9edf8cf18',
    ]

    deployer.deploy(Voting, candidates)
}
