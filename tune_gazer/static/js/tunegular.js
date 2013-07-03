tunely_app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('<<');
  $interpolateProvider.endSymbol('>>');
});

function tune_player($scope, init_constants) {
    $scope.player =
        {
            client_id: '6dc6a4ae9270aa4e4af5b07e58efa556',
            tracklist: '', // song-list array
            volume: 100, // volume controlled by user
            sc: '', // Sound_cloud controller.
            slug: '',
            node: '',
            station: '',
            playlist_id: '',
            first_start: false,
            checker: '',
            volumeHeight: 62,
            debug: false
        };
    $scope.stations = init_constants['radio_stations'];
//    console.log(init_constants['radio_stations']);

}