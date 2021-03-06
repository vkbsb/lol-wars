# lol-wars
Realtime Card game based on your previous 10 games in League of Legends. 

This helps the Summoners reflect / recollect the games that they have played recently. We believe this game will help summoners track their skill and see their progress compared to their friends.

#how to play
You enter your summoner name and click on "fetch list" this gets the last 10 games you have played in LoL. The list of all players from your last match are shown. If any of those summoners is logged into our game just like you did,
their name will become clickable and you can initiate a game with them. 

###Note:
* User authentication is currently not implemented
* Please make sure you are using your summoner name only when playing.
* Currently EUW/NA are the only regions that are currently supported.

When an opponent is selected, a game request is sent to the summoner. The game starts when both the summoners have fetched the user list and are on the opponent selection screen. If the opponent selected is in another game, the information is shown to you. 

##The Card
Each card corresponds to one of the last 10 matches you have played in League Of Legends. The stats of the card are your champion stats in that particular game. 
###The following are the stats on each card
* Game Result (Victory is better)
* Champion Kills (higher is better)
* Champion Deaths (lower is better) 
* Champion kill Assists (bigger is better)
* Towers Killed (higher is better)
* Duration Of match (higher is better)

##The Game
Since the cards are made of last 10 games in random order, we have 10 rounds where each player gets to choose a stat on the card in alternate rounds. If the players' stat is better than the opponents' stat the player wins the round else the opponent wins the round. After all the 10 rounds, the player with higher number of round victories wins the game.

You can play the game now: [Play Now](https://lol-wars.firebaseapp.com/)

Watch the Gameplay Video: [Watch Now](https://youtu.be/AiOPGpqcuwc)

###Note:
* Player disconnects/timeouts during game are not handled.
* In future we want to separate the cards based on the mode played.

#The Target
We would like to add a bunch of features like challenging friends, leaderboards and ranked games etc. Here is a wireframe that we made demonstrating that vision:
[LoL-Wars Vision](https://github.com/vkbsb/lol-wars/raw/master/docs/lol-wars.swf)

#Security
The current implementation is a proof of concept and assumes that there is no malicious behavior from the users' part. For starters we dont' have login authentication for using the summoner names. If a summoner name is already in use, if somebody else starts using the same summoner name for playing the game, the game will behave in unexpected manner. Secondly we are using firebase store without any authentication which leads to possibility that users' can manipulate games if they access/modify the game's data store.
