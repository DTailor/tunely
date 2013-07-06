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


//  INITIALIZE SC

    $scope.sc_init = function () {
        $scope.player.sc = SC.initialize({
            client_id: $scope.player.client_id
        });
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
        $('.panel').removeClass('active');
        $('.wrapper-dropdown-2').toggleClass('active');
        $('.audioplayer-stations').toggleClass('hover');
    };

//  SET NEXT TRACK

    $scope.set_tracks = function () {

        if ($scope.player.next_track) {
            console.log('next song to be played:');
            $scope.player.current_track = $scope.player.next_track;
            console.log($scope.player.current_track);
            $scope.player.next_track = $scope.player.tracklist[ $scope.player.tracklist.length - 1];
            $scope.player.tracklist.pop($scope.player.tracklist[$scope.player.tracklist.length - 1]);
        } else {
            $scope.player.current_track = $scope.player.tracklist[ $scope.player.tracklist.length - 1];
            $scope.player.tracklist.pop($scope.player.tracklist[$scope.player.tracklist.length - 1]);
            $scope.player.next_track = $scope.player.tracklist[ $scope.player.tracklist.length - 1];
            $scope.player.tracklist.pop($scope.player.tracklist[$scope.player.tracklist.length - 1]);
            console.log($scope.player.current_track);
        }
    };

//    STREAM INITIALIZATION

    $scope.init_player = function () {
//        document.title = $scope.current_track.title;
        console.log('init player');
        SC.stream('/tracks/' + $scope.player.current_track.id, {
                onload: function (status) {
                },
                onfinish: function () {
                    console.log('finished_track');
                    $scope.set_tracks();
                    $scope.init_player();
                },
                onready: function (b) {
                    console.log(b);
                }
            },

            function (b) {
                $scope.stream = b;
                if ($scope.player.mute) {
                    $scope.stream.setVolume(0);
                }
                $scope.stream.play();
                $scope.$apply();
//                }
            }

        );
    };


//  PLAY/PAUSE PLAYER

    $scope.play_pause_player = function () {

        if ($scope.player.playing) {
            $scope.stream.pause();
            console.log('paused')
        }
        else {
            if ($scope.player.first_start) {
                $scope.set_tracks();
                $scope.player.first_start = false;
                $scope.init_player();
                console.log('start song');
                $('.panel').toggleClass('active');
            } else {
                $scope.stream.play();
                console.log('resume')
            }
        }
        $scope.player.playing = !$scope.player.playing;

    };

//  VIEW TRACK INFO

    $scope.view_track_info = function () {
        if (!$scope.player.first_start) {
            $('.panel').toggleClass('active');
            $('.wrapper-dropdown-2').removeClass('active');
            $('.audioplayer-stations').removeClass('hover');
        }
    };


//    SELECT STATION

    $scope.select_station = function (station) {
        $scope.player.sc.streamStopAll();
        $scope.sc_init();
        $scope.player.station = station.name;
        $scope.player.playlist_id = station.soundcloud_id;
        $scope.player.slug = station.slug;
        $scope.get_tracklist($scope.player.playlist_id, $scope.player.client_id);
        $scope.player.next_track = false;
        $scope.set_tracks();
        $('.wrapper-dropdown-2').removeClass('active');
        $('.audioplayer-stations').removeClass('hover');
        $scope.init_player();
        if ($scope.player.first_start) {
            $('.panel').toggleClass('active');
            $scope.player.first_start = false;
        }
        $scope.player.playing = true;

    };

// SKIP TRACK

    $scope.skip_track = function () {
        $scope.player.sc.streamStopAll();
        $scope.sc_init();
        $scope.set_tracks();
        $scope.init_player();
    };


//    MUTE_UNMUTE SOUND
    $scope.mute_unmute = function () {
        console.log('mute_unmute');
        if ($scope.player.mute) {
            $scope.stream.setVolume($scope.player.volume);
            $scope.player.mute = false;
        } else {
            $scope.stream.setVolume(0);
            $scope.player.mute = true;

        }
    };

//    VOLUME BAR

    $scope.volume_bar = function ($event) {

        var clickY = $('.player-volume-bar').height() - ($event.pageY - $('.player-volume-bar').offset().top);
        $scope.player.volume = Math.round(( clickY / $scope.player.volumeHeight )*100);
        if ($scope.player.volume > 100) {
            $scope.player.volume = 100;
        }
        else if ($scope.player.volume < 0) {
            $scope.player.volume = 0;
        }
        $('.player-volume-bar').css({'height': $scope.player.volume + '%'});
        $scope.stream.setVolume($scope.player.volume);

    };
//    VOLUME ADJUSTMENT

    $scope.adjust_handler = function ($event) {
        if (!$scope.player.first_start) {
            if ($event.target.className === "audioplayer-volume-button" || $event.target.className === "volume-icon") {
                $scope.mute_unmute();
            }
            else{$scope.volume_bar($event);}
        }
    };


    $scope.player = init_constants['Player'];
    $scope.stations = init_constants['radio_stations'];
    $scope.stream = false;
    $scope.sc_init();
    $scope.get_tracklist($scope.player.playlist_id, $scope.player.client_id);


}
