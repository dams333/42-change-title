import "dotenv/config";
import { Client } from "42.js";
// @ts-ignore
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
const axios = require('axios').default;


(async () => {
    const client = new Client(
        <string>process.env.ID,
        <string>process.env.SECRET
    );

    const rl = readline.createInterface({ input, output });

    const login = process.env.LOGIN;
    if(!login)
    {
        console.log("Please set LOGIN environment variable");
        rl.close();
        process.exit(1);
    }

    const user = await client.users.get(login);
    if(!user)
    {
        console.log('User not found');
        rl.close();
        return;
    }
    //Get titles
    const titles_user = await client.fetch("/users/" + user.id + "/titles_users?");

    const titles = await client.fetch("users/" + user.id + "/titles?");

    for(const idx in titles_user)
    {
        const text = (<any>titles[idx]).name.replace("%login", login);
        console.log(`${idx}: ${text}`);
    }

    const tit = await rl.question('Title: ');

    const title = parseInt(tit);
    if(isNaN(title))
    {
        console.log('Please choose a real number');
        rl.close();
        return;
    }

    if(title < 0 || title >= titles_user.length)
    {
        console.log('Please choose a real number');
        rl.close();
        return;
    }

    const titleId = (<any>titles_user[title]).id;

    console.log(`Put the title with id ${titleId}`);

    const cookie = "_intra_42_session_production=" + process.env.SESSION_COOKIE;
    const res = await axios.get(`https://profile.intra.42.fr/titles_users/${titleId}/selected`, { headers: { "cookie": cookie } });
    
    if(res.status === 200)
    {
        console.log('Title put');
    }
    else
    {
        console.log('Error');
    }

    rl.close();
})();