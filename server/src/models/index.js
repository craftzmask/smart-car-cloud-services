"use strict";

const sql = require("./sql");
const mongo = require("./mongo");

module.exports = Object.assign(sql, { mongo });
