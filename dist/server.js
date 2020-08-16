"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var cors_1 = __importDefault(require("cors"));
var helmet_1 = __importDefault(require("helmet"));
var GithubControlller_1 = __importDefault(require("./controllers/GithubControlller"));
var TrelloController_1 = __importDefault(require("./controllers/TrelloController"));
var githubControlller = new GithubControlller_1.default();
var trelloController = new TrelloController_1.default();
var app = express_1.default();
app.use(cors_1.default());
app.use(morgan_1.default('tiny'));
app.use(helmet_1.default());
app
    .get('/repos/', githubControlller.indexAll)
    .get('/repos/:name', githubControlller.index)
    .get('/articles/', trelloController.indexAllArticles)
    .get('/articles/:id', trelloController.indexArticle)
    .get('/projects/', trelloController.indexAllProject)
    .get('/projects/:id', trelloController.indexProject)
    .get('/sides/', trelloController.indexAllSide)
    .get('/sides/:id', trelloController.indeSide);
app.listen(process.env.PORT || 3333, function () {
    console.log("Server running at " + (process.env.PORT || 3333));
});
