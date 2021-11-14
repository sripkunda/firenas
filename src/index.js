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
    exec(crud.c, argv.path, argv.keep); 
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
    exec(crud.dl, argv.id); 
  })
  .command('o [id]', 'open a file in the remote filesystem.', (yargs) => {
    return yargs
      .positional('id', {
        describe: 'id of file in the remote filesystem',
      })
  }, (argv) => {
    exec(crud.ru, argv.id); 
  })
  .command('r [id]', 'delete a file from the remote filesystem.', (yargs) => {
    return yargs
      .positional('id', {
        describe: 'id of file in the remote filesystem',
      })
  }, (argv) => {
    exec(crud.d, argv.id); 
  })
  .command('set [key]', 'authorize firebase to create filesystem.', (yargs) => {
    return yargs
      .positional('key', {
        describe: 'path to private key json file (consumes json file).',
      })
  }, (argv) => {
    exec(crud.i, argv.key); 
  })
  .parse()

async function exec(f, ...args) { try { console.log(await f(...args)); } catch(e) { console.error(e); }}