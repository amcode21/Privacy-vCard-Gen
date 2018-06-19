let colors = require('colors');
let moment = require('moment');
let EOL = require('os').EOL;
let fs = require('fs');

let newLine = require('os').EOL;

let log = (type, text) => {

  let formatted = moment().format(`hh:mm:ss.SSS`)

  switch (type) {
    case 'warn':
    case 'warning':
        process.stdout.write(`[${formatted}]`.gray);
        process.stdout.write(` [WRN] `.yellow);

        if (typeof text === 'string') {
            process.stdout.write(`${text}`);
        }
        else {
            process.stdout.write(text);
        }

        process.stdout.write(EOL);
        break;

    case 'err':
    case 'error':
        process.stdout.write(`[${formatted}]`.gray);
        process.stdout.write(` [ERR] `.red);

        if (typeof text === 'string') {
            process.stdout.write(`${text}`);
        }
        else {
            process.stdout.write(text);
        }

        process.stdout.write(EOL);
        break;

    case 'info':
        process.stdout.write(`[${formatted}]`.gray);
        process.stdout.write(` [DBG] `.cyan);
        
        if (typeof text === 'string') {
            process.stdout.write(`${text}`);
        }
        else {
            process.stdout.write(text);
        }
        
        process.stdout.write(EOL);
        break;

    case 'success':
        process.stdout.write(`[${formatted}]`.gray);
        process.stdout.write(` [LOG] `.green);

        if (typeof text === 'string') {
            process.stdout.write(`${text}`);
        }
        else {
            process.stdout.write(text);
        }
        process.stdout.write(EOL);
        break;

    default:
        process.stdout.write(`[${formatted}] [DFT] `.gray);
        
        if (typeof text === 'string') {
            process.stdout.write(`${text}`);
        }
        else {
            process.stdout.write(text);
        }
        
        process.stdout.write(EOL);
    }
};

module.exports = { 
    log
};