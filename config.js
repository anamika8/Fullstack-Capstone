"use strict";
exports.DATABASE_URL =
    process.env.DATABASE_URL || "mongodb://localhost/mommy-talks-app";
exports.TEST_DATABASE_URL =
    process.env.TEST_DATABASE_URL || "mongodb://localhost/test-mommy-talks-app";
exports.PORT = process.env.PORT || 8088;