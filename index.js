    var app = angular.module("MyTest", []);

    app.controller('TestController', ['$scope', '$http', function($scope, $http){

    $scope.key = '4befbf6c-67bf-4d9e-b159-114aed30e108';
    base_path = 'https://euw.api.pvp.net/api/lol/euw/v1.4/'; 
    $scope.summonerInfo = "";
    $scope.summoner = "guest";
    $scope.fetching = false;
    $scope.forceRefresh = false;
    $scope.recent = {};
    $scope.champFreq = {};
    $scope.avgWards = 0;

    $scope.$watch(function(){return $scope.recent}, function(recent, oldRecent) {
                var champFreq = {};
                var totalWardsPlaced = 0;
                for(var i = 0; i < recent.games.length; i++){
                    var game = recent.games[i];
                    var champId = recent.games[i].championId;

                    if(champFreq.hasOwnProperty(champId)){
                        champFreq[champId].used += 1;
                        if(game.stats.hasOwnProperty("championsKilled")){
                            champFreq[champId].k += game.stats.championsKilled;
                        }

                        if(game.stats.hasOwnProperty("numDeaths")){
                            champFreq[champId].d += game.stats.numDeaths;
                        }

                        if(game.stats.hasOwnProperty("assists")){
                            champFreq[champId].a += game.stats.assists;
                        }
                    }else{
                        champFreq[champId] = { "used": 1, "wins": 0 };

                        if(game.stats.hasOwnProperty("championsKilled")){
                            champFreq[champId].k = game.stats.championsKilled;
                        }else{
                            champFreq[champId].k = 0;
                        }

                        if(game.stats.hasOwnProperty("numDeaths")){
                            champFreq[champId].d = game.stats.numDeaths;
                        }else{
                            champFreq[champId].d = 0;
                        }

                        if(game.stats.hasOwnProperty("assists")){
                            champFreq[champId].a = game.stats.assists;
                        }else{
                            champFreq[champId].a = 0;
                        }
                    }

                    if(recent.games[i].stats.win == true){
                        champFreq[champId].wins += 1;
                    }

                    if(game.stats.hasOwnProperty("wardPlaced")){
                        totalWardsPlaced += game.stats.wardPlaced;
                    }
               }
               for(champ in champFreq){
                champFreq[champ].k = Math.round(champFreq[champ].k / champFreq[champ].used);
                champFreq[champ].d = Math.round(champFreq[champ].d / champFreq[champ].used);
                champFreq[champ].a = Math.round(champFreq[champ].a / champFreq[champ].used);
               }
               $scope.avgWards = Math.round(totalWardsPlaced / recent.games.length);
               $scope.champFreq = champFreq;
    });

    //https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion?champData=all&api_key=4befbf6c-67bf-4d9e-b159-114aed30e108
    //get the champion data
    if(localStorage.hasOwnProperty("champData")){
        $scope.champData = JSON.parse(localStorage["champData"]);
    }else{
        $http.get("https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion?champData=all&api_key=" + $scope.key).success(function(data){
            localStorage["champData"] = JSON.stringify(data);
            $scope.champData = data;
        });
    }

    //load the info from localStorage.
    if(localStorage.hasOwnProperty('summonerInfo')){
        $scope.summonerInfo = JSON.parse(localStorage["summonerInfo"]);
        for(var key in $scope.summonerInfo){
            $scope.summoner = $scope.summonerInfo[key].name; 
        }
        $scope.recent = JSON.parse(localStorage["recent"]);
    }

    $scope.fetch_summonerInfo = function(){
     
     if(localStorage.hasOwnProperty('summonerInfo') && $scope.forceRefresh == false){
        var savedSummoner = JSON.parse(localStorage["summonerInfo"]);
        if(savedSummoner.hasOwnProperty($scope.summoner.toLowerCase())){
            $scope.summonerInfo = savedSummoner;
            $scope.summoner = savedSummoner.name;
        }
     }
     $scope.fetching = true;


     $http.get(base_path + 'summoner/by-name/' + $scope.summoner + '?api_key=' + $scope.key).success(function(data) {
         $scope.fetching = false; 
         $scope.summonerInfo = data;
         localStorage["summonerInfo"] =  JSON.stringify(data); 
         
        //https://euw.api.pvp.net/api/lol/euw/v1.3/game/by-summoner/19248048/recent?api_key=4befbf6c-67bf-4d9e-b159-114aed30e108
        $http.get("https://euw.api.pvp.net/api/lol/euw/v1.3/game/by-summoner/" + 
            data[$scope.summoner.toLowerCase()].id + "/recent?api_key=" + $scope.key).success(function(recent){
                localStorage["recent"] = JSON.stringify(recent);
                $scope.recent = recent;
            });
     });
    

    }

}]);

