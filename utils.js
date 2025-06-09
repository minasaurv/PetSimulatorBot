// Shared utilities for commands
const MessageEmbed = require("davie-eris-embed");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "db.sqlite" });
const config = require("./config.json");
const icon = config.icon;
const pets = config.pets;
const eggs = config.eggs;

module.exports = {
  MessageEmbed,
  db,
  icon,
  pets,
  eggs
};
