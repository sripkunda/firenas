const fs = require("fs");
const admin = require("firebase-admin");
const p = require("path");
const rl = require("readline");
const { exec } = require('child_process'); 

const data = p.join(
  process.env.APPDATA ||
    (process.platform == "darwin"
      ? `${process.env.HOME}/Library/Preferences`
      : `${process.env.HOME}/.local/share`),
  "/firenas/"
);
const key = p.join(data, "key.json");
const serviceAccount = fs.existsSync(key) ? require(key) : undefined;
if (serviceAccount)
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `${serviceAccount.project_id}.appspot.com`,
  });

async function c(path, keep, name) {
  if (!path) throw Error("Error: Invalid path.");
  return await admin
    .storage()
    .bucket()
    .upload(path)
    .then(async () => {
      if (!keep) fs.unlink(path, () => {});
      return "\x1b[36mFile Uploaded Successfully\x1b[0m";
    })
    .catch((e) => {
      throw Error(e);
    });
}

async function ru(id) {
  if (typeof id === 'undefined') throw Error("Error: Invalid ID.");
  const n = ((await _g())[id])?.name; 
  if (!n) throw Error("Error: File not found.");
  const tmp = p.join(data, `tmp.${n.split(" ").join("_")}`); 
  const file = await admin.storage().bucket().file(n); 
  const s = file.createReadStream().pipe(fs.createWriteStream(tmp));
  s.on("close", () => {
    return exec(`${_cliopen()} "${tmp}"`, async (e) => {
      if (e) throw Error(e);
      await fs.createReadStream(tmp).pipe(file.createWriteStream());
      fs.unlink(tmp, () => {});
    });
  });
  return "\x1b[36mRequest Completed Successfully\x1b[0m";
}

async function dl(id) {
  if (typeof id === 'undefined') throw Error("Error: Invalid ID.");
  const n = ((await _g())[id])?.name; 
  if (!n) throw Error("Error: File not found.");
  const s = admin.storage().bucket().file(n).createReadStream().pipe(fs.createWriteStream(n));
  return `\x1b[36mFile Downloaded Successfully (${n})\x1b[0m`; 
}

async function d(id) {
  if (typeof id === 'undefined') throw Error("Error: Invalid ID.");
  const n = ((await _g())[id])?.name; 
  if (!n) throw Error("Error: File not found.");
  admin.storage().bucket().file(n).delete(); 
  return "\x1b[31mFile Deleted Successfully\x1b[0m";
}

async function ls(s) {
  return (s ||(await _g().then((files) => {
      return files.length ? files.map((e, i) => `${decodeURI(e.id)} [id=${i}]`) : ["No files stored."];
  }))).join("\n");
}

function i(path, id="") {
  fs.readFile(path, "utf-8", (e, d) => {
    if (e) throw Error(e);
    fs.mkdir(data, { recursive: true }, (e) => {
      if (e) throw Error(e);
      fs.writeFile(p.join(data, `key${id}.json`), d, (e) => {
        if (e) throw Error(e);
      });
    });
  });
  fs.unlink(path, () => {});
  return "\x1b[36mRequest Completed Successfully\x1b[0m";
}

function sw(n = 0) {
  const nn = (name) => p.join(data, `${name}.json`); 
  const temp = nn("temp");
  const swapped = nn(`key${n}`);
  fs.rename(swapped, temp, (e) => {
    if (e) throw Error(e); 
    fs.rename(key, swapped, (e) => {
      if (e) throw Error(e); 
      fs.rename(temp, key, (e) => {
        if (e) throw Error(e); 
      });
    });
  });
  return "\x1b[36mRequest Completed Successfully\x1b[0m";
}

async function s() {
  const files = await _g(); 
  return (
    `File Count: ${files.length}\nData Space Used: ${files.reduce((p, c) => p + (parseFloat(c.metadata.size) || 0), 0) / (Math.pow(10, 6))} MB\nBucket: ${serviceAccount.project_id}.appspot.com`
  )
}

async function _g() {
  return await admin.storage().bucket().getFiles().then(files => {
    return files.flat();
  }); 
}

function _cliopen() {
  switch (process.platform) { 
     case 'darwin' : return 'open';
     case 'win32' : return 'start';
     case 'win64' : return 'start';
     default: return 'xdg-open';
  }
}

module.exports = { c, ru, d, dl, ls, i, s, sw };
