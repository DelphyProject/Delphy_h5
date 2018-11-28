# Delphy Web APP

## Environment

If you experience any problem running a freshly-cloned repository, always check if you have correctly configured your environment as follows.

To successfully run the application, the following environment is recommended (The following steps are shown for Windows):

### Node.js

- Version: `8.11.1+`

1. Download and install [Node.js 8.11.1](https://nodejs.org/dist/v8.11.1/node-v8.11.1-x64.msi).
2. Install the .msi File.

## Download Sourcecode

First clone the repository:

    $ git clone  https://zhaohailong:zhaohl-1023@github.com/DelphyProject/Delphy_R.git
    $ cd Delphy_R

Checkout branch `develop`:

    $ git checkout develop

## Config

modify the server api address in config file: `Delphy_R/src/config/index.js`

    for example `let baseurl = 'https://test.cokeway.info/`


## Run in Local Machine

    `npm install`
    `npm start`

## Deployment

Build development:
    `npm build-dev`

Build staging:
    `npm build-staging`

Build production:
    `npm build`

upload the folder `Delphy_R/build` to the server.
