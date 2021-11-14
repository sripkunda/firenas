# Firenas

A CLI tool for accessing files in a self-hosted remote firebase filesystem.

# Installation 

Firenas can be installed  globally through NPM.

```shell
npm install firenas -g
```

# Setup 

Firenas uses [Google's Firebase Cloud Storage](https://firebase.google.com/docs/storage) to store and access files.

## Firebase Project

1. Create a new firebase project at [https://console.firebase.google.com](https://console.firebase.google.com). 
2. Setup Cloud Storage in the location of your choice
3. Download (generate) a private key in Settings > Project Settings > Service Accounts to grant firenas access to your filesystem. 

## Firenas

Run the command: 

```shell
fn set /path/to/private/key.json
```

Firenas will consume (delete) the downloaded file automatically. 

Use `fn help` for a commands reference. 
