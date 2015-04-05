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
    
    $scope.stat_clicked = function(value, cardIndex){
        if($scope.gameState != CONFIG.MY_TURN){
            return;
        }
        console.log("You have selected: ", value, cardIndex);
        //set the game state == 3 We are waiting for the result of
        //this round.
        $scope.gameState == CONFIG.ROUND_RESULT;
//        $scope.recent.games.splice(cardIndex, 1);        
    }
}]);
