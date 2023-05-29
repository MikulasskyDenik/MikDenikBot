const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fs = require("fs")

//init

var token_raw = fs.readFileSync(__dirname + "/token.json")
var cache_raw = fs.readFileSync(__dirname + "/cache.json")

var TOKEN = JSON.parse(token_raw)["token"]
var CACHE = JSON.parse(cache_raw)
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

            var members = await message.guild.members.fetch()
            var journalists = []
            members.forEach(member => {
                if(member._roles.indexOf("1026475673621106699") != -1){
                    journalists.push(member.user.id)
                }
            })

            console.log(journalists)

            var idx_arr = [];
            var old_idx;

            if (CACHE["plan"].length != 0){
                old_idx = CACHE["plan"]
                while(idx_arr.length < n){
                    var r = Math.floor(Math.random() * journalists.length);
                    if(idx_arr.indexOf(r) === -1 && !old_idx.includes(r)) idx_arr.push(r);
                }
            }
            else{
                old_idx = CACHE["plan"]
                while(idx_arr.length < n){
                    var r = Math.floor(Math.random() * journalists.length);
                    if(idx_arr.indexOf(r) === -1) idx_arr.push(r);
                }
            }

            console.log(idx_arr)

            //add to cache
            CACHE["plan"] = idx_arr
            let cache_out = JSON.stringify(CACHE)
            fs.writeFileSync(__dirname + "/cache.json", cache_out)

            var final = ""
            idx_arr.forEach(idx => {
                final = final.concat("\n", `<@${journalists[idx]}>`)
            })

            console.log(final)

            let rozpis = new EmbedBuilder()
                .setColor("DarkButNotBlack")
                .setTitle("rozpis na tento měsíc")
                .setDescription("rozpis kdo všechno napíše tento měsíc článek na web")
                .setTimestamp()

            message.channel.send({embeds: [rozpis]})
            message.channel.send(final)
        }
    }
})

client.login(TOKEN)