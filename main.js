import dotenv from 'dotenv';
import Discord from 'discord.js';
dotenv.config();
import Twit from 'twit';

// Twit initialize
const twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

const hook = new Discord.WebhookClient(
  process.env.DISCORD_WEBHOOK_ID,
  process.env.DISCORD_WEBHOOK_TOKEN
);

const stream = twitter.stream('statuses/filter', {
  follow: [process.env.TWITTER_USER_ID],
});

stream.on('tweet', (tweet) => {
  if (tweet.in_reply_to_status_id === null) {
    console.log(tweet);
    let url =
      'https://twitter.com/' +
      tweet.user.screen_name +
      '/status/' +
      tweet.id_str;
    console.log(tweet.user.profile_image_url_https);
    try {
      hook.send({
        username: tweet.user.name,
        content: tweet.text,
        avatar_url:
          'https://pbs.twimg.com/profile_images/1295975423654977537/dHw9JcrK_400x400.jpg',
      });
    } catch (error) {
      console.error(error);
    }
  }
});
