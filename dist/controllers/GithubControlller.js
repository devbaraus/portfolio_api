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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("../services/api");
var axios_1 = __importDefault(require("axios"));
var GITHUB_USERNAME = process.env.GITHUB_USERNAME;
var GithubControlller = /** @class */ (function () {
    function GithubControlller() {
    }
    GithubControlller.prototype.listAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, per_page, _c, page, _d, sort, data, e_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = req.query, _b = _a.per_page, per_page = _b === void 0 ? 10 : _b, _c = _a.page, page = _c === void 0 ? 1 : _c, _d = _a.sort, sort = _d === void 0 ? 'updated' : _d;
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, api_1.gitAPI.get("users/" + GITHUB_USERNAME + "/repos", {
                                params: {
                                    per_page: per_page,
                                    sort: sort,
                                    page: page,
                                },
                            })];
                    case 2:
                        data = (_e.sent()).data;
                        res.json(data.map(function (repo) { return repo.name; }));
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _e.sent();
                        console.log(e_1);
                        return [2 /*return*/, res.sendStatus(400)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    GithubControlller.prototype.indexAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, per_page, _c, page, _d, sort, data, repos, _e, _f, _i, index, _g, name_1, html_url, description, clone_url, _h, _j, _k, _l, _m, e_2;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0:
                        _a = req.query, _b = _a.per_page, per_page = _b === void 0 ? 10 : _b, _c = _a.page, page = _c === void 0 ? 1 : _c, _d = _a.sort, sort = _d === void 0 ? 'updated' : _d;
                        _o.label = 1;
                    case 1:
                        _o.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, api_1.gitAPI.get("users/" + GITHUB_USERNAME + "/repos", {
                                params: {
                                    per_page: per_page,
                                    sort: sort,
                                    page: page,
                                },
                            })];
                    case 2:
                        data = (_o.sent()).data;
                        repos = [];
                        _e = [];
                        for (_f in data)
                            _e.push(_f);
                        _i = 0;
                        _o.label = 3;
                    case 3:
                        if (!(_i < _e.length)) return [3 /*break*/, 6];
                        index = _e[_i];
                        _g = data[index], name_1 = _g.name, html_url = _g.html_url, description = _g.description, clone_url = _g.clone_url;
                        _j = (_h = repos).push;
                        _k = {
                            name: name_1,
                            description: description,
                            html_url: html_url,
                            clone_url: clone_url
                        };
                        _m = (_l = Object).keys;
                        return [4 /*yield*/, api_1.gitAPI.get("repos/" + GITHUB_USERNAME + "/" + name_1 + "/languages")];
                    case 4:
                        _j.apply(_h, [(_k.languages = _m.apply(_l, [(_o.sent())
                                    .data]),
                                _k)]);
                        _o.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        res.json(repos);
                        return [3 /*break*/, 8];
                    case 7:
                        e_2 = _o.sent();
                        console.log(e_2);
                        return [2 /*return*/, res.sendStatus(400)];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    GithubControlller.prototype.index = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var name, _a, html_url_1, description_1, clone_url_1, languages_1, _b, _c, e_3;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        name = req.params.name;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, api_1.gitAPI.get("repos/" + GITHUB_USERNAME + "/" + name)];
                    case 2:
                        _a = (_d.sent()).data, html_url_1 = _a.html_url, description_1 = _a.description, clone_url_1 = _a.clone_url;
                        _c = (_b = Object).keys;
                        return [4 /*yield*/, api_1.gitAPI.get("repos/" + GITHUB_USERNAME + "/" + name + "/languages")];
                    case 3:
                        languages_1 = _c.apply(_b, [(_d.sent()).data]);
                        axios_1.default
                            .get("https://raw.githubusercontent.com/" + GITHUB_USERNAME + "/" + name + "/master/README.md")
                            .then(function (response) {
                            return res.json({
                                name: name,
                                html_url: html_url_1,
                                description: description_1,
                                clone_url: clone_url_1,
                                languages: languages_1,
                                read_me: response.data,
                            });
                        })
                            .catch(function (e) {
                            return res.json({
                                name: name,
                                html_url: html_url_1,
                                description: description_1,
                                clone_url: clone_url_1,
                                languages: languages_1,
                                read_me: '',
                            });
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        e_3 = _d.sent();
                        console.log(e_3);
                        return [2 /*return*/, res.sendStatus(400)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return GithubControlller;
}());
exports.default = GithubControlller;
