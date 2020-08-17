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
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("../services/api");
var _a = [
    '5f36d228f32d450cbf3cbaf9',
    '5f38107078c1558e6e2decc2',
    '5f38107732299f746fe544e7',
], blogID = _a[0], projectsID = _a[1], sideID = _a[2];
var TrelloController = /** @class */ (function () {
    function TrelloController() {
    }
    TrelloController.getList = function (arr) {
        return __awaiter(this, void 0, void 0, function () {
            var projects, _loop_1, _a, _b, _i, index;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        projects = [];
                        _loop_1 = function (index) {
                            var _a, id, name_1, shortUrl, labels, cover, k, attachments;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = arr[index], id = _a.id, name_1 = _a.name, shortUrl = _a.shortUrl, labels = _a.labels, cover = _a.cover;
                                        labels = labels.map(function (label) { return label.name; });
                                        k = { w: 10000, url: '' };
                                        return [4 /*yield*/, api_1.trelloAPI.get("cards/" + id + "/attachments/")];
                                    case 1:
                                        attachments = (_b.sent()).data;
                                        attachments.map(function (attach) {
                                            if (attach.name === 'cover')
                                                return attach.previews.map(function (i) {
                                                    if (i.width < k.w && i.width > 300)
                                                        k = { w: i.width, url: i.url };
                                                    return i;
                                                });
                                            return;
                                        });
                                        projects.push({
                                            id: id,
                                            name: name_1,
                                            url: shortUrl,
                                            labels: labels,
                                            cover: k.url,
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _a = [];
                        for (_b in arr)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        index = _a[_i];
                        return [5 /*yield**/, _loop_1(index)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, projects];
                }
            });
        });
    };
    TrelloController.prototype.listAllArticles = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var q, data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        q = req.query;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, api_1.trelloAPI.get("lists/" + blogID + "/cards")];
                    case 2:
                        data = (_a.sent()).data.splice(Number(q.page) * 10, 10);
                        res.json(data.map(function (side) { return side.id; }));
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [2 /*return*/, res.status(400).json({ error: e_1.message })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TrelloController.prototype.indexAllArticles = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var q, data, articles, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        q = req.query;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, api_1.trelloAPI.get("lists/" + blogID + "/cards")];
                    case 2:
                        data = (_a.sent()).data.splice(Number(q.page) * 10, 10);
                        return [4 /*yield*/, TrelloController.getList(data)];
                    case 3:
                        articles = _a.sent();
                        res.json(articles);
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        console.log(e_2);
                        return [2 /*return*/, res.status(400).json({ error: e_2.message })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TrelloController.prototype.indexArticle = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                }
                catch (e) {
                    console.log(e);
                    return [2 /*return*/, res.status(400).json({ error: e.message })];
                }
                return [2 /*return*/];
            });
        });
    };
    TrelloController.prototype.listAllProjects = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var q, data, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        q = req.query;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, api_1.trelloAPI.get("lists/" + projectsID + "/cards")];
                    case 2:
                        data = (_a.sent()).data.splice(Number(q.page) * 10, 10);
                        res.json(data.map(function (side) { return side.id; }));
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _a.sent();
                        console.log(e_3);
                        return [2 /*return*/, res.status(400).json({ error: e_3.message })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TrelloController.prototype.indexAllProjects = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var q, data, projects, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        q = req.query;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, api_1.trelloAPI.get("lists/" + projectsID + "/cards")];
                    case 2:
                        data = (_a.sent()).data.splice(Number(q.page) * 10, 10);
                        return [4 /*yield*/, TrelloController.getList(data)];
                    case 3:
                        projects = _a.sent();
                        res.json(projects);
                        return [3 /*break*/, 5];
                    case 4:
                        e_4 = _a.sent();
                        console.log(e_4);
                        return [2 /*return*/, res.status(400).json({ error: e_4.message })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TrelloController.prototype.indexProject = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                id = req.params.id;
                try {
                }
                catch (e) {
                    return [2 /*return*/, res.status(400).json({ error: e.message })];
                }
                return [2 /*return*/];
            });
        });
    };
    TrelloController.prototype.listAllSides = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var q, data, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        q = req.query;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, api_1.trelloAPI.get("lists/" + sideID + "/cards")];
                    case 2:
                        data = (_a.sent()).data.splice(Number(q.page) * 10, 10);
                        res.json(data.map(function (side) { return side.id; }));
                        return [3 /*break*/, 4];
                    case 3:
                        e_5 = _a.sent();
                        console.log(e_5);
                        return [2 /*return*/, res.status(400).json({ error: e_5.message })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TrelloController.prototype.indexAllSides = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var q, data, sides, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        q = req.query;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, api_1.trelloAPI.get("lists/" + sideID + "/cards")];
                    case 2:
                        data = (_a.sent()).data.splice(Number(q.page) * 10, 10);
                        return [4 /*yield*/, TrelloController.getList(data)];
                    case 3:
                        sides = _a.sent();
                        res.json(sides);
                        return [3 /*break*/, 5];
                    case 4:
                        e_6 = _a.sent();
                        console.log(e_6);
                        return [2 /*return*/, res.status(400).json({ error: e_6.message })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TrelloController.prototype.indexSide = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, name_2, labels, cover, desc, k_1, attachments, url_1, images_1, contents_1, e_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = req.params.id;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, api_1.trelloAPI.get("cards/" + id)];
                    case 2:
                        _a = (_b.sent()).data, name_2 = _a.name, labels = _a.labels, cover = _a.cover, desc = _a.desc;
                        labels = labels.map(function (label) { return label.name; });
                        k_1 = { w: 10000, url: '' };
                        cover.scaled.map(function (i) {
                            if (i.width < k_1.w && i.width > 900)
                                k_1 = { w: i.width, url: i.url };
                            return i;
                        });
                        return [4 /*yield*/, api_1.trelloAPI.get("cards/" + id + "/attachments")];
                    case 3:
                        attachments = (_b.sent()).data;
                        url_1 = '';
                        images_1 = [];
                        contents_1 = [];
                        attachments.map(function (attach) {
                            if (attach.name === 'url') {
                                url_1 = attach.url;
                                return null;
                            }
                            if (attach.name.startsWith('content:')) {
                                contents_1.push({
                                    name: attach.name.replace('content:', ''),
                                    url: attach.url,
                                });
                                return null;
                            }
                            if (attach.name === 'logo') {
                                return null;
                            }
                            var k = { w: 10000, url: '' };
                            attach.previews.map(function (i) {
                                if (i.width < k.w && i.width > 900)
                                    k = { w: i.width, url: i.url };
                                return i;
                            });
                            images_1.push({
                                name: attach.name,
                                url: k.url,
                            });
                        });
                        res.json({
                            id: id,
                            name: name_2,
                            cover: k_1.url,
                            labels: labels,
                            images: images_1,
                            url: url_1,
                            contents: contents_1,
                            description: desc,
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        e_7 = _b.sent();
                        console.log(e_7);
                        return [2 /*return*/, res.status(400).json({ error: e_7.message })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return TrelloController;
}());
exports.default = TrelloController;
