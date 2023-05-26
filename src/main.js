const { Client, Events, GatewayIntentBits } = require('discord.js');
const fs = require("fs")

//init

var token_raw = fs.readFileSync(__dirname + "/token.json")
var TOKEN = JSON.parse(token_raw)["token"]
var PREFIX = ":"

const client = new Client({ intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
] });

client.on(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`)
})

client.on(Events.MessageCreate, async message => {
    if(message.content.startsWith(PREFIX)){
        if(message.content.includes("rozpis")){

            var message_args = message.content.split(" ")
            var n = ((message_args.indexOf("-n") + 1 != 0) ? message_args[message_args.indexOf("-n") + 1]: 0)

            //console.log(message.guild.roles.cache.get("1026475673621106699")).guild.members
            var members = await message.guild.members.fetch()
            var journalists = []
            members.forEach(member => {
                if(member._roles == "1026475673621106699"){
                    journalists.push(member)
                }
            })

            console.log(journalists)

            var idx_arr = [];
            while(idx_arr.length < n){
                var r = Math.floor(Math.random() * journalists.length) + 1;
                if(idx_arr.indexOf(r) === -1) idx_arr.push(r);
            }

            console.log(idx_arr)

            var final = []
            idx_arr.forEach(idx => {
                final.push(journalists[idx].id)
            })

            console.log(final)
        }
    }
})

client.login(TOKEN)