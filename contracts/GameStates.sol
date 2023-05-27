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

        currentState.id = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender))
        );
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
    }

    function getWinnerOption(
        uint256 stateId
    ) public view returns (Utils.Option memory) {
        address stateAddress = currentState.voting;
        Utils.State memory state = currentState;

        for (uint i = 0; i < states.length; i++) {
            if (states[i].id == stateId) {
                stateAddress = states[i].voting;
                state = states[i];
                break;
            }
        }
        Voting voting = Voting(stateAddress);
        bytes32 winner = voting.getWinner();

        for (uint i = 0; i < state.options.length; i++) {
            if (state.options[i].option == winner) {
                return state.options[i];
            }
        }

        //Should never return this (always winner in options)
        return currentState.options[0];
    }

    function getCurrentStateWinnerOption()
        public
        view
        returns (Utils.Option memory)
    {
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
