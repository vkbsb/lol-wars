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


app.controller("CardButtonHandler", ['$scope', function($scope){
    $scope.stat_selected = false;

    $scope.stat_clicked = function(value, cardIndex){
        //$scope.stat_selected = true;
        $scope.recent.games.splice(cardIndex, 1);
    }
}]);