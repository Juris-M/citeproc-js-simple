# citeproc-node-iojs

## Description

This module provides a basic wrapper for deploying citeproc-js
in node and iojs projects. The processor instance delivered
by the `Citeproc` method supports basic functionality of
the processor:

* Generating a bibliography listing in a chosen style and locale
* Dynamic editing operatons in a chosen style and locale

Advanced `citeproc-js` features *not* supported include:

* Multilingual citations
* Jurisdiction-dependent legal citations
* Automated abbreviation of citation elements
* HTML citation links

## Setup

To install via `npm`, use the usual incantation:

    npm install citeproc-node-iojs

To call from within a project, use `require` in the usual way:

    var csl = require('citeproc-node-iojs')

In the example above, the processor ...

## Usage

For worked examples of 

To download the styles and languages required for this module to work, run the following:
````bash
git submodule add git@github.com:citation-style-language/styles.git
git submodule add git@github.com:citation-style-language/locales.git
````

Reference them when calling the wrapper. See test/test.js for how to do that.
