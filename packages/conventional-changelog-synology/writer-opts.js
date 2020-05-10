'use strict'

const compareFunc = require('compare-func')
const Q = require('q')
const readFile = Q.denodeify(require('fs').readFile)
const resolve = require('path').resolve

module.exports = Q.all([
  readFile(resolve(__dirname, './templates/template.hbs'), 'utf-8'),
  readFile(resolve(__dirname, './templates/header.hbs'), 'utf-8'),
  readFile(resolve(__dirname, './templates/commit.hbs'), 'utf-8'),
  readFile(resolve(__dirname, './templates/footer.hbs'), 'utf-8')
])
  .spread((template, header, commit, footer) => {
    const writerOpts = getWriterOpts()

    writerOpts.mainTemplate = template
    writerOpts.headerPartial = header
    writerOpts.commitPartial = commit
    writerOpts.footerPartial = footer

    return writerOpts
  })

function getWriterOpts () {
  return {
    transform: (commit, context) => {
      const issues = []
      let discard = false;
      if (!commit.project) {
        discard = true;
      } if (commit.type === 'feat') {
        commit.type = 'Features'
      } else if (commit.type === 'fixed') {
        commit.type = 'Bug Fixes'
      } else if (commit.type === 'perf') {
        commit.type = 'Performance Improvements'
      } else if (commit.type === 'revert' || commit.revert) {
        commit.type = 'Reverts'
      } else if (commit.type === 'docs') {
        commit.type = 'Documentation'
      } else if (commit.type === 'style') {
        commit.type = 'Styles'
      } else if (commit.type === 'refactor') {
        commit.type = 'Code Refactoring'
      } else if (commit.type === 'test') {
        commit.type = 'Tests'
      } else if (commit.type === 'build') {
        commit.type = 'Build System'
      } else if (commit.type === 'ci') {
        commit.type = 'Continuous Integration'
      }

      if (discard) {
        return;
      }
      if (commit.scope === '*') {
        commit.scope = ''
      }

      if (typeof commit.hash === 'string') {
        commit.shortHash = commit.hash.substring(0, 7)
      }
      if (typeof commit.header === 'string' && commit.project) {
        let projectId = -1;
        switch (commit.project) {
          case 'Test':
            projectId = 27;
            break;
          case 'DSM':
            projectId = 27;
            break;
          case 'SynoVueComponents':
            projectId = 729;
            break;
          case 'ComponentDemo':
            projectId = 729;
            break;
          default:
            return;
        }
        const matches = commit.header.match(/[0-9]+/g);
        if (matches) {
          for (const issueId of matches) {
            let url = `[${commit.project} #${issueId}](https://bug.synology.com/report/project_list.php?project_id=${projectId}&report_id=${issueId})`;
            console.log(url);
            issues.push(url)
          }
        }
      }
      commit.issues = issues;
      return commit
    },
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: ['scope', 'subject'],
    noteGroupsSort: 'title',
    notesSort: compareFunc
  }
}
