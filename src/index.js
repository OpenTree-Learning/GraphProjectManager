"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var secret_1 = require("./secret");
(0, secret_1.default)()
    .then(function () {
    console.log(process.env.DATABASE_USERNAME);
    console.log(process.env.DATABASE_PASSWORD);
});
