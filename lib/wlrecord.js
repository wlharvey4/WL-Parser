/* wlrecord.js */

const {wlre, WL_COMPONENTS} = require('./wlre.js');

class WLRecord {

    constructor(wlrecord) {
        const parsed = wlre.exec(wlrecord);

        if (!parsed) { 
            throw ReferenceError(`wlrecord:\n${wlrecord}\nfailed to parse`)
        }

         parsed.forEach((e,i) => {
            let key = WL_COMPONENTS[i];
            if (typeof key === 'object') {  // see WL_COMPONENTS[7]
                e = WL_COMPONENTS[i][1](e); // run e through the supplied lambda function
                key = WL_COMPONENTS[i][0];  // use the string key
            }

            this[key] = e;
        });
    }

    get entry() {
        return this;// Object.assign({}, this._record);
    }
}

module.exports = WLRecord;
