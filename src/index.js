#! /usr/bin/env node
const yargs = require('yargs/yargs');
const crud = require("./crud");
const { hideBin } = require('yargs/helpers');

yargs(hideBin(process.argv))
  .command('a [path]', 'add a file to the remote filesystem.', (yargs) => {
    return yargs
      .positional('path', {
        describe: 'path to file for upload',
      })
      .option('keep', {
        describe: 'keep the file even after it is consumed by the remote filesystem.'
      })
  }, (argv) => {
    exec(crud.c, argv.verbose, argv.path, argv.keep); 
  })
  .command('ls', 'get list of files in remote filesystem.', (yargs) => {
  }, (argv) => {
    exec(crud.ls); 
  })
  .command('dl [id]', 'download a file from the remote filesystem.', (yargs) => {
    return yargs
      .positional('id', {
        describe: 'id of file in the remote filesystem',
      })
  }, (argv) => {
    exec(crud.dl, argv.verbose, argv.id); 
  })
  .command('o [id]', 'open a file in the remote filesystem.', (yargs) => {
    return yargs
      .positional('id', {
        describe: 'id of file in the remote filesystem',
      })
  }, (argv) => {
    exec(crud.ru, argv.verbose, argv.id); 
  })
  .command('r [id]', 'delete a file from the remote filesystem.', (yargs) => {
    return yargs
      .positional('id', {
        describe: 'id of file in the remote filesystem',
      })
  }, (argv) => {
    exec(crud.d, argv.verbose, argv.id); 
  })
  .command('set [key] [id]', 'authorize firebase to create filesystem; if [id] is not provided, then the existing key will be replaced.', (yargs) => {
    return yargs
      .positional('key', {
        describe: 'path to private key json file (consumes json file).',
      })
      .positional('id', {
        describe: 'the id number of this key, in the case that you want multiple storage buckets.'
      })
  }, (argv) => {
    exec(crud.i, argv.verbose, argv.key, argv.id); 
  })
  .command('use [id]', 'use a certain firebase filesystem as the default key; if [id] is not provided, the default id is 0', (yargs) => {
    return yargs
      .positional('id', {
        describe: 'the id number of the key to use.'
      })
  }, (argv) => {
    exec(crud.sw, argv.verbose, argv.id); 
  })
  .command('i', 'view information regarding remote filesystem.', (yargs) => {
    return yargs
  }, (argv) => {
    exec(crud.s, argv.verbose); 
  })
  .option("verbose", {
    alias: "v",
    type: 'boolean', 
    description: "Run a command with error output."
  })
  .parse()

async function exec(f, verbose, ...args) { 
  try { 
    console.log(await f(...args)); 
  } catch(e) { 
    console.error(
      verbose 
      ? e 
      : `\x1b[31mAn error occurred. Please run command with verbose logging (-v or --verbose) for more details.\x1b[0m`
    ); 
  }
}