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
        require(msg.sender == owner, "Only owner can close voting");
        require(canChangeState, "The game is over");

        Utils.setCurrentState(currentState, newState);

        if (newState.options.length > 0) {
            Utils.copyOptions(currentState, newState.options);

            //Open new voting with state options
            currentVoting = new Voting(
                Utils.getOptionValues(currentState.options)
            );
            currentState.voting = address(currentVoting);
        }

        if (currentState.state == Utils.StatesTypes.Final) {
            delete currentState.options;
            canChangeState = false;
        }

        states.push(currentState);
    }

    function closeVoting() public {
        require(msg.sender == owner, "Only owner can close voting");
        currentVoting.closeVoting();
        address[] memory addressVoted = currentVoting.getAddressHasVoted();

        //Saves the addresses that have participated in the vote
        for (uint i = 0; i < addressVoted.length; i++) {
            addressPlayed[addressVoted[i]] += currentVoting
                .getAddressVotedAmount(addressVoted[i]);
        }

        currentVoting.transferVotes(payable(owner));
    }

    function getWinnerOption(
        uint256 stateId
    ) public view returns (Utils.Option memory) {
        Utils.State memory state = currentState;

        for (uint i = 0; i < states.length; i++) {
            if (states[i].id == stateId) {
                state = states[i];
                break;
            }
        }
        Voting voting = Voting(state.voting);
        bytes32 winner = voting.getWinner();
        return Utils.findWinner(winner, state);
    }

    function getGameStates() public view returns (Utils.State[] memory) {
        return states;
    }

    function getCurrentState() public view returns (Utils.State memory) {
        return currentState;
    }
}
