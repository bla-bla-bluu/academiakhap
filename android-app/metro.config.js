const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Disable watching of node_modules and other heavy directories
config.watchFolders = [];

// Set up proper resolver configuration
config.resolver = {
  ...config.resolver,
  assetExts: [...config.resolver.assetExts, 'db'],
  blacklistRE: /node_modules|\.git/,
};

// Increase polling interval and use less aggressive watching
config.projectRoot = __dirname;
config.maxWorkers = 2;

module.exports = config;
