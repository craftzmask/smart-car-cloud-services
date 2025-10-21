"use strict";

const levels = { error: 0, warn: 1, info: 2, debug: 3 };

const resolveLevel = () => {
  const env = (process.env.NODE_ENV || "dev").toLowerCase();
  const fromEnv = (process.env.LOG_LEVEL || "").toLowerCase();
  if (fromEnv in levels) return fromEnv;
  return env === "production" || env === "prod" ? "warn" : "debug";
};

let currentLevel = resolveLevel();

const shouldLog = (level) => levels[level] <= levels[currentLevel];

const format = (level, args) => {
  const ts = new Date().toISOString();
  return [
    `[${ts}]`,
    level.toUpperCase().padEnd(5),
    "-",
    ...args,
  ];
};

const logger = {
  setLevel(level) {
    if (level in levels) currentLevel = level;
  },
  error: (...args) => {
    if (shouldLog("error")) console.error(...format("error", args));
  },
  warn: (...args) => {
    if (shouldLog("warn")) console.warn(...format("warn", args));
  },
  info: (...args) => {
    if (shouldLog("info")) console.info(...format("info", args));
  },
  debug: (...args) => {
    if (shouldLog("debug")) console.debug(...format("debug", args));
  },
};

module.exports = logger;
