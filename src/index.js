import 'dotenv/config'

import axios from 'axios'
import {Client, IntentsBitField} from 'discord.js'
import express from 'express'
import url from 'url'

import {arraySoldiers} from './soldiers.js';

const app = express();
const port = process.env.PORT || 7778;

app.get('/', (req, res) => {
  res.send(
      '42 Stalker <a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-f1668df1c5be15e85a19f115a5f8698f1b4485193bbdf6213a85d2dbf982c02e&redirect_uri=http%3A%2F%2Fwww.localhost%3A7778%2Fapi%2Fauth%2Fredirect&response_type=code">test</a>');
});

app.get('/api/auth/redirect', async (req, res) => {
  //   res.send('redirecting...');
  const {code} = req.query;
  if (code) {
    const formData = new url.URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.ClientID,
      client_secret: process.env.ClientSecret,
      code: code.toString(),
      redirect_uri: 'http://www.localhost:7778/api/auth/redirect',
    });

    const output = await axios
                       .post('https://api.intra.42.fr/oauth/token', formData, {
                         headers: {
                           'Content-Type': 'application/x-www-form-urlencoded',
                         }
                       })
                       .catch((error) => {
                         console.warn(error);
                         res.set('location', 'http://localhost:7778');
                         res.status(301).send();
                       });

    const access_token = output.data.access_token;

    // const yesterdayDate = a;
    for (let page = 1; page < 10; page++) {
      const apiRes =
          await axios
              .get(
                  `https://api.intra.42.fr/v2/campus/31/locations?page=${page}`,
                  {headers: {'Authorization': `Bearer ${access_token}`}})
              .then((response) => {
                const data = response.data;
                for (let i = 0; data[i]; i++) {
                  for (let j = 0; arraySoldiers[j]; j++) {
                    if (arraySoldiers[j].login == data[i].user.login) {
                      if (data[i].end_at == null)
                        arraySoldiers[j].post = data[i].host;
                      else if (
                          data[i].end_at != null &&
                          arraySoldiers[j].alreadyFound == false)
                        arraySoldiers[j].lastSeen = data[i].end_at;
                      arraySoldiers[j].alreadyFound = true;
                    }
                  }
                }
              })
              .catch((error) => {
                console.warn(error);
                res.set('location', 'http://localhost:7778');
                res.status(301).send();
                if (error.reponse) {
                  console.log(error.response);
                }
              });
    }
    console.log('Search over');
    res.set('location', 'http://localhost:7778');
    res.status(301).send();
  }
});

app.listen(port, () => {})

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
});

client.on('ready', (c) => {
  console.log('42 Stalker online');
})

client.on('messageCreate', (msg) => {
  const channelFront =
      client.channels.cache.find(channel => channel.name === 'front');

  const channelCaserne =
      client.channels.cache.find(channel => channel.name === 'caserne');

  if (msg.channel != channelCaserne) {
    return;
  }

  let reply =
      `${msg.client.emojis.cache.find(emoji => emoji.name === 'GAV')}\n`;
  if (msg.content == 'GAV') {
    for (let i = 0; arraySoldiers[i]; i++) {
      if (arraySoldiers[i].post != undefined) {
        reply += `Soldier ${arraySoldiers[i].login} present on post ${
            arraySoldiers[i].post}\n`;
      }
    }
    channelFront.send(reply);
  }
})

client.login(
    'MTE1Mjk1MzQ3ODM2NTMyMzM1NA.GKLVFf.QgWLTFWjNVxtMf0iZIbF-WKB-KChH-_75Z68aM');