/* wlre.js */

/* KEYS OF A WLRECORD OBJECT */
const WL_COMPONENTS = [
  'original',
  'start_date',
  'start_time',
  'caseno',
  'subject',
  'verb',
  'type',
  ['message', m => m.replace(/\n/gm, '')],
  'end_date',
  'end_time',
  'record_sep'
];

/* REGEXP COMPONENTS OF A WORKLOG RECORD */
const DATETIME_RE = '^(\\d{4}-\\d{2}-\\d{2})T(\\d{2}:\\d{2}:00)$\\n';
const CASE_RE     = '^\\s+(.{6})$\\n';
const SUBJ_VERB_RE= '^\\s+(.*?) --- (.*?)$\\n';
const TYPE_RE     = '^\\s+(.*?)$\\n';
const MESSAGE_RE  = '^\\s-{78}$\\n^\\s(.*?)^\\s-{78}$\\n';
const RECORD_SEP  = '(^$)';
const FLAGS       = 'ms';

/* COMBINED REGULAR EXPRESSION FOR ENTIRE WORKLOG ENTRY */
const wlre = new RegExp(
  DATETIME_RE  +
  CASE_RE      +
  SUBJ_VERB_RE +
  TYPE_RE      +
  MESSAGE_RE   +
  DATETIME_RE  +
  RECORD_SEP,
  FLAGS
);

module.exports = {wlre, WL_COMPONENTS};
