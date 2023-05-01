// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract Voting {
    mapping(bytes32 => uint256) private votesReceived;
    mapping(address => bool) private hasVoted;
    mapping(address => uint256) private addressVotedAmount;
    bool public votingOpen;
    address private owner;
    address[] private addressVoted;
    bytes32[] public candidates;

    constructor(bytes32[] memory _candidates) {
        votingOpen = true;
        owner = msg.sender;
        candidates = _candidates;
    }

    function vote(bytes32 candidate, uint256 amount) public payable {
        require(votingOpen, "Voting is closed");
        require(amount > 0, "Amount must be greater than 0");
        require(!hasVoted[msg.sender], "You have already voted");
        require(validateCandidate(candidate), "Invalid candidate");

        votesReceived[candidate] += amount;
        addressVotedAmount[msg.sender] += amount;
        hasVoted[msg.sender] = true;
        addressVoted.push(msg.sender);
    }

    function getCandidates() public view returns (bytes32[] memory) {
        return candidates;
    }

    function validateCandidate(bytes32 candidate) internal view returns (bool) {
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i] == candidate) {
                return true;
            }
        }
        return false;
    }

    function getVotes(bytes32 candidate) public view returns (uint256) {
        require(!votingOpen, "Voting must be closed to get votes");
        return votesReceived[candidate];
    }

    function getWinner() public view returns (bytes32) {
        require(!votingOpen, "Voting must be closed to get the winner");
        bytes32 winner;
        uint256 amount = 0;

        for (uint i = 0; i < candidates.length; i++) {
            if (votesReceived[candidates[i]] > amount) {
                amount = votesReceived[candidates[i]];
                winner = candidates[i];
            }
        }

        return winner;
    }

    function closeVoting() public {
        require(msg.sender == owner, "Only owner can close voting");
        votingOpen = false;
    }

    function getAddressVotedAmount(
        address _address
    ) public view returns (uint256) {
        return addressVotedAmount[_address];
    }

    function getAddressHasVoted() public view returns (address[] memory) {
        return addressVoted;
    }
}
