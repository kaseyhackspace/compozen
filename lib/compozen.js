#!/usr/bin/env node

/** 
 * Description: logic for compozen
 * Author: Kasey Martin
 * Email: kasey.hackspace@gmail.com
*/
// import libraries
const yaml = require('js-yaml');
const fs = require('fs');
const flat = require('flat');


const importRecipe = (params) => {
    var redis = require("redis"),
    client = redis.createClient();
 
    client.on("error", function (err) {
        console.log("Error " + err);
    });
    
    if(params.recipe_file.includes('.yml')){
        var rec_file = yaml.safeLoad(fs.readFileSync(params.recipe_file, 'utf8'));
        client.set(params.recipe_name, JSON.stringify(flat.flatten(rec_file)), function(err,reply){
            if(err){
                console.error(err);
                process.exit(-1);
            }else{
                console.log(reply);
                client.quit();
                process.exit(0);
            }
        });
        
    }
    else if (params.recipe_file.includes('.json')){
        var rec_file = JSON.parse(fs.readFileSync(params.recipe_file, 'utf8'));
        client.set(params.recipe_name, flat.flatten(rec_file), function(err,reply){
            if(err){
                console.error(err);
                process.exit(-1);
            }else{
                console.log(reply);
                client.quit();
                process.exit(0);
            }
        });  
    }
    else{
        console.error("Invalid file format. must be .yml or .json");
        client.quit();
        process.exit(-1);
    }

};

const spinupRecipe = (params) => {
    var redis = require("redis"),
    client = redis.createClient();
 
    client.on("error", function (err) {
        console.log("Error " + err);
    });
    client.get(params.recipe_name, function(err, reply) {
        console.log(flat.unflatten(JSON.parse(reply)));
        recipe = flat.unflatten(JSON.parse(reply));

        fs.writeFile('out.yml', yaml.safeDump(recipe), 'utf8', function (err) {
            if (err) {
                console.log(err);
                client.quit();
                process.exit(-1);
            }
        
            console.log("The file was saved!");
            client.quit();
            process.exit(0);
        }); 
        
    });
    
};

module.exports = { 
    importRecipe, 
    spinupRecipe 
};