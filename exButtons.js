const COLOURS = {
    red: 0xff0000,
    green: 0x00ff00,
    blue: 0x0000ff,
    white: 0xffffff
  }
  
  const buttons = [
    { emoji: '1⃣',
      run: (user, message) => {
        let newEmbed = embed
        embed.color = COLOURS.red
        message.edit({ embed: newEmbed })
      }
    }
]
  
  const embed = {
    fields: [
      {
        name: '1',
        value: 'Red'
      }
    ],
    color: COLOURS.white
  }
  
  module.exports = {
    buttons: buttons,
    embed: embed,
    COLOURS: COLOURS
  }