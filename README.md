CSS Relative URL Processor
==========================

A small module designed to convert relative asset URL's in CSS files into absolute URL's for deployment
to a combo handled CDN (yui.yahooapis.com).

When you request a CSS file from a server with a ComboHandler on it, relative CSS assets are broken by default.

If your CSS looks like this:

```css
.foo {
    background-image: url( foo.png );
}
```

Located in a file with this path: `foo/bar/baz/main.css`

Loaded from a ComboHandler like this: `/combo?foo/bar/baz/main.css`

Your Image will resolve to: `/combo/foo.png`

When it should resolve to: `/foo/bar/baz/foo.png`

That's what this module does!


Build Status
------------

[![Build Status](https://secure.travis-ci.org/davglass/cssproc.png?branch=master)](http://travis-ci.org/davglass/cssproc)

Install
-------

    npm install cssproc


Examples
--------

As a file (from `examples/file/`):

```javascript
var cssproc = require('../../lib'),
    path = require('path'),
    fs = require('fs');

var file = path.join(__dirname, 'a1/f1/f2/test.css');

fs.readFile(file, 'utf8', function(err, data) {
    cssproc.parse({
        root: __dirname,
        path: file,
        base: 'http://yui.yahooapis.com/gallery-123456/'
    }, data, function(err, str) {
        console.log(str);
    });
});
```

It could also be used inside of a [combo handler](https://github.com/rgrove/combohandler)


