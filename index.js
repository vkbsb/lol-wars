    var app = angular.module("MyTest", ['ngMaterial', 'firebase']);
    
    app.constant("FIREBASE_URL", "https://codepen-public.firebaseio.com/firebase1demo/codepen/");
    app.constant("RIOT_KEY", '4befbf6c-67bf-4d9e-b159-114aed30e108');
    app.constant("RIOT_SUMMONER_URL", "https://euw.api.pvp.net/api/lol/euw/v1.4/summoner");

app.controller('TestController', ['$scope', '$http', '$firebaseArray', '$mdDialog', '$firebaseObject',
function($scope, $http, $firebaseArray, $mdDialog, $firebaseObject ){

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
    $scope.gameData = {};
    // $scope.champFreq = {};
    // $scope.avgWards = 0;
//    $scope.hideConfig = false; 
    $scope.gameState = -1;
    $scope.isRequestShown = false;
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
         var summonerObj = data[$scope.summoner.toLowerCase()];
         var summonerId =  data[$scope.summoner.toLowerCase()].id;
         var ref = new Firebase($scope.firebase_url + summonerId +  "/requests");
         var obj = $firebaseArray(ref);
         
         obj.$loaded().then(function(){
             //clear the existing records.
             for(var i = 0; i < $scope.requests.length; i++){
                 $scope.requests.$remove(0);
             }
             
             //whenever there is a change in requests array, we want 
             //to show the dialog box for 
            $scope.$watchCollection("requests", 
            function(newvalue, oldvalue){
                console.log("Requests Changed: ", $scope.requests);                
                var len = newvalue.length;
                if(len > 0){
                    $scope.myRequest = newvalue[len-1];
                    //we want to show the challenge request allert only if the game
                    //state is set to -1;
                    if(newvalue[len-1].type == "game_req" && $scope.state == -1){
                        $scope.showRequest(newvalue[len-1]);
                        
                        //Initialize the gameData object with the corresponding game object.
                        var refUrl = $scope.firebase_url + 
                                newvalue[len-1].summoner.id + 
                                "/games/"+ newvalue[len-1].gameTag;                        
                        var gDataRef = new Firebase(refUrl);
                        var gDataObj = $firebaseObject(gDataRef);
                        $scope.gameData = gDataObj;
                        gDataObj.$bindTo($scope, "gameData");
                        
                        //$scope.gameState = 1; //starting the game.
                    }else{
                        //post back a response to the sender that you are not available for game.
                        var reqRef = new Firebase($scope.firebase_url + newvalue[len-1].summoner.id + "/requests" );
                        var reqsObj = $firebaseArray(reqRef);
                        reqsObj.$add({
                            "type" : "game_rejected",
                            "summoner" : summonerObj
                        });
                    }
                    
                    $scope.requests.$remove(len-1);                    
                }                
            });             
         });
         
         $scope.requests = obj;         
         
        //https://euw.api.pvp.net/api/lol/euw/v1.3/game/by-summoner/19248048/recent?api_key=4befbf6c-67bf-4d9e-b159-114aed30e108
        $http.get("https://euw.api.pvp.net/api/lol/euw/v1.3/game/by-summoner/" + 
            summonerId + "/recent?api_key=" + $scope.key).success(function(recent){
                localStorage["recent"] = JSON.stringify(recent);
                $scope.recent = recent;
            });
     });
    

    };
        
    
    $scope.showRequest = function(){
        // Appending dialog to document.body to cover sidenav in docs app
        var request_obj = $scope.myRequest;
        $scope.myRequest = "";
        
        var confirm = $mdDialog.alert()
//      .parent(angular.element(document.body))
        .title('Like to play a game?')
        .content(request_obj.summoner.name + ' would like to play lol-wars with you.')
        .ariaLabel('Lucky day')
        .ok("Let's do it");
        $mdDialog.show(confirm);     
    };

}]);

