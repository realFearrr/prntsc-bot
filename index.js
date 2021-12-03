const fs = require("fs");
const { Client } = require("discord.js");
const { token, channelID, prefix } = require("./config.json");
const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
});
let Interval,
  toToggle = false;

console.log(process.env);

const returnRandomCode = (
  toInclude = "abcdefghijklmnopqrstuvwxyz1234567890"
) => {
  let toReturn = "";
  for (i = 6; i > 0; i--) {
    let toAdd = toInclude[Math.floor(Math.random() * toInclude.length)];
    toReturn += toAdd;
  }
  fs.readFile("./used-codes.txt", (err, content) => {
    if (err) throw err;
    const checkRand = content.indexOf(toReturn) > -1 ? true : false;
    if (checkRand) {
      returnRandomCode();
    }
    fs.appendFileSync("./used-codes.txt", `${toReturn}\n`);
  });
  return toReturn;
};

client.on("ready", async () => {
  console.log("ready boys");
});

const sendRandLink = () => {
  let toReturn = "https://prnt.sc/";
  let toAdd = returnRandomCode();
  toReturn += toAdd;

  return toReturn;
};

client.on("messageCreate", (message) => {
  const { content, author, channel, member } = message;
  if (author.bot) return;
  if (content.startsWith(prefix)) {
    const args = content.split(prefix)[1].split(" ");
    const command = args.shift();
    switch (command) {
      case "toggle":
        if (!member.permissions.has("ADMINISTRATOR")) return;
        toToggle = !toToggle;

        channel.send(
          toToggle === true ? "you're not disabled" : "you're disabled"
        );
        const returnLocation = client.channels.cache.get(`${channelID}`);

        Interval =
          toToggle === true
            ? setInterval(() => {
                returnLocation.send(sendRandLink());
              }, 5000)
            : clearInterval(Interval);
        break;
    }
  }
});

client.login(token).catch((err) => console.error(err));
