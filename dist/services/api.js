"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitAPI = exports.trelloAPI = void 0;
var axios_1 = __importDefault(require("axios"));
// import dotenv from 'dotenv'
//
// dotenv.config()
exports.trelloAPI = axios_1.default.create({
    baseURL: 'https://api.trello.com/1/',
    params: {
        key: process.env.TRELLO_KEY,
        token: process.env.TRELLO_TOKEN,
    },
});
exports.gitAPI = axios_1.default.create({
    baseURL: 'https://api.github.com/',
    auth: {
        username: process.env.GITHUB_USERNAME,
        password: process.env.GITHUB_TOKEN,
    },
});
