const Discord = require("discord.js");
const RC = require('reaction-core');
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const handler = new RC.Handler();
const client = new Discord.Client();

let rawdata = fs.readFileSync('auth.json');
let auth = JSON.parse(rawdata);

var url = "mongodb://192.168.1.25:27017/";

var characterFetcher;

client.on('messageReactionAdd', (messageReaction, user) => handler.handle(messageReaction, user))

const example = require('./exButtons');
let changeColor = new RC.Menu(example.embed, example.buttons);
handler.addMenus(changeColor);

//On Ready!
client.on("ready", () => {
	console.log("I am ready!");
    client.user.setPresence({ status: 'online', game: { name: 'Dugneons & Dragons' } });

});

//On Message!
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
                    //printCharacter(tempCharacter, message);
                }  
            }
            //Show Character
            else if(command === '~show')
            {
                if(args.length != 1 && args.length != 0)
                {
                    message.channel.send("You did not provide any arugments!");
                }
                else if(args.length == 0)
                {
                    message.channel.send("***Command: ~show <character name>***");
                }
                else
                {
                    fetchCharacter(message.author.id, args[0], function printStuff(){printCharacter(characterFetcher, message)});
                }
            }
            //Menu Test
            else if(command === '~menu')
            {
                message.channel.sendMenu(changeColor);
            }
        }
    }	
});



//Create new character object
function createNewCharacter(auth, n, c, h, str, dex, con, int, img)
{

    var character =  {
       authorUserName: auth.username,
       authorAvatar: auth.avatarURL,
       authorID: auth.id,
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

   saveCharacter(character);
   return character;
}

//Save Character info to mongodb
function saveCharacter(character)
{
    MongoClient.connect(url, {useNewUrlParser: true }, function(err, db) {
        if(err) throw err;
        var dbo = db.db("RPGBot");
        console.log(character.healthCurrent);
        var myobj = {
            authorUsername: character.authorUserName, 
            authorAvatar: character.authorAvatar,
            authorID: character.authorID,
            level: character.level, 
            class: character.class, 
            name: character.name, 
            currentHP: character.healthCurrent, 
            maxHP: character.healthMax,
            strength: character.str,
            dexterity: character.dex,
            constitution: character.con,
            intelligence: character.int,
            image: character.image 
        };
        dbo.collection("characters").insertOne(myobj, function(err, res){
            if(err) throw err;
            console.log("1 document inserted");
            db.close();
        });  
    });
}


function fetchCharacter(ID, characterName, callback)
{

    MongoClient.connect(url, {useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("RPGBot");
        var query = { authorID: ID, name: characterName};
        dbo.collection("characters").find(query).toArray(function(err, result) {
            if (err) throw err;
            characterFetcher =  result;
            callback();
            db.close();
          });
    });
    
}




//Print given character card
function printCharacter(characterData, message)
{
    character = characterData[0];
    if(typeof character == "undefined") return null;

    const embed = new Discord.RichEmbed()
                  .setTitle("***" + character.name + " - LV: 1 " + character.class + "***")
                  .setAuthor(character.authorUserName, character.authorAvatar)
                 .setDescription("**HP " + character.currentHP +"/" + character.maxHP + "** ~ AC: 10 ~ Initiate: 1 ~ Speed: 30")
                
                  .setColor(0x215dbc)
                  //.setDescription("This is the main body of text, it can hold 2048 characters.")
                  .setFooter("Archmage Corey has conjured a new hero!", "http://ddragon.leagueoflegends.com/cdn/7.5.1/img/sticker/poro-laugh.png")
                  .setThumbnail(character.image)
                
                  
                  .addField("STR:", character.strength, true)
                  .addField("DEX:", character.dexterity, true)
                  .addField("CON:", character.constitution, true)
                  .addField("INT:", character.intelligence, true)
                .addField("***--------------INVENTORY--------------***", "```\nSack o' Coin\nGrandas Famous Pie```");
      message.channel.send({embed});
}

client.login(auth.token);