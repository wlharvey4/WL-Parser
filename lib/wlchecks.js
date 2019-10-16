/* wl_check.js */

const EventEmitter = require('events').EventEmitter;
const WLType       = require('./wltype');
const REC_SEP      = /^$/;
const CHECK_RE     = /^(\$\d+[,]?\d*\.\d{2})\s?::\s?(.*?)\s?::\s?(.*?)\s?::\s?(\w+)\s+check\s+#\s*(\d+)/i;

/* types that could return checks:
   - TRUST withdrawals
   - EXPENSE
*/

class WLChecks extends EventEmitter {
    constructor(wl_year, rec_sep=REC_SEP) {
        super();
        this._wltype = new WLType(wl_year, rec_sep);
    }

    findChecks() {
        this._wltype.on('TRUST', trust_record => {
            if (trust_record.verb === 'WITHDRAWAL') {
                this._parseCheck(trust_record);
            }

        }).on('EXPENSE', expense_record => {
            this._parseCheck(expense_record);

        }).on('parsed', () => {
            this.emit('checked', this._checks);

        }).on('error', err => {
            console.error(`Received an error: ${err.message}`);
            throw(err);

        });

        this._wltype.parse();
    }

    _parseCheck(record) {
        let check_info;
        let check_data = {};
        if ((check_info = CHECK_RE.exec(record.message))) {
            check_data.type = record.type;
            check_data.start_date = record.start_date;
            check_data.checkno = check_info[5];
            check_data.payee   = check_info[2];
            check_data.acct    = check_info[4];
            check_data.amount  = parseFloat(check_info[1].replace(/^\$/, ''));
            check_data.purpose = check_info[3];
            check_data.subject = record.subject;
            check_data.caseno  = record.caseno;
            this.emit('check', check_data);
        }
    }
}

module.exports = WLChecks;
