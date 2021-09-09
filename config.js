/**
 * @module config
 */

/**
* @file config.js - Server-sided Node.JS config for Resume API
* @author Tanapat Kahabodeekanokkul
* @copyright Tanapat Kahabodeekanokkul 2021
* @license Tanapat-Kahabodeekanokkul
*/

/**
 * Credentials object for Resume API
 * @typedef ResumeCredentials
 * @property {string} [CREDENTIALS_FILE] path to credentials file - default is from process.env.CREDENTIALS_FILE or "credentials.json".
 * @property {string} [host] full host path to Resume API - default is from process.env.REST_HOST.
 * @property {string} [username] username for Resume API - default is from process.env.REST_USER.
 * @property {string} [password] password for Resume API - default is from process.env.REST_PW.
 * @property {string|int} [section_id_default] default Section ID, information for Resume API - default is from process.env.REST_DEFAULT_SECTION or 0.
 * @property {string[]} [lang] language hints must be BCP-47 language code in string type or array of string type ordered by highest priority to suggest the speech-to-text API - the default is located in ./public/lang.json . See more detail of [BCP-47](https://github.com/libyal/libfwnt/wiki/Language-Code-identifiers) - default also can load from [./public/lang.json](./public/lang.json) file.
 */

var credentials = {
    "CREDENTIALS_FILE": process.env.CREDENTIALS_FILE || "credentials.json",
    "host": process.env.REST_HOST || "",
    "username": process.env.REST_USER || "",
    "password": process.env.REST_PW || "",
    "section_id_default": process.env.REST_DEFAULT_SECTION || 0,
    "lang": null
};

const fs = require('fs')
try {
    if (fs.existsSync(credentials.CREDENTIALS_FILE)) {
        let load = JSON.parse(fs.readFileSync(credentials.CREDENTIALS_FILE, 'utf-8'));
        credentials = {
            ...credentials,
            ...load
        };
    }
    if (!credentials.lang) {
        credentials.lang = JSON.parse(fs.readFileSync('./public/lang.json'));
    }
} catch (e) {
    console.error(e);
}


module.exports = credentials;