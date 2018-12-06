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
const { exec } = require('child_process');


const compozenUp = () => {
    cmd = 'docker-compose -f '+__dirname+'/../docker-compose.yml up &';
    console.log(cmd);
    const subprocess = exec(cmd);

    subprocess.stdout.on('data', (data) => {
        cmd = 'docker-compose -f '+__dirname+'/../docker-compose.yml ps';
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
            console.error(`exec error: ${error}`);
            return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            process.exit(0);
        });
    });
};

const compozenDown = () => {
    cmd = 'docker-compose -f '+__dirname+'/../docker-compose.yml down &';
    console.log(cmd);
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
};

const importRecipe = (params) => {
    var redis = require("redis");
    var client = redis.createClient();
 
    client.on("error", function (err) {
        console.log("Error " + err);
        process.exit(-1);
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
    var redis = require("redis");
    var client = redis.createClient();
 
    client.on("error", function (err) {
        console.log("Error " + err);
        process.exit(-1);
    });
    client.get(params.recipe_name, function(err, reply) {
        recipe = flat.unflatten(JSON.parse(reply));
        console.log(recipe);
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

const addIngredient = (params) => {
    var redis = require('redis');
    var client = redis.createClient();
    client.on("error", function (err) {
        console.log("Error " + err);
        process.exit(-1);
    });
    client.get(params.recipe_name, function(err, reply) {
        recipe = flat.unflatten(JSON.parse(reply));
        console.log(recipe.services);
        
        if(params.service_file.includes('.yml')){
            var serv_file = yaml.safeLoad(fs.readFileSync(params.service_file, 'utf8'));
            
            if(!recipe.services.hasOwnProperty(Object.keys(serv_file)[0])){
                recipe.services[Object.keys(serv_file)[0]]=serv_file[Object.keys(serv_file)[0]];
                console.log(recipe);

                client.set(params.recipe_name, JSON.stringify(flat.flatten(recipe)), function(err,reply){
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
                console.log("service already exists");
                process.exit(0);
            }
            
        }
        else if (params.service_file.includes('.json')){
            var serv_file = JSON.parse(fs.readFileSync(params.service_file, 'utf8'));
            
            if(!recipe.services.hasOwnProperty(Object.keys(serv_file)[0])){
                recipe.services[Object.keys(serv_file)[0]]=serv_file[Object.keys(serv_file)[0]];
                console.log(recipe);

                client.set(params.recipe_name, JSON.stringify(flat.flatten(recipe)), function(err,reply){
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
                console.log("service already exists");
                process.exit(0);
            }  
        }
        else{
            console.error("Invalid file format. must be .yml or .json");
            client.quit();
            process.exit(-1);
        }
        
    });
};

const modIngredient = (params) => {
    var redis = require('redis');
    var client = redis.createClient();
    client.on("error", function (err) {
        console.log("Error " + err);
        process.exit(-1);
    });
    client.get(params.recipe_name, function(err, reply) {
        recipe = flat.unflatten(JSON.parse(reply));
        console.log(recipe.services);
        
        if(params.service_file.includes('.yml')){
            var serv_file = yaml.safeLoad(fs.readFileSync(params.service_file, 'utf8'));
            
            if(recipe.services.hasOwnProperty(params.service_name)){
                recipe.services[params.service_name]=serv_file[params.service_name];
                console.log(recipe);

                client.set(params.recipe_name, JSON.stringify(flat.flatten(recipe)), function(err,reply){
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
                console.log("service doesn't exist");
                process.exit(0);
            }
            
        }
        else if (params.service_file.includes('.json')){
            var serv_file = JSON.parse(fs.readFileSync(params.service_file, 'utf8'));
            
            if(recipe.services.hasOwnProperty(params.service_name)){
                recipe.services[params.service_name]=serv_file[params.service_name];
                console.log(recipe);

                client.set(params.recipe_name, JSON.stringify(flat.flatten(recipe)), function(err,reply){
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
                console.log("service doesnt exist");
                process.exit(0);
            }  
        }
        else{
            console.error("Invalid file format. must be .yml or .json");
            client.quit();
            process.exit(-1);
        }
        
    });
};

const delIngredient = (params) => {
    var redis = require('redis');
    var client = redis.createClient();
    client.on("error", function (err) {
        console.log("Error " + err);
        process.exit(-1);
    });
    client.get(params.recipe_name, function(err, reply) {
        recipe = flat.unflatten(JSON.parse(reply));
        console.log(recipe.services);
        
        if(recipe.services.hasOwnProperty(params.service_name)){

            delete recipe.services[params.service_name];
            console.log(recipe);

            client.set(params.recipe_name, JSON.stringify(flat.flatten(recipe)), function(err,reply){
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
            console.log("service doesn't exist");
            process.exit(0);
        }
    });
};

module.exports = { 
    compozenUp,
    compozenDown,
    importRecipe, 
    spinupRecipe,
    addIngredient,
    modIngredient,
    delIngredient
};