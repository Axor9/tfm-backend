const Voting = artifacts.require('Voting')

const initialCandidates = [
    '0x1023758722d164db2283dc2572380f3f4983ea35ae0a7b980e32fe3aad377270',
    '0xf9612abbe2f481cd3f3118bce11368ede08347c7cf380e7766dbfc26811d391f',
    '0x50a606aab22cf73212cd7e381cb2282f79a10087e8cb6c54e2a95ae9edf8cf18',
]

contract('Voting', (accounts) => {
    it('should start a voting', async () => {
        const votingInstance = await Voting.deployed()
        const candidates = await votingInstance.getCandidates()
        for (let i = 0; i < candidates.length; i++) {
            assert.equal(candidates[i], initialCandidates[i])
        }
    })
    it('should register votes and close voting correctly', async () => {
        const votingInstance = await Voting.deployed()
        await votingInstance.vote(initialCandidates[0], 1)

        const votedAddress = await votingInstance.getAddressHasVoted()
        assert.equal(votedAddress, accounts[0])

        const votedAddressAmount = await votingInstance.getAddressVotedAmount(
            votedAddress[0]
        )
        assert.equal(votedAddressAmount, 1)

        await votingInstance.closeVoting()

        const votes = await votingInstance.getVotes(initialCandidates[0])
        assert.equal(votes, 1)
    })
})
