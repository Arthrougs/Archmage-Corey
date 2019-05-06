const Discord = require("discord.js");
const fs = require('fs');
const client = new Discord.Client();

let rawdata = fs.readFileSync('auth.json');
let auth = JSON.parse(rawdata);
var messages = []; 


client.on("ready", () => {
	console.log("I am ready!");
    client.user.setPresence({ status: 'online', game: { name: 'Dugneons & Dragons' } });

});



client.on("message", (message) => {

        //Look at all messages except ones that come from the bot itself 
    if(message.author.username != "Archmage Corey")
        { 
            if (message.content.substring(0,1) == '~') {
                
                
                const embed = new Discord.RichEmbed()
                  .setTitle("\t**Oxleav - LV: 2 Druid**")
                  .setAuthor(message.author.username, message.author.avatarURL)
                 .setDescription("**HP 4/10** ~ AC: 10 ~ Initiate: 1 ~ Speed: 30")
                  /*
                   * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
                   */
                  .setColor(0x00AE86)
                  //.setDescription("This is the main body of text, it can hold 2048 characters.")
                  .setFooter("This is the footer text, it can hold 2048 characters", "http://i.imgur.com/w1vhFSR.png")
                  .setThumbnail("https://i.imgur.com/8Xc3n0E.png")
                  /*
                   * Takes a Date object, defaults to current date.
                   */
                  .setTimestamp()
                  .addField("STR:", "10", true)
                  .addField("DEX:", "15", true)
                  .addField("CON:", "10", true)
                  .addField("INT:", "10", true)
                  .addField("WIS:", "10", true)
                  .addField("CHA:", "10", true)
                .addField("***--------------INVENTORY--------------***", "```\nSack o' Coin\nGrandas Famous Pie```");
      message.channel.send({embed});   

                /*message.channel.send({embed: {
                        color: 0xff0000,
                        description: "A simple embed!"
                    }});*/

            }
        }
	
});




function sendMessage(m)
{
	if(!(messages.length <= 0))
    {
        var rand = Math.floor((Math.random() * messages.length));
        m.channel.send(messages[rand]);
        //console.log(rand);
        messages = [];
    }
}


client.login(auth.token);