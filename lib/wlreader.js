/* wlreader.js */

const EventEmitter = require('events').EventEmitter;
const fs       = require('fs');
const path     = require('path');
const rl       = require('readline');
const TODAY    = new Date();
const YEAR     = TODAY.getUTCFullYear();
const MIN_YEAR = 2016;
const REC_SEP  = /^$/;
const WORKLOG  = process.env.WORKLOG;
if (!WORKLOG)
    throw new ReferenceError('Environment variable WORKLOG is undefined.');

class WLReader extends EventEmitter {
    constructor(wl_year, rec_sep=REC_SEP) {
        if (typeof wl_year !== 'number' ||
            wl_year < MIN_YEAR          ||
            wl_year > YEAR)
            throw new RangeError(`Year '${wl_year}' must be between ${MIN_YEAR} and ${YEAR}`);

        if (!(rec_sep instanceof RegExp))
            throw new AssertionError(`The record separator ('${rec_sep}') should be a RegExp`);

        super();

        this._logfile = path.format({
            dir: WORKLOG,
            name: `worklog.${wl_year}`,
            ext: '.otl'
        });

        this._rec_sep = rec_sep;
        this._entry = '';

        if (!fs.existsSync(this._logfile)) {
            throw new Error(`Logfile '${this._logfile}' does not exist`);
            process.exit(1);
        }

        this._rs = fs.createReadStream(this._logfile, {
            encoding: 'utf8',
            emitClose: true,
        });
    }

    read() {
        const rl_interface = rl.createInterface({
            input: this._rs
        });

        rl_interface.on('line', line => {
            this._entry += (line + '\n');    

            if (this._rec_sep.test(line)) {
                this.emit('entry', this._entry);
                this._entry = '';
            }

        }).on('close', () => {
            this.emit('done');

        }).on('error', err => {
            console.error(`ERROR: ${err.message}`);

        });
    }
}

module.exports = WLReader;
