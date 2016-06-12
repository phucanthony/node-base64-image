/* @flow */
import request from 'request';
import _ from 'lodash';
import {readFile as read, writeFile as write} from 'fs';

/**
 * Callback for encode/decode functions
 *
 * @callback fnCallback
 * @param {Object} Error object
 * @param {(string|Object)} Response string or Buffer object
 */
type Callback<T> = (err: ?Error, x?: T) => void;

/**
 * Encodes a remote or local image to Base64 encoded string or Buffer
 *
 * @name encode
 * @param {string} url - URL of remote image or local path to image
 * @param {Object} [options={}] - Options object for extra configuration
 * @param {boolean} options.string - Returns a Base64 encoded string. Defaults to Buffer object
 * @param {boolean} options.local - Encode a local image file instead of a remote image
 * @param {(boolean|number)} options.wrap - Wrap encoded string at 76 chars or the length specified
 * @param {fnCallback} callback - Callback function
 * @example <caption>Example 1 - Return Base64 encoded string of a remote image</caption>
 * var base64 = require('node-base64-image');
 * base64.encode('https://me.com/rg1kxkgxayhdgoqdaejz.jpg', {string: true}, function (err, data) {
 *    if (err) {
 *        // handle error
 *    }
 *
 *    console.log(data);
 * });
 * @example <caption>Example 2 - Return Buffer object of a remote image</caption>
 * var base64 = require('node-base64-image');
 * base64.encode('https://me.com/rg1kxkgxayhdgoqdaejz.jpg', {}, function (err, data) {
 *    if (err) {
 *        // handle error
 *    }
 *
 *    console.log(data instanceof Buffer); // true
 * });
 * @return {fnCallback} - Returns the callback
 */
export function encode(url: string, options: Object = {string: false, local: false, wrap: false}, callback: Callback<mixed>) { // eslint-disable-line
  if (_.isUndefined(url) || _.isNull(url) || !_.isString(url)) {
    return callback(new Error('URL is undefined or not properly formatted'));
  }

  if (options.local) {
    read(url, (err, body) => {
      if (err) {
        return callback(err);
      }

      /**
       * @todo Handle this better.
       */
      let result = options.string ? body.toString('base64') : new Buffer(body, 'base64');
      return callback(null, result);
    });
  } else {
    request({ url: url, encoding: null }, (err, response, body) => {
      if (err) {
        return callback(err);
      }

      if (!body) {
        return callback(new Error('Error retrieving image - Empty Body!'));
      }

      if (body && response.statusCode === 200) {
        /**
         * @todo Handle this better.
         */
        let result = options.string ? body.toString('base64') : new Buffer(body, 'base64');
        return callback(null, result);
      }

      return callback(new Error('Error retrieving image - Status Code ' + response.statusCode));
    });
  }
}

/**
 *  Checks to see if a string is Base64 encoded data string
 *
 *  @name isDataURL
 *  @private
 *  @param  {string}  str - Base64 encoded data string
 *  @return {Boolean} - Returns true if encoded data string. Otherwise false.
 */
function isDataURL(str: string): boolean {
	var isDataURLRegex = /^\s*data:([a-z]+\/[a-z0-9\-\+]+(;[a-z\-]+\=[a-z0-9\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i; // eslint-disable-line
  return !!str.match(isDataURLRegex);
}

/**
 * Decodes an base64 encoded image buffer and saves it to disk
 *
 * @name decode
 * @param {(Buffer|string)} image - Image Buffer object or Base64 encoded string
 * @param {Object} [options={}] - Options object for extra configuration
 * @param {string} options.filename - Filename for the final image file
 * @param {fnCallback} callback - Callback function
 * @return {fnCallback} - Returns the callback
 */
export function decode(image: any, options: Object = {filename: 'saved-image'}, callback: Callback<mixed>) { // eslint-disable-line
  if (!_.isBuffer(image) || (!_.isString(image) && !isDataURL(image))) {
    return callback(new Error('The image is not a Buffer object or Base 64 encoded data string'));
  }

  write(options.filename + '.jpg', image, 'base64', (err) => {
    if (err) {
      return callback(err);
    }

    return callback(null, 'Image saved successfully to disk!');
  });
}

const base64 = {
  encode: encode,
  decode: decode
};

export default base64;
