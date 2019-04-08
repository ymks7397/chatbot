const Botkit = require('botkit');
const brain = require('../src/search');

const controller = Botkit.slackbot({
  clientSigningSecret: process.env.clientSecret
});

controller.spawn({
  token: process.env.token
}).startRTM(err => {
  if (err) {
    throw new Error(`Failed to connect to Slack: ${err}`);
  }
});

async function response(bot, message) {
  const text = await brain.search(message.text);
  bot.reply(message, text);
}

controller.hears(['(.*)'], ['direct_message', 'direct_mention', 'mention'], response);
