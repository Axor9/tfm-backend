"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const States = __importStar(require("./states"));
const contract_1 = require("../utils/contract");
const enums_1 = require("../utils/enums");
const functions_1 = require("../utils/functions");
dotenv_1.default.config();
class StateMachineImpl {
    constructor(contract) {
        var _a;
        this.currentState = new States.InitState.default();
        this.currentState.onEnter();
        this.account = (_a = (0, contract_1.addAccount)()) !== null && _a !== void 0 ? _a : '';
        this.isInitialState = true;
        if (contract) {
            this.synchronizeState(contract);
            return;
        }
        this.init();
    }
    synchronizeState(contract) {
        return __awaiter(this, void 0, void 0, function* () {
            this.contractAddress = contract;
            const currentState = yield this.getCurrentState();
            const state = currentState.state == enums_1.StatesTypes.Battle
                ? 'Battle'
                : currentState.state == enums_1.StatesTypes.Rest
                    ? 'Rest'
                    : currentState.state == enums_1.StatesTypes.Treasure
                        ? 'Treasure'
                        : currentState.state == enums_1.StatesTypes.Final
                            ? 'Final'
                            : 'Init';
            this.currentState = new States[`${state}State`].default();
            this.currentState.enemy = (0, functions_1.getEnemy)(currentState.enemy);
            this.currentState.level = currentState.level;
            this.currentState.player = currentState.player;
            this.currentState.state = currentState.state;
            if (state !== 'Init')
                this.isInitialState = false;
        });
    }
    init() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.account = (_a = (yield (0, contract_1.addAccount)())) !== null && _a !== void 0 ? _a : '';
            (0, contract_1.deployContract)('Utils', (_b = this.account) !== null && _b !== void 0 ? _b : '').then((res) => {
                var _a;
                (0, contract_1.deployContract)('GameStates', (_a = this.account) !== null && _a !== void 0 ? _a : '', undefined, res).then((res) => (this.contractAddress = res));
            });
        });
    }
    changeState() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.contractAddress)
                throw 'Cant change state (no contact address)';
            let winnerOption;
            if (!this.isInitialState) {
                winnerOption = yield (0, contract_1.closeVoting)(this.contractAddress, this.account);
            }
            const newStateKey = yield this.currentState.onLeave(winnerOption);
            const newState = new States[`${newStateKey}State`].default();
            if (!this.currentState.player || !this.currentState.level)
                throw 'Cant change state (no level or player)';
            const newStateObject = newState.onEnter(this.currentState.player, this.currentState.level, this.currentState.state);
            (0, contract_1.changeState)(this.contractAddress, newStateObject, this.account);
            this.currentState = newState;
            this.isInitialState = false;
        });
    }
    getCurrentState() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const gameInstance = (0, contract_1.getContractInstance)('GameStates', (_a = this.contractAddress) !== null && _a !== void 0 ? _a : '');
            const currentStateResponse = yield gameInstance.methods
                .getCurrentState()
                .call();
            const currentState = {
                id: currentStateResponse.id,
                state: currentStateResponse.state,
                voting: currentStateResponse.voting,
                player: {
                    health: currentStateResponse.player.health,
                    weapons: currentStateResponse.player.weapons,
                },
                level: {
                    name: currentStateResponse.level.name,
                    enemies: currentStateResponse.level.enemies,
                },
                enemy: currentStateResponse.enemy,
                options: currentStateResponse.options,
            };
            return currentState;
        });
    }
    getStates() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const gameInstance = (0, contract_1.getContractInstance)('GameStates', (_a = this.contractAddress) !== null && _a !== void 0 ? _a : '');
            const statesResponse = yield gameInstance.methods.getGameStates().call();
            const states = statesResponse.map((stateResponse) => {
                return {
                    id: stateResponse.id,
                    state: stateResponse.state,
                    voting: stateResponse.voting,
                    player: {
                        health: stateResponse.player.health,
                        weapons: stateResponse.player.weapons,
                    },
                    level: {
                        name: stateResponse.level.name,
                        enemies: stateResponse.level.enemies,
                    },
                    options: stateResponse.options,
                };
            });
            return states;
        });
    }
    getCurrentStateVotes() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentState = yield this.getCurrentState();
            const votingInstance = (0, contract_1.getContractInstance)('Voting', currentState.voting);
            const addresses = yield votingInstance.methods.getAddressHasVoted().call();
            const votes = Promise.all(addresses.map((address) => __awaiter(this, void 0, void 0, function* () {
                return {
                    address: address,
                    amount: yield votingInstance.methods
                        .getAddressVotedAmount(address)
                        .call(),
                };
            })));
            return votes;
        });
    }
    getWinnerOption(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const gameInstance = (0, contract_1.getContractInstance)('GameStates', (_a = this.contractAddress) !== null && _a !== void 0 ? _a : '');
            try {
                const winnerOption = yield gameInstance.methods.getWinnerOption(id).call();
                return winnerOption;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    finishGame() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.contractAddress)
                throw 'Cant change state (no contact address)';
            let winnerOption;
            if (!this.isInitialState) {
                winnerOption = yield (0, contract_1.closeVoting)(this.contractAddress, this.account);
            }
            yield this.currentState.onLeave(winnerOption);
            const finalState = new States.FinalState.default();
            if (!this.currentState.player || !this.currentState.level)
                throw 'Cant change state (no level or player)';
            const finalStateObject = finalState.onEnter(this.currentState.player, this.currentState.level);
            (0, contract_1.changeState)(this.contractAddress, finalStateObject, this.account);
            this.currentState = finalState;
        });
    }
}
exports.default = StateMachineImpl;
