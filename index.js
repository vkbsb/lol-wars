    var app = angular.module("MyTest", ['ngMaterial', 'firebase']);
    
    app.constant("FIREBASE_URL", "https://codepen-public.firebaseio.com/firebase1demo/codepen/");
    app.constant("RIOT_KEY", '4befbf6c-67bf-4d9e-b159-114aed30e108');
    app.constant("RIOT_SUMMONER_URL", "https://euw.api.pvp.net/api/lol/euw/v1.4/summoner");

    app.controller('TestController', ['$scope', '$http', '$firebaseObject', function($scope, $http, $firebaseObject){

    base_path = 'https://euw.api.pvp.net/api/lol/euw/v1.4/'; 
    
    $scope.init = function() {
      
    //initialize the firebase data store.
    $scope.firebase_url = "https://lol-wars.firebaseio.com/";
    // // var lolWarsRef = new Firebase($scope.firebase_url);
    // // $scope.lolWars = $firebaseObject(lolWarsRef);
    // $scope.lolWars = new Firebase($scope.firebase_url);
    
    $scope.key = '4befbf6c-67bf-4d9e-b159-114aed30e108';
    $scope.summonerInfo = "";
    // $scope.summoner = "Summoner Name";
    $scope.fetching = false;
    $scope.forceRefresh = false;
    $scope.recent = {};
    // $scope.champFreq = {};
    // $scope.avgWards = 0;
    $scope.hideConfig = false; 
    $scope.summoner = "GiZmOfOrEvEr";
    };
    
    $scope.init();


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

//    //load the info from localStorage.
//    if(localStorage.hasOwnProperty('summonerInfo')){
//        $scope.summonerInfo = JSON.parse(localStorage["summonerInfo"]);
//        for(var key in $scope.summonerInfo){
//            $scope.summoner = $scope.summonerInfo[key].name;
//        }
//        $scope.recent = JSON.parse(localStorage["recent"]);
//    }

    $scope.fetch_summonerInfo = function(){
     
//     if(localStorage.hasOwnProperty('summonerInfo') && $scope.forceRefresh === false){
//        var savedSummoner = JSON.parse(localStorage["summonerInfo"]);
//        if(savedSummoner.hasOwnProperty($scope.summoner.toLowerCase())){
//            $scope.summonerInfo = savedSummoner;
//            $scope.summoner = savedSummoner.name;
//        }
//     }
     $scope.fetching = true;


     $http.get(base_path + 'summoner/by-name/' + $scope.summoner + '?api_key=' + $scope.key).success(function(data) {
         $scope.fetching = false; 
         $scope.true = 0;
         $scope.summonerInfo = data;
         localStorage["summonerInfo"] =  JSON.stringify(data); 
         
        //https://euw.api.pvp.net/api/lol/euw/v1.3/game/by-summoner/19248048/recent?api_key=4befbf6c-67bf-4d9e-b159-114aed30e108
        $http.get("https://euw.api.pvp.net/api/lol/euw/v1.3/game/by-summoner/" + 
            data[$scope.summoner.toLowerCase()].id + "/recent?api_key=" + $scope.key).success(function(recent){
                localStorage["recent"] = JSON.stringify(recent);
                $scope.recent = recent;
            });
     });
    

    };

}]);

