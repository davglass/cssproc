
/*
Copyright (c) 2012, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/

var path = require('path'),
    url = require('url');

// url(../../foo.png)
var URL_REGEX = "(?:(url\\s*\\(\\s*)([^\\s\\)]+))";


// AlphaImageLoader(src='picker_mask.png')
var ALPHA_IMAGE_LOADER_REGEX = "(?:(AlphaImageLoader\\s*\\(\\s*src\\=)([^,\\s\\)]+))|(?:(AlphaImageLoader\\s*\\(.*?src\\=)([^,\\s\\)]+))";

var REGEX_FIND = new RegExp(URL_REGEX + '|' + ALPHA_IMAGE_LOADER_REGEX, 'gim');
var REGEX_PARSE = new RegExp(URL_REGEX + '|' + ALPHA_IMAGE_LOADER_REGEX, 'i');


var normalize = function(options, str, m) {
    var top, resolved, relative, URI,
        quote, item, baseItem = m[0];

    item = m[6] || m[4] || m[2];
    quote = item.substr(0, 1);
    if (quote && (quote === '"' || quote === "'")) {
        item = item.substr(1);
        item = item.substr(0, item.length - 1);
    }
    if (!item.match(/^https?:\/\//) && (item.indexOf('.') > -1)) {
        URI = url.parse(options.base);
        top = path.dirname(options.path);
        resolved = path.resolve(top, item);
        relative = resolved;

        if (item.charAt(0) !== '/') {
            relative = path.relative(options.root, resolved);
        }

        // Windows root directory handling.
        if (process.platform === 'win32' && relative.substr(1, 2) === ':\\') {
            relative = relative.substr(2);
        }

        expanded = URI.protocol + '//' + URI.hostname + path.join(URI.pathname, relative).replace(/\\\\|\\/g, '/');

        str = str.replace(baseItem, baseItem.replace(item, expanded));
    }
    return str;
};

exports.parse = function(options, str, callback) {
    
    var items = str.match(REGEX_FIND);

    if (Array.isArray(items)) {
        items.forEach(function(matcher) {
            var m = matcher.match(REGEX_PARSE);
            str = normalize(options, str, m);
        });
    }

    callback(null, str);
};
