app.directive('lolMatch', function(){
    return {
        "restrict" : "E",
        "templateUrl" : "lol-match/lol-match-template.html",
        "controller" : "CardButtonHandler",
        "link" : function(scope, element, attrs){
            //console.log(element);
            //element[0].appendChild(btn);       
        }
    };
});


app.controller("CardButtonHandler", ['$scope', 'CONFIG', function($scope, CONFIG){
    $scope.stat_selected = false;

    $scope.time_to_mins = function(value){
        return Math.round(value / 60);
    }
    
    $scope.getRoundData = function(stat, cardIndex){
        var summonerObj = $scope.summonerInfo[$scope.summoner.toLowerCase()];
        
        var myIndex = $scope.gameData.players.indexOf(summonerObj.id);
        var opponentIndex =  (myIndex + 1) % 2;
        var opponentId = $scope.gameData.players[opponentIndex];
        
        var opponentCard = $scope.gameData[opponentId + "_cards"][cardIndex];
        var myCard = $scope.gameData[summonerObj.id + "_cards"][cardIndex];
        
        console.log("MyCard", myCard);
        console.log("OpponentCard: " + opponentId, opponentCard);

        var result = "loss";
                
        if(CONFIG.CARDINFO.gb.indexOf(stat) > -1){
            result = (myCard[stat] > opponentCard[stat]? "win" : "loss");
        }else{
            result = (myCard[stat] < opponentCard[stat]? "win" : "loss");
        }
        
        if(myCard[stat] == opponentCard[stat]){
            result = "draw";
        }
        
        return {
            "id" : summonerObj.id,
            "key" : stat,
            "ci" : cardIndex,
            "result" : result
        };
    }
    
    $scope.stat_clicked = function(stat, cardIndex){
        if($scope.gameState != CONFIG.MY_TURN){
            return;
        }
        console.log("You have selected: ", stat, cardIndex, $scope.gameState);

        //this round.
        var roundData = $scope.getRoundData(stat, cardIndex);
        $scope.gameData.rounds.push(roundData);
        $scope.handleGameDataUpdate();
//        $scope.recent.games.splice(cardIndex, 1);        
    }
}]);
