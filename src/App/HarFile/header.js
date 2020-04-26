"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Header {
    constructor(response) {
        if (response.hasOwnProperty('name') && response.hasOwnProperty('value')) {
            this.name = response['name'];
            this.value = response['value'];
        }
    }
}
exports.default = Header;
