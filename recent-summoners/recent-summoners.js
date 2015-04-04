app.directive("recentSummoners", function(){
  return {
    'restrict' : 'E',
    "templateUrl" : "recent-summoners/recent-summoners-template.html",
    'controller' : 'SummonerList'
  };
});


app.controller("SummonerList", ['$scope', '$http', '$firebaseObject', '$firebaseArray', function($scope, $http, $firebaseObject, $firebaseArray){
  
  //we want to get the summoner info whenever the recent variable updates.
  $scope.$watch("recent", function(){    
    if(typeof($scope.recent.games) == "undefined"){
        return;
    }
    var summonerList = "";
    for(var i = 0; i < $scope.recent.games[0].fellowPlayers.length; i++){
      // console.log($scope.recent.games[0].fellowPlayers[i]);
      var fellowPlayer = $scope.recent.games[0].fellowPlayers[i];
       summonerList += fellowPlayer.summonerId;
      if(i < $scope.recent.games[0].fellowPlayers.length-1){
        summonerList += ",";
      }
    }
    
    // https://euw.api.pvp.net/api/lol/euw/v1.4/summoner/19248048,40267431,44117932,67655352?api_key=4befbf6c-67bf-4d9e-b159-114aed30e108
    var url = "https://euw.api.pvp.net/api/lol/euw/v1.4/summoner/" + summonerList + "?api_key=" + $scope.key;
    $http.get(url).success(function(data){
      for(var key in data){
        data[key].online = false;
      }
      $scope.recentSummoners = data;
      
      //register the firebase data into the $scope variable so we can modify it on the fly.
      for(var key in $scope.recentSummoners){
        var ref1 = new Firebase($scope.firebase_url + key + "/pulse");
        $scope.recentSummoners[key].pulse = $firebaseObject(ref1);
      }
    });
    
  });

    //function to enable / disable the buttons on the opponents.
    $scope.isOffline = function(key){
      if( $scope.recentSummoners[key].pulse.hasOwnProperty("ts")){
        //console.log($scope.recentSummoners[key].pulse, "Diff: " + Firebase.ServerValue.TIMESTAMP);
       var tdiff = $scope.recentSummoners[key].pulse.ts-$scope.pulse_ts;
       if(isNaN(tdiff) || Math.abs(tdiff) > 20000){
         return true;
       }
       return false;
      }else{
        return true;
      }
    };
    
    //function for handling the case where an opponent is selected.
    $scope.opponentSelected = function(key){
        var summonerObj = $scope.summonerInfo[$scope.summoner.toLowerCase()];
        var game_ts = new Date().getTime();
        var ref = new Firebase($scope.firebase_url + summonerObj.id + "/games/"+ game_ts);
        
        var obj = $firebaseObject(ref);        
        //add additional stuff to the object so it can be ready to access data.        
        obj.particpents = [summonerObj.id, parseInt(key)];
        obj.agreed = 1;
        obj.rounds = [];
        obj.$save();
        //save the gameData Object ref from FireBase.
        $scope.gameData = obj;
        
        //enable three way binding with it.
        obj.$bindTo($scope, "gameData");
        
        
        //send message to the opponent to start game.
        var reqRef = new Firebase($scope.firebase_url + key + "/requests" );
        var reqsObj = $firebaseArray(reqRef);
        reqsObj.$add({
            "type" : "game_req",
            "gameTag" : game_ts,
            "summoner" : summonerObj
        });
        
        //hide the initial screen and start showing the cards.
//        $scope.hideConfig = true;
        $scope.gameState = 0;
    };
    
    $scope.sendPulse = function(){
        if(typeof($scope.summoner) == "undefined"){
          return;
        }
        
        if($scope.summonerInfo.hasOwnProperty($scope.summoner.toLowerCase()) === false){
          return;
        }
        var summonerObj = $scope.summonerInfo[$scope.summoner.toLowerCase()];
        
        var ref = new Firebase($scope.firebase_url + summonerObj.id + "/pulse");
        var obj = $firebaseObject(ref);
        obj.ts = Firebase.ServerValue.TIMESTAMP;
        
        obj.$save().then(function(ref){
          // console.log("SaveTs: "+ obj.ts);
          $scope.pulse_ts = obj.ts;
        });
    };
     
    window.setInterval($scope.sendPulse, 10000);
}]
);