tunely_app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('<<');
  $interpolateProvider.endSymbol('>>');
});

function tune_player($scope, init_constants) {
//    Initializing
    $scope.player = init_constants['Player'];
    $scope.stations = init_constants['radio_stations'];

    $scope.player.sc =  SC.initialize({
        client_id: $scope.player.client_id
    });


    $scope.openStations = function(){
        $('.wrapper-dropdown-2').toggleClass('active');
        $('.audioplayer-stations').toggleClass('hover');
    }


}

tunely_app.filter('shuffle', function() {
    var shuffledArr = [],
        shuffledLength = 0;
    return function(arr) {
        var o = arr.slice(0, arr.length);
        if (shuffledLength == arr.length) return shuffledArr;
        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        shuffledArr = o;
        shuffledLength = o.length;
        return o;
    };
});