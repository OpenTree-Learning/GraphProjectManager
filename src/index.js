"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var secret_1 = require("./secret");
var database_1 = require("./database");
(0, secret_1.default)()
    .then(function () {
    var username = process.env.DATABASE_USERNAME;
    var password = process.env.DATABASE_PASSWORD;
    var session = (0, database_1.default)(username, password);
    session.run("match (p:Project) where p.name = 'GraphProjectManager' return p")
        .then(function (result) {
        result.records.forEach(function (record) { return console.log(record.get('p')); });
    })
        .catch(function (error) {
        console.log('error');
        console.log(error);
    });
});
