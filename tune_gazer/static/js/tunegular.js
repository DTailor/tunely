tunely_app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('<<');
    $interpolateProvider.endSymbol('>>');
});

function tune_player($scope, init_constants) {


//    FUNCTIONS  AND HELPERS

//    TRACKLIST SUFFLER
    var shuffle_tracks = function (o) { //v1.0
        for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };


//    TRACKLIST FETCHER
    $scope.get_tracklist = function (playlist_id, client_id) {
        var link = "http://api.soundcloud.com/playlists/" + playlist_id + ".json?client_id=" + client_id;
        var tracklist = [];
        $.ajax({
            async: false,
            type: 'GET',
            url: link,
            success: function (data) {
                if (typeof(data) === 'string') {
                    data = jQuery.parseJSON(data);
                }
                for (var i = 0; i < data['track_count']; i++) {
                    tracklist.push(data['tracks'][i]);
                }
            }
        });
        $scope.player.tracklist = shuffle_tracks(tracklist);
    };

//    STATIONS TOGGLER
    $scope.open_stations = function () {
        $('.wrapper-dropdown-2').toggleClass('active');
        $('.audioplayer-stations').toggleClass('hover');
    };

//    SHARE BUTTONS

    $scope.set_station_shares = function () {
        var station_link = 'http://tunely.co/' + $scope.player.slug;

        var fb_link = "http://www.facebook.com/sharer.php?u=" + station_link;
        $('#fb_station_share').attr('href', fb_link);

        var tw_text = 'Listen to ' + $scope.player.station + ' station @tunelyCo ';
        var tw_link = "http://twitter.com/share?text=" + tw_text + "&url=" + station_link;
        $('#tw_station_share').attr('href', tw_link);

        $('#social_graph_title').attr('content', $scope.player.station);
        $('#social_graph_link').attr('content', station_link);
    };

//  SET NEXT TRACK

    $scope.set_tracks = function () {

        if ($scope.player.next_track) {
            $scope.player.current_track = $scope.plater.next_track;
            $scope.player.next_track = $scope.player.tracklist[ $scope.player.tracklist.length - 1];
            $scope.player.tracklist.pop($scope.player.tracklist[$scope.player.tracklist.length - 1]);
        } else {
            $scope.player.current_track = $scope.player.tracklist[ $scope.player.tracklist.length - 1];
            $scope.player.tracklist.pop($scope.player.tracklist[$scope.player.tracklist.length - 1]);
            $scope.player.next_track = $scope.player.tracklist[ $scope.player.tracklist.length - 1];
            $scope.player.tracklist.pop($scope.player.tracklist[$scope.player.tracklist.length - 1]);
        }
    };

//    STREAM INITIALIZATION

    $scope.init_player = function(){
//        document.title = $scope.current_track.title;

        SC.stream('/tracks/'+$scope.player.current_track.id, {
                onplay: function () {

                },
                onload: function (status) {
                    //  Set the next track as current track
//                    setNextTrack();
//                    if (!status) {
//                        resetPlayerBar();
//                        initPlayer();
//                    }
                },
                onfinish: function () {
//                    resetPlayerBar();
                    $scope.set_tracks();
                    $scope.init_player();
                },
                onready: function (b) {
                    console.log(b);
                }
            },

            function (b) {
                $scope.stream = b;
                $scope.stream.play();
//                playerHandler(b);
//                if (!Player.first_start) {
//                    b.play();
//                    window.stream.setVolume(Player.volume);
//                }
            }

        );
    };


//  PLAY/PAUSE PLAYER

    $scope.play_pause_player = function () {

        $scope.player.playing = !$scope.player.playing;
        if ($scope.player.first_start) {
            $scope.set_tracks();
            $scope.player.first_start = false;
            $scope.init_player();
        }

    };


    $scope.player = init_constants['Player'];
    $scope.stations = init_constants['radio_stations'];
    $scope.stream = false;
    //    Initializing the soundcloud streamer
    $scope.player.sc = SC.initialize({
        client_id: $scope.player.client_id
    });
    $scope.get_tracklist($scope.player.playlist_id, $scope.player.client_id);
    $scope.set_station_shares();


}


//
//tunely_app.filter('shuffle', function () {
//    var shuffledArr = [],
//        shuffledLength = 0;
//    return function (arr) {
//        var o = arr.slice(0, arr.length);
//        if (shuffledLength == arr.length) return shuffledArr;
//        for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
//        shuffledArr = o;
//        shuffledLength = o.length;
//        return o;
//    };
//});