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

        currentState.state = newState.state;
        currentState.player = newState.player;
        currentState.level = newState.level;
        currentState.enemy = newState.enemy;

        if (newState.options.length > 0) {
            Utils.copyOptions(currentState, newState.options);

            //Open new voting with state options
            currentVoting = new Voting(
                Utils.getOptionValues(currentState.options)
            );
            currentState.voting = address(currentVoting);
        }

        states.push(currentState);

        if (currentState.state == Utils.StatesTypes.Final) {
            canChangeState = false;
        }
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
    }

    function getVotingWinner() public view returns (Utils.Option memory) {
        bytes32 winner = currentVoting.getWinner();

        for (uint i = 0; i < currentState.options.length; i++) {
            if (currentState.options[i].option == winner) {
                return currentState.options[i];
            }
        }

        //Should never return this (always winner in options)
        return currentState.options[0];
    }

    function getGameStates() public view returns (Utils.State[] memory) {
        return states;
    }

    function getCurrentState() public view returns (Utils.State memory) {
        return currentState;
    }
}
