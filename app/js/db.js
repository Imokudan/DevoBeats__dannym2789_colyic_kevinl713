const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

const fetchAll = (sql, params) => {
  return new Promise((pass, fail) => {
    db.all(sql, params, (err, rows) => {
      if (err) {return fail(err);}
      pass(rows);
    });
  });
};

const fetchFirst = (sql, params) => {
  return new Promise((pass, fail) => {
    db.get(sql, params, (err, row) => {
      if (err) {return fail(err);}
      pass(row);
    });
  });
};

const createTables = () => {
  db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL);");
    db.run("CREATE TABLE IF NOT EXISTS scores (songs TEXT NOT NULL, scores INTEGER DEFAULT 0, id INTEGER NOT NULL);");
  });
  console.log("Tables ready");
};

const createUser = async (name, pass) => {
  let state = false;

  try {
    let rowarray = await fetchAll("SELECT id FROM users WHERE username = ?", [name]);

    if (!rowarray || rowarray.length === 0) {
      await new Promise((resolve, reject) => {
        db.run("INSERT INTO users (username, password) VALUES (?, ?);", [name, pass], function(err) {
          if (err) reject(err);
          console.log("Successfully added user: " + name);
          state = true;
          resolve();
        });
      });
    } else {
      console.log("Username " + name + " already exists!");
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }

  return state;
};

const getUser = async (user) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE username = ?", [user], function(err, row) {
      if (err) return reject(err);
      if (!row) return resolve(null);
      console.log("Username " + user + " obtained");
      resolve(row.username);
    });
  });
};

const getPass = async (user) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE username = ?", [user], function(err, row) {
      if (err) return reject(err);
      if (!row) return resolve(null);
      console.log("Password for " + user + " obtained");
      resolve(row.password);
    });
  });
};

const getUserAllScores = async (usernameid) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM scores WHERE id = ?", [usernameid], function(err, rows) {
      if (err) return reject(err);

      let userscores = rows.map(row => row.scores);
      console.log("User: " + usernameid + "'s scores: " + userscores);

      resolve(userscores);
    });
  });
};

const getUserSongScores = async (usernameid, song) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT songs, scores FROM scores WHERE id = ? AND songs = ?', [usernameid, song], function(err, rows) {
      if (err) return reject(err);

      if (!rows.length) {
        console.log('No scores found for for '+ song + ' and user ID ' + usernameid);
        return resolve([]);
      }

      const data = rows.map(row => [row.songs, row.scores]);
      console.log('Scores retrieved for '+ song + ' and user ID ' + usernameid, data);
      resolve(data);
    });
  });
};

const setUserScore = async (usernameid, song, score) => {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO scores (id, songs, scores) VALUES (?, ?, ?);", [usernameid, song, score], function(err) {
      if (err) return reject(err);

      console.log("Score set for user: " + usernameid);
      resolve(true);
    });
  });
};

const IdToUser = async (userid) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT username FROM users WHERE id = ?", [userid], function(err, row){
      if (err) return reject(err);

      if (!row) {
        console.log('No user found for userID: ' + userid);
        return resolve(null);
      }

      console.log('User ' + row.username + ' found for userID: ' + userid);
        return resolve(row.username);
    });
  });
}

const UserToID = async (username) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT id FROM users WHERE username = ?", [username], function(err, row){
      if (err) return reject(err);

      if (!row) {
        console.log('No id found for username: ' + username);
        return resolve(null);
      }

      console.log('UserID ' + row.id + ' found for user ' + username);
        return resolve(row.id);
    });
  });
}

const getSongsList = async (folderPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      const fileNames = files.filter(file => {
        return fs.stat(path.join(folderPath, file)).isFile();
      });
      resolve(fileNames);
    });
  });
};

module.exports = {fetchAll, fetchFirst, createTables, createUser, getUser, getPass, getUserAllScores, getUserSongScores, setUserScore, IdToUser, UserToID, getSongsList};
