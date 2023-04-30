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
        Treasure
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
        StatesTypes state;
        address voting;
        Player player;
        Level level;
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
}
