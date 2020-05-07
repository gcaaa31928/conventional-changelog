'use strict'

var conventionalChangelogCore = require('conventional-changelog-core')
var synology = require('conventional-changelog-synology')
var fs = require('fs')
var accessSync = require('fs-access').sync
var chalk = require('chalk')
var figures = require('figures')
var sprintf = require('sprintf-js').sprintf

function conventionalChangelog (options, context, gitRawCommitsOpts, parserOpts, writerOpts) {
  options = options || {}
  options.config = synology;
  return conventionalChangelogCore(options, context, gitRawCommitsOpts, parserOpts, writerOpts)
}

conventionalChangelog.createIfMissing = function (infile) {
  try {
    accessSync(infile, fs.F_OK)
  } catch (err) {
    if (err.code === 'ENOENT') {
      conventionalChangelog.checkpoint('created %s', [infile])
      fs.writeFileSync(infile, '\n', 'utf-8')
    }
  }
}

conventionalChangelog.checkpoint = function (msg, args) {
  console.info(chalk.green(figures.tick) + ' ' + sprintf(msg, args.map(function (arg) {
    return chalk.bold(arg)
  })))
}

module.exports = conventionalChangelog
