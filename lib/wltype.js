/* wltype.js */

const EventEmitter = require('events').EventEmitter;
const WLReader = require('./wlreader');
const WLRecord = require('./wlrecord');
const REC_SEP  = /^$/;

class WLType extends EventEmitter {
    constructor(wl_year, rec_sep=REC_SEP) {
        super();
        this._wlreader = new WLReader(wl_year, rec_sep);
    }

    parse() {
        this._wlreader.on('entry', wlrecord => {
            const record = new WLRecord(wlrecord);
            this.emit('record', record);
            this.emit(record.type, record);
        }).on('done', () => this.emit('parsed'));

        this._wlreader.read();
    }
}

module.exports = WLType;
