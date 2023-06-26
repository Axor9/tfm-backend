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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployContract = exports.closeVoting = exports.changeState = exports.addAccount = exports.getContractInstance = void 0;
const __1 = require("..");
const fs = __importStar(require("fs"));
const getContractInstance = (contract, address) => {
    const artifact = fs.readFileSync(`build/contracts/${contract}.json`, {
        encoding: 'utf-8',
    });
    const artifactData = JSON.parse(artifact);
    const abi = artifactData.abi;
    return new __1.web3.eth.Contract(abi, address);
};
exports.getContractInstance = getContractInstance;
const addAccount = () => {
    var _a, _b;
    try {
        __1.web3.eth.accounts.wallet.add({
            privateKey: (_a = process.env.FROM_PRIVATE_KEY) !== null && _a !== void 0 ? _a : '',
            address: (_b = process.env.FROM_ADDRESS) !== null && _b !== void 0 ? _b : '',
        });
        return process.env.FROM_ADDRESS;
    }
    catch (error) {
        console.error('Could not add account');
    }
};
exports.addAccount = addAccount;
const changeState = (address, state, from) => __awaiter(void 0, void 0, void 0, function* () {
    const gameInstance = (0, exports.getContractInstance)('GameStates', address);
    gameInstance.methods
        .changeState(state)
        .estimateGas({ from })
        .then((gasAmount) => {
        gameInstance.methods.changeState(state).send({
            from,
            gas: gasAmount,
        });
    })
        .catch((error) => {
        console.error(`Error al estimar el gas: ${error}`);
    });
});
exports.changeState = changeState;
const closeVoting = (address, from) => __awaiter(void 0, void 0, void 0, function* () {
    const gameInstance = (0, exports.getContractInstance)('GameStates', address);
    const gas = yield gameInstance.methods.closeVoting().estimateGas({ from });
    yield gameInstance.methods.closeVoting().send({ from, gas });
    const currentStateResponse = yield gameInstance.methods
        .getCurrentState()
        .call();
    return yield gameInstance.methods
        .getWinnerOption(currentStateResponse.id)
        .call();
});
exports.closeVoting = closeVoting;
const deployContract = (name, from, params, libraryAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const artifactsPath = `build/contracts/${name}.json`;
    const artifact = fs.readFileSync(artifactsPath, { encoding: 'utf-8' });
    const artifactData = JSON.parse(artifact);
    const abi = artifactData.abi;
    let bytecode = artifactData.bytecode;
    if (libraryAddress)
        bytecode = bytecode.replace(/_.*_/, libraryAddress.replace('0x', ''));
    const contract = new __1.web3.eth.Contract(abi);
    const gas = yield contract
        .deploy({
        data: bytecode,
        arguments: params,
    })
        .estimateGas();
    return yield contract
        .deploy({
        data: bytecode,
        arguments: params,
    })
        .send({ from, gas })
        .then((gameContractInstance) => {
        console.log('Contract deployed at address: ' + gameContractInstance.options.address);
        return gameContractInstance.options.address;
    });
});
exports.deployContract = deployContract;
