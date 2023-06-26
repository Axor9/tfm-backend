"use strict";
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
const express_1 = require("express");
const __1 = require("..");
const functions_1 = require("../utils/functions");
const router = (0, express_1.Router)();
router.get('/getCurrentState', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield __1.stateMachine.getCurrentState());
}));
router.get('/getStates', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield __1.stateMachine.getStates());
}));
router.get('/getVotes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield __1.stateMachine.getCurrentStateVotes());
}));
router.post('/changeState', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield __1.stateMachine.changeState();
    res.status(200).send('OK');
}));
router.post('/battle', (req, res) => {
    (0, functions_1.doBattle)(req.body.player, req.body.weapon, req.body.enemy);
});
router.get('/winner', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield __1.stateMachine.getWinnerOption(req.query.id));
}));
router.get('/finish', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield __1.stateMachine.finishGame();
    res.status(200).send('OK');
}));
exports.default = router;
