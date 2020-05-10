'use strict'

module.exports = {
  headerPattern: /^<(.*)>(?:\s\#\d+\s+\-\s+)(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/,
  headerCorrespondence: [
	'project',
    'type',
    'scope',
    'subject'
  ],
  noteKeywords: ['BREAKING CHANGE'],
  revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
  revertCorrespondence: ['header', 'hash']
}
