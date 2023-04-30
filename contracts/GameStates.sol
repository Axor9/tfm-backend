// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./libraries/Utils.sol";
import "./Voting.sol";

contract GameStates {
    address owner;
    bool canChangeState = true;

    Utils.State currentState;
    Utils.State[] states;
    Voting currentVoting;

    mapping(address => uint256) public addressPlayed;

    constructor() {
        owner = msg.sender;
    }

    function changeState(Utils.State memory newState) public {
        currentState.state = newState.state;
        currentState.player = newState.player;
        currentState.level = newState.level;
        Utils.copyOptions(currentState, newState.options);
        currentVoting = new Voting(Utils.getOptionValues(currentState.options));
        currentState.voting = address(currentVoting);
        states.push(currentState);
    }

    function closeVoting() public {
        require(msg.sender == owner, "Only owner can close voting");
        currentVoting.closeVoting();
        address[] memory addressVoted = currentVoting.getAddressHasVoted();

        for (uint i = 0; i < addressVoted.length; i++) {
            addressPlayed[addressVoted[i]] += currentVoting
                .getAddressVotedAmount(addressVoted[i]);
        }
    }

    function getGameStates() public view returns (Utils.State[] memory) {
        return states;
    }

    function getCurrentState() public view returns (Utils.State memory) {
        return currentState;
    }
}
