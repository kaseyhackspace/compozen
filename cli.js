#!/usr/bin/env node

/** 
 * Description: Main entrypoint of program, 
 * defines all commands you can do with compozen
 * Author: Kasey Martin
 * Email: kasey.hackspace@gmail.com
*/

const compozen_cli = require('commander');
const { 
    compozenUp,
    compozenDown,
    importRecipe, 
    spinupRecipe, 
    addIngredient,
    modIngredient,
    delIngredient } = require('./lib/compozen');

compozen_cli
    .version('0.0.1')
    .description('CLI tool to generate and manage docker-compose.yml files');

compozen_cli
    .command('up')
    .alias('u')
    .description('start compozen\'s redis server')
    .action(
        () => {
            compozenUp();
        }
    );

compozen_cli
    .command('down')
    .alias('d')
    .description('stop compozen\'s redis server')
    .action(
        () => {
            compozenDown();
        }
    );

compozen_cli
    .command('import-recipe <recipe_name> <recipe_file>')
    .alias('i')
    .description('import a YAML or JSON encoded docker-compose recipe')
    .action(
        (recipe_name, recipe_file) => {
            importRecipe({recipe_name, recipe_file});
        }
    );

compozen_cli
    .command('spinup-recipe <recipe_name>')
    .alias('s')
    .description('export recipe to a valid docker-compose.yml file')
    .option('-o, --out <out_directory>')
    .action(
        (recipe_name, cmd) => {
            spinupRecipe({recipe_name, cmd});
        }
    );

compozen_cli
    .command('add-ingredient <recipe_name> <service_file>')
    .alias('ai')
    .description('import a YAML or JSON encoded docker-compose service into a recipe')
    .action(
        (recipe_name, service_file) => {
            addIngredient({recipe_name, service_file});
        }
    );

compozen_cli
    .command('mod-ingredient <recipe_name> <service_name> <service_file>')
    .alias('mi')
    .description('modify a service in a recipe with a YAML or JSON encoded docker-compose service')
    .action(
        (recipe_name, service_name, service_file) => {
            modIngredient({recipe_name, service_name, service_file});
        }
    );

compozen_cli
    .command('del-ingredient <recipe_name> <service_name>')
    .alias('di')
    .description('delete a service from a recipe')
    .action(
        (recipe_name, service_name) => {
            delIngredient({recipe_name, service_name});
        }
    );

compozen_cli.parse(process.argv);
if(compozen_cli.args.length === 0){
    compozen_cli.help();
}
