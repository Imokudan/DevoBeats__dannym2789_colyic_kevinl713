const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.db');

const fetchAll = async (sql, params) => {
  return new Promise((pass, fail) => {
    db.serialize(() => {
      db.all(sql, params, (err, rows) => {
        if (err) {fail(err);}
        pass(rows);
      });
    });
  });
}

const fetchFirst = async (sql, params) => {
  return new Promise((pass, fail) => {
    db.serialize(() => {
      db.get(sql, params, (err, row) => {
        if (err) {fail(err);}
        pass(row);
      });
    });
  });
}

const createTables = async () => {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS users;");
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL);");
    db.run("CREATE TABLE IF NOT EXISTS scores (songs TEXT NOT NULL, scores INTEGER DEFAULT 0, id INTEGER NOT NULL);");
    });
    console.log("Tables ready");
  db.close();
}

const createUser = async (name, pass) => {
  let state = false;
  db.serialize(() => {
    let rowarray = fetchAll("SELECT id from users where username = ?", name);
    if (rowarray.length == 0){
      db.run("INSERT INTO users (username, password) VALUES (?, ?);", (name, pass));
      console.log("Successfully added user: " + name);
      state = true;
    }
    else {console.log("Username " + name + " already exists!");}
    });
  db.close();
  return state;
}

const getUser = async (user) => {
  let data = "";
  db.serialize(() => {
    db.get("SELECT * FROM users WHERE username = ?", user, function(err, row){
      console.log("Getting user: " + user);
      data = row.username;
      console.log("Username " + user + " obtained");
    });
  });
  db.close();
  return data;
}

const getPass = async (user) => {
  db.serialize(() => {
    let data = "";
    db.get("SELECT * FROM users WHERE username = ?", user, function(err, row){
      console.log("Getting password for user: " + user);
      data = row.password;
      console.log("Password obtained for user: " + user);
    });
  });
  db.close();
  return data;
}

const getUserAllScores = async (usernameid) => {
  let userscores = [];
  db.serialize(() => {
    db.all('SELECT * FROM scores WHERE id = ?', usernameid, function(err, rows){
      console.log("Getting scores of user: " + usernameid);
      for (let i = 0; i < rows.length; i++){
        userscores.push(rows[i].score);
      }
      console.log("User high scores obtained");
      console.log("User: " + usernameid + "'s scores: " + userscores);
    });
  });
  db.close();
  return userscores;
}

const getUserSongScores = async (usernameid, song) => {
  let data = [];
  db.serialize(() => {
    if (["Sample1","Sample2"].includes(song)){
        console.log("Getting song: " + song + "for user: " + userid);
        db.all('SELECT * FROM scores WHERE id = ? AND songs = ?', (usernameid, song), function(err, rows){
          for (let i = 0; i < rows.length; i++){
            data.push((row[i].song, row[i].score));
            console.log("Score obtained");
          }
        });
    }
  });
  db.close();
  return data;
}

const setUserScore = async (usernameid, song, score) => {
  let state = false;
  db.serialize(() => {
    db.run("INESERT INTO scores (id, songs, scores) VALUES (?, ?, ?);", (usernameid, song, score));
  });
  db.close();
  return state;
}

createTables();
createUser("danny", "password");
