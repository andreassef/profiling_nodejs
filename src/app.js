const express = require('express')();
const crypto = require('crypto');


const users = [];
express.get('/signUp', (request, response) => {

    let username = request.query.username || "";
    let password = request.query.password || "";
    users[username] = {};

    if(!username || !password) {
        return response.send("Please enter both username/password");
    }

    //const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, "sha512");

    const computeHash = (pass, salt) => {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(pass, salt, 10000, 512, "sha512", (err, key) => {
                resolve(key.toString("base64"));
            });
        })
    }

    const createNewUser = async (user, pass) => {
        const salt = crypto.randomBytes(128).toString("base64");
        const hash = await computeHash(pass, salt);
        users[user] = { salt, hash};
        response.send(users[user])
    }

    createNewUser(username, password);
});

express.listen(3000, () => {
    console.log('App logado na porta 3000');
});