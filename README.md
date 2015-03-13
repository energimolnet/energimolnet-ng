# energimolnet-ng
Angular SDK for Energimolnet API v2

## Installation

Currently, we recommend installing via bower:
```
bower install energimolnet/energimolnet-ng
``

## Building

Building requires node.js. Simply clone this repo, and run
```
npm install && npm start
```

This will output two files in the dist/ folder, `energimolnet.js` and the minified version `energimolnet.min.js`, built with the latest source from src/ folder.

The dist-files are available in the repo, so there should be no need to build in this way. Since angular uses its own module system, we have not provided node-style modules.