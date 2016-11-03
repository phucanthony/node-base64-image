/* @flow */
'use strict';

const utils = {
  /**
   *  Checks to see if a string is Base64 encoded data string
   *
   *  @name isDataURL
   *  @private
   *  @param  {string}  str - Base64 encoded data string
   *  @return {Boolean} - Returns true if encoded data string. Otherwise false.
   */
  isDataURL: function (str: string): boolean {
    var isDataURLRegex = /^\s*data:([a-z]+\/[a-z0-9\-\+]+(;[a-z\-]+\=[a-z0-9\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i; // eslint-disable-line
    return !!str.match(isDataURLRegex);
  },
  /**
   *  Strips the first few characters from data URL (data:image/png;base64...)
   *
   *  @name stripMeta
   *  @private
   *  @param  {string}  str - Base64 encoded data string
   *  @return {string} - Returns the stripped data URL string.
   */
  stripMeta: function (): string {}
};

export default utils;
