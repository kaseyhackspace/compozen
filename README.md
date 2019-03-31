# compozen
cli command to generate and manage docker-compose.yml files

## Project Folder Structure

1. `data/` - where redis database stores docker-compose recipes
2. `lib/compozen.js` - where all the backend compozen functions are defined
3. `cli.js` - main entrypoint of cli command. All cli options are defined here
4. `docker-compose.yml` - docker-compose file that defines the redis database used by compozen
5. `package.json` - package file of compozen

## Setup and Installation

1. Install nodejs v10.x (https://nodejs.org/en/download/)
2. Install yarn (https://yarnpkg.com/en/docs/install)
3. Run `yarn` to install node modules
4. Run `sudo npm link` to add `compozen` command to path
