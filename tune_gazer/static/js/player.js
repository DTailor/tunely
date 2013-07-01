/* Copyright 2013, Croitoru Dan
 * Requires: jQuery 1.2.3 ~ 1.9.1
 */

$(document).ready(function () {
//    window.onerror = function (errorMsg, url, lineNumber) {
//        log.fatal("Uncaught error " + errorMsg + " in " + url + ", line " + lineNumber);
//    };

    var playlist_id = $('.station-title').attr('id');
    Player.tracklist = tracklistItems(playlist_id, Player.client_id);
    Player.sc = SC.initialize({
        client_id: Player.client_id
    });

    //    Set-up the env. for player
    setNextTrack();
    set_station_shares();


    /* Player controls  */
    $('.audioplayer-playpause').on("click", function () {
        if (!Player.first_start) {
            firstPlay();
            initPlayer();

        } else if ($('.audioplayer-playpause').hasClass('playing')) {
            if (Player.debug) {
                console.log('-Pause-');
            }
            window.stream.pause();
            $('.audioplayer-playpause').removeClass('playing').addClass('pause');
            $('.audioplayer').removeClass('audioplayer-playing');

        } else if ($('.audioplayer-playpause').hasClass('pause')) {
            if (Player.debug) {
                console.log('-Play-');
            }
            window.stream.play();
            $('.audioplayer-playpause').removeClass('pause').addClass('playing');
            $('.audioplayer').addClass('audioplayer-playing');
        }


    });

    /* Switch station control */

    $('.dropdown > li').click(function () {
        switchStation(this);
        set_station_shares();
    });


    // Skip track

    $('.skip_song').on('click', function(){
        skipTrack();
    });


    //    Volume control part

    $('.audioplayer-volume-adjust').on('click', function (ev) {
        volumeControl(this, ev);
    });

    $('.audioplayer-volume-button').on('click', function () {
        var audioplayer = $('.audioplayer');
        audioplayer.toggleClass(' audioplayer-mute');
        if (audioplayer.hasClass('audioplayer-mute')) {
            if (Player.debug) {
                console.log('was->', window.stream.volume);
            }
            window.stream.setVolume(0);
            $('.status').removeClass('play').addClass('mute');
            if (Player.debug) {
                console.log('set->', window.stream.volume);
            }
        } else {
            if (Player.debug) {
                console.log('-Play-');
                console.log('was->', window.stream.volume);
            }
            window.stream.setVolume(Player.volume);
            $('.status').removeClass('mute').addClass('play');
            if (Player.debug) {
                console.log('set->', window.stream.volume);
            }
        }
    });


    //    Activate dropdown
    var dd = new DropDown($('#dd'));
    // $("#content_1").mCustomScrollbar({
    //     scrollButtons: {
    //         enable: true
    //     }
    // });


    //  Stations and Volume dropdown handling

    $('.audioplayer-stations').on('click', function () {
        $('.wrapper-dropdown-2').toggleClass('active');
        $('.audioplayer-stations').toggleClass('hover');
    });

    //    Additional panel controls

    $('.audioplayer-bar').on('click', function () {
        $('.panel').toggleClass('active')
        if ($('.panel').hasClass('active')) {
            $(this).css('background-color', '#2c3e50');
        } else {
            $(this).css('background-color', '#34495e');
        }

    });


});


resetDropdowns = function () {
    $('.audioplayer-stations').removeClass('hover');
    $('.wrapper-dropdown-2').removeClass('active');
    $('.audioplayer-volume-adjust').removeClass('active');
    $('.audioplayer-volume').addClass('hover');

};

skipTrack = function(){
    Player.sc.streamStopAll();
    Player.sc = SC.initialize({
        client_id: Player.client_id
    });
    resetPlaylist();
    resetPlayerBar();
    setNextTrack();
    initPlayer();
};

switchStation = function (station) {

    Player.playlist_id = $(station).find('a').attr('id');
    Player.station = $(station).find('a').attr('class');
    Player.slug = $(station).find('a').data('slug');
    Player.tracklist = tracklistItems(Player.playlist_id, Player.client_id);
    Player.sc.streamStopAll();
    Player.sc = SC.initialize({
        client_id: Player.client_id
    });

//    if (!Player.first_start)
    firstPlay();

    resetPlaylist();
    resetPlayerBar();
    setNextTrack();
    initPlayer();


};

firstPlay = function () {
    if (Player.debug) {
        console.log('first start');
    }
    $('.audioplayer-playpause').removeClass('start');
    $('.audioplayer-playpause').removeClass('pause');

    $('.audioplayer-playpause').addClass('playing');
    $('.audioplayer').addClass('audioplayer-playing');

};


volumeControl = function (div, ev) {
    var clickY = $('.player-volume-bar').height() - (ev.pageY - $('.player-volume-bar').offset().top);
    //    var clickY = Player.volumeHeight - (ev.clientY - $('.player-volume-bar').offset().top + 8);
    Player.volume = Math.round((clickY / Player.volumeHeight) * 100);
    if (Player.volume > 100) {
        Player.volume = 100;
    }
    if (Player.volume < 0) {
        Player.volume = 0;
    }
    if (Player.debug) {
        console.log('clickY-> ', clickY);
        console.log('level-> ', Player.volume);
    }
    if (Player.volume > 0) {
        $('.player-volume-bar').css({
            'height': Player.volume + '%'
        });
        if (window.stream) {
            window.stream.setVolume(Player.volume);
        }

    }
};

function initPlayer() {

    var next_track = $('.next-track');
    var next_track_adr = next_track.attr('href');

    updatePanel();
    document.title = Player.node.title;

    //  Remove current track if exists
    $('.current-track').remove();

        SC.stream(next_track_adr, {
                onplay: function () {
                    if (Player.debug) {
                        console.log('now playing', next_track_adr);
                    }

                },
                onload: function (status) {
                    //  Set the next track as current track
                    next_track.removeClass('next-track').addClass('current-track');
                    setNextTrack();
                    if(!status){
                        resetPlayerBar();
                        initPlayer();
                    }
                },
                onfinish: function () {
                    resetPlayerBar();
                    initPlayer();
                },
                onready: function(b){
                    console.log(b);
                }
            },

            function (b) {
                window.stream = b;
                playerHandler(b);
                resetPlayerBar();
                if (!Player.first_start) {
                    b.play();
                    window.stream.setVolume(Player.volume);
                    Player.first_start = true;
                    if (Player.debug) {
                        console.log('Player init volume->', window.stream.volume);
                    }
                    $('.status').addClass('play');

                    //                Show info panel
                    $('.audioplayer-bar').click();
                }
            }

        );


}

// Update controls panel

var updatePanel = function () {
    $('.song_user').text(Player.node.user.username);
    $('.song_title').text(Player.node.title);
    $('.sc_button').find('a').attr('href', Player.node.permalink_url);
};


//update

function playerHandler(b) {

    if ($('.status').hasClass('play')) {
        if (Player.first_start) {
            resetPlayerBar();
            $(this).css({
                'display': 'none'
            });
            $('.stop').css({
                'display': ''
            });
            window.stream.play();
        }
    }

    if ($('.audioplayer-playpause').hasClass('mute')) {
        if (Player.first_start) {
            window.stream.play();
            window.stream.setVolume(0);
            resetPlayerBar();

        }
    }


    $('.stop').click(function () {
        $(this).css({
            'display': 'none'
        });
        $('.play').css({
            'display': ''
        });
        $('.audioplayer-playpause').addClass('pause').removeClass('playing');
        if (Player.debug) {
            console.log('-Pause-');
        }
        if (Player.debug) {
            console.log('was->', window.stream.volume);
        }
        window.stream.setVolume(0);
        if (Player.debug) {
            console.log('set->', window.stream.volume);
        }

    });

}


function resetPlayerBar() {
    $('.station-title').remove();
    var html_bar = '<div class="station-title" data-lines="" id="' + Player.playlist_id + '">' + Player.station + '</div>';
    $('.audioplayer-bar').append(html_bar);

}


function resetPlaylist() {
    $('.current-track').remove();
    $('.next-track').remove();

}


function setNextTrack() {
    Player.node = Player.tracklist[Player.tracklist.length - 1];
    if (Player.debug) {
        console.log('next track', Player.node.title);
    }
    var next_track = '<a class="next-track" href="/tracks/' + Player.node.id + '">';
    $('.playlist').append(next_track);
    Player.tracklist.pop(Player.tracklist[Player.tracklist.length - 1]);
}

function tracklistItems(playlist_id, client_id) {
    var playlistLink = "http://api.soundcloud.com/playlists/" + playlist_id + ".json?client_id=" + client_id;
    return shuffle(getTracklist(playlistLink));
}

function getTracklist(link) {
    var tracklist = [];
    $.ajax({
        async: false,
        type: 'GET',
        url: link,
        success: function (data) {
//            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
//                //Do Firefox-related activities
//                data = jQuery.parseJSON(data);
//            }
            if (typeof(data) === 'string') {
                data = jQuery.parseJSON(data);
            }
            for (var i = 0; i < data['track_count']; i++) {
                tracklist.push(data['tracks'][i]);
            }
        }
    });
    return tracklist;
}


function shuffle(o) { //v1.0
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

//Other handlers

function DropDown(el) {
    this.dd = el;
    this.initEvents();
}
DropDown.prototype = {
    initEvents: function () {
        var obj = this;

        obj.dd.on('click', function (event) {
            $(this).toggleClass('active');
            event.stopPropagation();
        });
    }
};


// Feedback

$(document).ready(function () {
    $('#fdb_send').on('click', function () {
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

    });

    $(function () {
        $('a[rel*=leanModal]').leanModal({
            top: 175,
            closeButton: ".modal_close"
        });
    });


});


// Share Button

var set_station_shares = function () {
    var station_link = 'http://tunely.co/' + Player.slug;

    var fb_link = "http://www.facebook.com/sharer.php?u=" + station_link;
    $('#fb_station_share').attr('href', fb_link);

    var tw_text = 'Listen to ' + Player.station + ' station @tunelyCo ';
    var tw_link = "http://twitter.com/share?text=" + tw_text + "&url=" + station_link;
    $('#tw_station_share').attr('href', tw_link);

    $('#social_graph_title').attr('content', Player.station);
    $('#social_graph_link').attr('content', station_link);

};


// Disable page scrolling

document.body.scroll = "no";
document.body.style.overflow = 'hidden';
document.height = window.innerHeight;