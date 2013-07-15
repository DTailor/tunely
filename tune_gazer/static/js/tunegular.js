tunely_app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('<<');
    $interpolateProvider.endSymbol('>>');
});

tunely_app
    .config(function ($httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });


function tune_player($scope, $http, init_constants) {



//    TRACKLIST SUFFLER
    var randomize = function (o) { //v1.0
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
        $http({method: 'GET', url: link}).
            success(function (data, status, headers, config) {
                if (typeof(data) === 'string') {
                    data = jQuery.parseJSON(data);
                }
                for (var i = 0; i < data['track_count']; i++) {
                    tracklist.push(data['tracks'][i]);
                }
                $scope.player.tracklist = randomize(tracklist);
                $scope.tracklist_ready = true;
            }).
            error(function (data, status, headers, config) {
                // TODO: Implement some error handling
            });

    };

//    STATIONS TOGGLER
    $scope.open_stations = function () {
        $scope.player.playlist_open = !$scope.player.playlist_open;
        $scope.player.controls_open = false;

    };

//  SET NEXT TRACK

    $scope.set_tracks = function () {

        if ($scope.player.next_track) {
            $scope.player.current_track = $scope.player.next_track;
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

    $scope.init_player = function () {
        SC.stream('/tracks/' + $scope.player.current_track.id, {
                onload: function (status) {
                },
                onfinish: function () {
                    $scope.set_tracks();
                    $scope.init_player();
                },
                onready: function (b) {
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
        if ($scope.tracklist_ready) {

            if ($scope.player.playing) {
                $scope.stream.pause();
            }
            else {
                if ($scope.player.first_start) {
                    $scope.set_tracks();
                    $scope.player.first_start = false;
                    $scope.init_player();
                    $scope.player.controls_open = !$scope.player.controls_open;
                    $scope.player.playlist_open = false;
                } else {
                    $scope.stream.play();
                }
            }
            $scope.player.playing = !$scope.player.playing;
        }

    };

//  VIEW TRACK INFO

    $scope.view_track_info = function () {
        if (!$scope.player.first_start) {
            if ($scope.player.controls_open) {
                $scope.player.controls_open = false;
            } else {
                $scope.player.controls_open = true;
            }

            $scope.player.playlist_open = false;
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
        $scope.player.playlist_open = false;
        $scope.init_player();
        if ($scope.player.first_start) {
            $scope.player.controls_open = true;
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
        $scope.player.volume = Math.round(( clickY / $scope.player.volumeHeight ) * 100);
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
            else {
                $scope.volume_bar($event);
            }
        }
    };


//    FEEDBACK

    $scope.send_feedback = function (feedback) {
        if ($scope.feedback.length) {
            var msg = $('#fdb_text').val();
            var address = $('form[name=write_me]').attr('action');
            var dataString = 'feedback=' + msg;
            $('#fdb_text').val('');
            $('#feedback').fadeOut();
            $('#lean_overlay').hide();

            var request = $.ajax({
                type: "POST",
                url: address,
                data: dataString

            });
        }
    };


//    TUMBRL WALLPAPERS

    $scope.get_hashtag = function () {
        var time = new Date();
        var hour = time.getHours();
        if (11 < hour && hour <= 17) {
            time = 'tunelyday'
        }
        else if (17 < hour && hour <= 21) {
            time = 'tunelyevening'
        }
        else if (21 < hour && hour < 24 || hour <= 6) {
            time = 'tunelynight'
        }
        else if (6 < hour && hour < 11) {
            time = 'tunelymorning'
        }
        return time;
    };

    $scope.get_wallpapers = function (hashtag) {
        myJsonpCallback = function (data) {
            var posts = data.response.posts;
            $scope.wallpapers = [];
            var length = posts.length,
                post = null;
            var wallpaper_item = '';

            for (var i = 0; i < length; i++) {
                post = posts[i];
                wallpaper_item = post.photos[0].original_size['url'];
                $scope.wallpapers.push(wallpaper_item);
                // Do something with element i.
            }
            console.log();
            $scope.wallpapers = randomize($scope.wallpapers);
            $.backstretch($scope.wallpapers, {duration: 25000, fade: 750});
        };

        $.ajax({
            type: "GET",
            url: "http://api.tumblr.com/v2/blog/tunelyco.tumblr.com/posts/photo?",
            dataType: "jsonp",
            data: {
                format: "json",
                tag: hashtag,
                api_key: "GmNbPg7MEOqVrijicCcnsT639V8x8uzuBYheKjY5TQJ0NbuMrI",
                jsonp: "myJsonpCallback"
            }
        });

    };


    $scope.player = init_constants['Player'];
    $scope.stations = init_constants['radio_stations'];
    $scope.feedback = '';
    $scope.stream = false;
    $scope.sc_init();
    $scope.get_tracklist($scope.player.playlist_id, $scope.player.client_id);

    var time = $scope.get_hashtag();
    $scope.get_wallpapers(time);

    $(function () {
        $('a[rel*=leanModal]').leanModal({
            top: 75,
            closeButton: ".modal_close"
        });
    });


}

