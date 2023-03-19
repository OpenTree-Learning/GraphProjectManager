"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var neo4j = require("neo4j-driver");
function createSession(username, password) {
    var driver = neo4j.driver('neo4j://localhost', neo4j.auth.basic(username, password));
    return driver.session();
}
exports.default = createSession;
