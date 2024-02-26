
# DJ Bot for Minecraft

A Minecraft bot that can convert and play .midi files using noteblocks. It also features ChatGPT integration.


## Acknowledgements

 - [The original notebot repo by MorganAnkan](https://github.com/MorganAnkan/mineflayer-notebot)

## Usage/Examples
The default command prefix is `:`

Some important commands:
- `:help <optional: command>` If no command is given lists all commands. If a command is given then it will give info about that command.
- `:botgpt <prompt>` feeds the prompt into ChatGPT
- `:style <style-name>` Changes how the botgpt command will respond
- `:convert <File path>` With no args, converts all midi files in songs directory, with args converts provided song.
- `:gimmethedrugs` Makes the bot drop it's whole inventory
- `:say <message>` Bot says whatever it is prompted, helpful if it needs to execute commands
- `:silent-kill` stops the bot program without any exit message
- `:tpatome` Used for servers with the /tpa <username> command
- `:nowplaying` Bot chats the current playing song
- `:play <song>` Plays song specified, <song> must match song name (excluding .txt)
- `:playrandom` Plays a random song in the song directory
- `:songinfo <song>` Gives info about <song>
- `:songs` Lists all available songs WARNING: If you have a long list of songs, it may cause the bot to get kicked from the server 
- `:stop` Stops the current playing song

There are more commands included but they are either unimportant or don't fully work.


## Contributing

If you really feel like helping this garbage fire of a bot, held together by hopes and dreams feel free!

If you add a command and it adds new features, put it in a /commands/ subfolder with your name. If the command expands the current functions put it in an appropriate subfolder.

## Current TODO

- Make the bot pvp capable
- Add an easier way to learn bot functionality in-game
- Better song listing to not get kicked
- More modular way to get server info (IP / port)

## License

[MIT](https://choosealicense.com/licenses/mit/)

