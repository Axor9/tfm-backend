// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

library Utils {
    enum OptionTypes {
        Skip,
        Level,
        Weapon,
        Treasure
    }

    enum StatesTypes {
        Rest,
        Battle,
        Treasure,
        Final
    }

    struct Player {
        uint health;
        string[] weapons;
    }

    struct Level {
        string name;
        string[] enemies;
    }

    struct Option {
        OptionTypes optionType;
        bytes data; //data encoded as bytes
        bytes32 option;
    }

    struct State {
        uint256 id;
        StatesTypes state;
        address voting;
        Player player;
        Level level;
        string enemy;
        Option[] options;
    }

    function getOptionValues(
        Option[] memory options
    ) public pure returns (bytes32[] memory) {
        bytes32[] memory optionValues = new bytes32[](options.length);

        for (uint i = 0; i < options.length; i++) {
            optionValues[i] = options[i].option;
        }

        return optionValues;
    }

    function copyOptions(
        State storage currrentState,
        Option[] memory options
    ) internal {
        delete currrentState.options;

        for (uint i = 0; i < options.length; i++) {
            currrentState.options.push(options[i]);
        }
    }

    function setCurrentState(
        State storage currentState,
        State memory newState
    ) internal {
        currentState.id = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender))
        );
        currentState.state = newState.state;
        currentState.player = newState.player;
        currentState.level = newState.level;
        currentState.enemy = newState.enemy;
    }

    function findWinner(
        bytes32 winner,
        State memory state
    ) internal pure returns (Option memory) {
        for (uint i = 0; i < state.options.length; i++) {
            if (state.options[i].option == winner) {
                return state.options[i];
            }
        }

        //Should never return this (always winner in options)
        return state.options[0];
    }
}
