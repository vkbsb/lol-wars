# lol-wars
Realtime Card game based on your previous 10 games in League of Legends.


The objective is to create a fun little game to play among your friends or
people whom you have played with in the recent past.

#how to play
You enter your summoner name and click on "fetch list" this gets the last 10 games you have played in LoL. The list of all players from your last match are shown. If any of those summoners is logged into our game just like you did,
their name will become clickable and you can initiate a game with them. 

###Note:
* User authentication is currently not implemented
* Please make sure you are using your summoner name only when playing.
* Currently EUW is the only region tha's currently supported.

When an opponent is selected, a game request is sent to the summoner. The game starts when both the summoners have fetched the user list and are on the opponent selection screen. If the opponent selected is in another game, the information is shown to you. 

##The Card
Each card corresponds to one of the last 10 matches you have played in League Of Legends. The stats of the card are your champion stats in that particular game. 
###The following are the stats on each card
* Game Result (Victoery is better)
* Champion Kills (bigger is better)
* Champion Deaths (lower is better) 
* Champion kill Assists (bigger is better)
* Towers Killed (bigger is better)
* Duration Of match (bigger is better)

##The Game
Since the cards are made of last 10 games, we have 10 rounds where each player gets to choose a stat on the card in alternate rounds. If the players' stat is better then the opponents' stat the player wins the round else the opponent wins the round. After all the 10 rounds, the player with higher number of round victories wins the game.

###Note:
* Player disconnects/timeouts during game are not handled.
