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
            //Check if message is invoking a command
            if (message.content.substring(0,1) == '~') {
                //Split out arguments into an array
                const args = message.content.slice(message.length).split(' ');
                const command = args.shift().toLowerCase();
                
                //Command to create a new character
                if(command === '~create')
                {
                    if(args.length != 8 && args.length != 0)
                    {
                        message.channel.send("You did not provide any arugments!");
                    }
                    else if(args.length == 0)
                    {
                        message.channel.send("***Command: ~create <name> <class> <health> <str> <dex> <con> <int> <image>***");
                    }
                    else
                    {
                        var tempCharacter = createNewCharacter(message.author, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
                        printCharacter(tempCharacter, message);
                    }  
                }
            }
        }	
});

//Create new character object
function createNewCharacter(auth, n, c, h, str, dex, con, int, img)
{

    var character =  {
       author: auth,
       level: 1,
       class: c,
       name: n,
       healthCurrent: h,
       healthMax: h,
       str: str,
       dex: dex,
       con: con,
       int: int,
       image: img,
       inventory: []
   };

   return character;
}


//Print given character card
function printCharacter(character, message)
{
    const embed = new Discord.RichEmbed()
                  .setTitle("***" + character.name + " - LV: 1 " + character.class + "***")
                  .setAuthor(character.author.username, character.author.avatarURL)
                 .setDescription("**HP " + character.healthCurrent +"/" + character.healthMax + "** ~ AC: 10 ~ Initiate: 1 ~ Speed: 30")
                
                  .setColor(0x215dbc)
                  //.setDescription("This is the main body of text, it can hold 2048 characters.")
                  .setFooter("Archmage Corey has conjured a new hero!", "http://ddragon.leagueoflegends.com/cdn/7.5.1/img/sticker/poro-laugh.png")
                  .setThumbnail(character.image)
                
                  
                  .addField("STR:", character.str, true)
                  .addField("DEX:", character.dex, true)
                  .addField("CON:", character.con, true)
                  .addField("INT:", character.int, true)
                .addField("***--------------INVENTORY--------------***", "```\nSack o' Coin\nGrandas Famous Pie```");
      message.channel.send({embed});   
}

client.login(auth.token);