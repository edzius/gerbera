/*GRB*
  Gerbera - https://gerbera.io/

  import.js - this file is part of Gerbera.

  Copyright (C) 2018 Gerbera Contributors

  Gerbera is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License version 2
  as published by the Free Software Foundation.

  Gerbera is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with Gerbera.  If not, see <http://www.gnu.org/licenses/>.

  $Id$
*/

function addAudio(obj) {
    var desc = '';
    var artist_full;
    var album_full;
    
    // first gather data
    var title = obj.meta[M_TITLE];
    if (!title) {
        title = obj.title;
    }
    
    var artist = obj.meta[M_ARTIST];
    if (!artist) {
        artist = 'Unknown';
        artist_full = null;
    } else {
        artist_full = artist;
        desc = artist;
    }
    
    var album = obj.meta[M_ALBUM];
    if (!album) {
        album = 'Unknown';
        album_full = null;
    } else {
        desc = desc + ', ' + album;
        album_full = album;
    }
    
    if (desc) {
        desc = desc + ', ';
    }
    desc = desc + title;
    
    var date = obj.meta[M_DATE];
    if (!date) {
        date = 'Unknown';
    } else {
        date = getYear(date);
        obj.meta[M_UPNP_DATE] = date;
        desc = desc + ', ' + date;
    }
    
    var genre = obj.meta[M_GENRE];
    if (!genre) {
        genre = 'Unknown';
    } else {
        desc = desc + ', ' + genre;
    }
    
    var description = obj.meta[M_DESCRIPTION];
    if (!description) {
        obj.description = desc;
    }

    var composer = obj.meta[M_COMPOSER];
    if (!composer) {
        composer = 'None';
    }

    var conductor = obj.meta[M_CONDUCTOR];
    if (!conductor) {
        conductor = 'None';
    }

    var orchestra = obj.meta[M_ORCHESTRA];
    if (!orchestra) {
        orchestra = 'None';
    }

// uncomment this if you want to have track numbers in front of the title
// in album view
    
/*    
    var track = obj.meta[M_TRACKNUMBER];
    if (!track) {
        track = '';
    } else {
        if (track.length == 1) {
            track = '0' + track;
        }
        track = track + ' ';
    }
*/
    // comment the following line out if you uncomment the stuff above  :)
    var track = '';

// uncomment this if you want to have channel numbers in front of the title
/*
    var channels = obj.res[R_NRAUDIOCHANNELS];
    if (channels) {
        if (channels === "1") {
            track = track + '[MONO]';
        } else if (channels === "2") {
            track = track + '[STEREO]';
        } else {
            track = track + '[MULTI]';
        }
    }
*/
    var chain = ['Audio', 'All Audio'];
    obj.title = title;
    addCdsObject(obj, createContainerChain(chain));
    
    chain = ['Audio', 'Artists', artist, 'All Songs'];
    addCdsObject(obj, createContainerChain(chain));
    
    chain = ['Audio', 'All - full name'];
    var temp = '';
    if (artist_full) {
        temp = artist_full;
    }
    
    if (album_full) {
        temp = temp + ' - ' + album_full + ' - ';
    } else {
        temp = temp + ' - ';
    }
   
    obj.title = temp + title;
    addCdsObject(obj, createContainerChain(chain));
    
    chain = ['Audio', 'Artists', artist, 'All - full name'];
    addCdsObject(obj, createContainerChain(chain));
    
    chain = ['Audio', 'Artists', artist, album];
    obj.title = track + title;
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_ALBUM);
    
    chain = ['Audio', 'Albums', album];
    obj.title = track + title; 
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_ALBUM);
    
    chain = ['Audio', 'Genres', genre];
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_GENRE);
    
    chain = ['Audio', 'Year', date];
    addCdsObject(obj, createContainerChain(chain));

    chain = ['Audio', 'Composers', composer];
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_COMPOSER);
}

// Locally served guessit server
var VIDEO_GUESSIT_URL = getEnv('GUESSIT_URL') || 'http://localhost:5000/';

var VIDEO_TIME_METRIC_RE = /(\d+):(\d+):(\d+)/;
var VIDEO_DIM_METRIC_RE = /(\d+)x(\d+)/;

function grabVideoMetrics(obj) {
    var out = {}

    if (obj.res && obj.res.duration) {
        var res = obj.res.duration.match(VIDEO_TIME_METRIC_RE);
        if (res)
            out.duration = (+res[1] * 60) + (+res[2]) + (+res[3] > 0 ? 1 : 0);
    }

    if (obj.res && obj.res.resolution) {
        var res = obj.res.resolution.match(VIDEO_DIM_METRIC_RE);
        if (res)
            out.dimensions = {
                width: +res[1],
                height: +res[2],
            };
    }

    return out;
}

function addMovie(obj, info) {
    var chain;

    /**
     * Movies.List.<Name>.*
     * Movies.Year.<Year>.*
     * Movies.Duration.<Duration>.*
     * Movies.Quality.<Quality>.*
     * Movies.Certified.<Certified>.*
     * Movies.Rating.<Rating>.*
     * Movies.Votes.<Votes>.*
     * Movies.Genre.<Genre>.*
     * Movies.Director.<Director>.*
     * Movies.Writer.<Writer>.*
     */

    if (info.title) {
        chain = ['Movies', 'List', '[' + (info.year || 'XXXX') + '] ' + info.title];
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Movies', 'List', 'Unsorted'];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.year) {
        chain = ['Movies', 'Year', '' + info.year];
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Movies', 'Year', 'Unsorted'];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.duration) {
        if (info.duration < 30) {
            chain = ['Movies', 'Duration', 'Short'];
        } else if (info.duration >= 30 && info.duration < 90) {
            chain = ['Movies', 'Duration', '~1 Hour'];
        } else if (info.duration >= 90 && info.duration < 150) {
            chain = ['Movies', 'Duration', '~2 Hours'];
        } else if (info.duration >= 150 && info.duration < 210) {
            chain = ['Movies', 'Duration', '~3 Hours'];
        } else if (info.duration >= 210) {
            chain = ['Movies', 'Duration', 'Loong'];
        }
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Movies', 'Duration', 'Unsorted'];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.dimensions) {
        if (info.dimensions.width <= 640 && info.dimensions.height <= 360) {
            chain = ['Movies', 'Quality', 'nHD (640x360)'];
        } else if (info.dimensions.width <= 800 && info.dimensions.height <= 600) {
            chain = ['Movies', 'Quality', 'SVGA (800x600)'];
        } else if (info.dimensions.width <= 1024 && info.dimensions.height <= 768) {
            chain = ['Movies', 'Quality', 'XGA (1024x768)'];
        } else if (info.dimensions.width <= 1280 && info.dimensions.height <= 800) {
            chain = ['Movies', 'Quality', 'WXGA (1280x800)'];
        } else if (info.dimensions.width <= 1280 && info.dimensions.height <= 1024) {
            chain = ['Movies', 'Quality', 'SXGA (1280x1024)'];
        } else if (info.dimensions.width <= 1360 && info.dimensions.height <= 768) {
            chain = ['Movies', 'Quality', 'HD (1360x768)'];
        } else if (info.dimensions.width <= 1440 && info.dimensions.height <= 900) {
            chain = ['Movies', 'Quality', 'WXGA+ (1440x900)'];
        } else if (info.dimensions.width <= 1600 && info.dimensions.height <= 900) {
            chain = ['Movies', 'Quality', 'HD+ (1600x900)'];
        } else if (info.dimensions.width <= 1680 && info.dimensions.height <= 1050) {
            chain = ['Movies', 'Quality', 'WSXGA+ (1680x1050)'];
        } else if (info.dimensions.width <= 1920 && info.dimensions.height <= 1080) {
            chain = ['Movies', 'Quality', 'FHD (1920x1080)'];
        } else if (info.dimensions.width <= 1920 && info.dimensions.height <= 1200) {
            chain = ['Movies', 'Quality', 'WUXGA (1920x1200)'];
        } else if (info.dimensions.width <= 2048 && info.dimensions.height <= 1152) {
            chain = ['Movies', 'Quality', 'QWXGA (2048x1152)'];
        } else if (info.dimensions.width <= 2560 && info.dimensions.height <= 1440) {
            chain = ['Movies', 'Quality', 'QHD (2560x1440)'];
        } else if (info.dimensions.width <= 3840 && info.dimensions.height <= 2160) {
            chain = ['Movies', 'Quality', '4K UHD (3840x2160)'];
        } else {
            chain = ['Movies', 'Quality', 'Other'];
        }
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Movies', 'Quality', 'Unsorted'];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.certified) {
        chain = ['Movies', 'Certified', '' + info.certified];
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Movies', 'Certified', 'Unsorted'];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.imdbRating) {
        chain = ['Movies', 'Rating', '' + info.imdbRating];
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Movies', 'Rating', 'Unsorted'];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.imdbVotes) {
        if (info.imdbVotes >= 500000) {
            chain = ['Movies', 'Votes', '500000+'];
        } else if (info.imdbVotes >= 400000) {
            chain = ['Movies', 'Votes', '400000+'];
        } else if (info.imdbVotes >= 300000) {
            chain = ['Movies', 'Votes', '300000+'];
        } else if (info.imdbVotes >= 200000) {
            chain = ['Movies', 'Votes', '200000+'];
        } else if (info.imdbVotes >= 100000) {
            chain = ['Movies', 'Votes', '100000+'];
        } else if (info.imdbVotes >= 70000) {
            chain = ['Movies', 'Votes', '70000+'];
        } else if (info.imdbVotes >= 30000) {
            chain = ['Movies', 'Votes', '30000+'];
        } else if (info.imdbVotes >= 10000) {
            chain = ['Movies', 'Votes', '10000+'];
        } else if (info.imdbVotes >= 7000) {
            chain = ['Movies', 'Votes', '7000+'];
        } else if (info.imdbVotes >= 3000) {
            chain = ['Movies', 'Votes', '3000+'];
        } else if (info.imdbVotes >= 1000) {
            chain = ['Movies', 'Votes', '1000+'];
        } else {
            chain = ['Movies', 'Votes', 'Defunct'];
        }
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Movies', 'Votes', 'Unsorted'];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.genre) {
        info.genre.forEach(function (genre) {
            chain = ['Movies', 'Genre', '' + genre];
            addCdsObject(obj, createContainerChain(chain));
        });
    } else {
        chain = ['Movies', 'Genre', 'Unsorted'];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.director) {
        info.director.forEach(function (director) {
            chain = ['Movies', 'Director', '' + director];
            addCdsObject(obj, createContainerChain(chain));
        });
    } else {
        chain = ['Movies', 'Director', 'Unsorted'];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.writer) {
        info.writer.forEach(function (writer) {
            chain = ['Movies', 'Writer', '' + writer];
            addCdsObject(obj, createContainerChain(chain));
        });
    } else {
        chain = ['Movies', 'Writer', 'Unsorted'];
        addCdsObject(obj, createContainerChain(chain));
    }
}

function addEpisode(obj, info) {
    var chain;

    /**
     * Series.List.<Series-Seasons>.*
     * Series.Year.<Year>.<Series>.<Season>.*
     * Series.Duration.<Duration>.<Series>.<Seasons>.*
     * Series.Seasons.<Seasons>.<Series>.<Seasons>.*
     * Series.Episodes.<Episodes>.<Series>.*
     * Series.Rating.<Rating>.<Series>.<Seasons>.*
     * Series.Votes.<Votes>.<Series>.<Seasons>.*
     * Series.Genre.<Genre>.<Series>.<Seasons>.*
     * Series.Completed.<Series>.<Seasons>.*
     */

    var title = info.title
    var season = info.episode ? ('S' + info.episode.season) : undefined;

    if (info.title) {
        chain = ['Series', 'List', info.title + ' S' + (info.episode && info.episode.season || 'XX')];
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Series', 'List', 'Unsorted'];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.year) {
        chain = ['Series', 'Year', '' + info.year, title, season];
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Series', 'Year', 'Unsorted', title, season];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.duration) {
        if (info.duration < 15) {
            chain = ['Series', 'Duration', 'Short', title, season];
        } else if (info.duration >= 15 && info.duration < 30) {
            chain = ['Series', 'Duration', '~30 Minutes', title, season];
        } else if (info.duration >= 30 && info.duration < 45) {
            chain = ['Series', 'Duration', '~45 Minutes', title, season];
        } else if (info.duration >= 45) {
            chain = ['Series', 'Duration', 'Loong', title, season];
        }
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Series', 'Duration', 'Unsorted', title, season];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.seasons) {
        chain = ['Series', 'Seasons', '' + info.seasons, title, season];
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Series', 'Seasons', 'Unsorted', title, season];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.imdbRating) {
        chain = ['Series', 'Rating', '' + info.imdbRating, title, season];
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Series', 'Rating', 'Unsorted', title, season];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.imdbVotes) {
        if (info.imdbVotes >= 500000) {
            chain = ['Series', 'Votes', '500000+', title, season];
        } else if (info.imdbVotes >= 400000) {
            chain = ['Series', 'Votes', '400000+', title, season];
        } else if (info.imdbVotes >= 300000) {
            chain = ['Series', 'Votes', '300000+', title, season];
        } else if (info.imdbVotes >= 200000) {
            chain = ['Series', 'Votes', '200000+', title, season];
        } else if (info.imdbVotes >= 100000) {
            chain = ['Series', 'Votes', '100000+', title, season];
        } else if (info.imdbVotes >= 70000) {
            chain = ['Series', 'Votes', '70000+', title, season];
        } else if (info.imdbVotes >= 30000) {
            chain = ['Series', 'Votes', '30000+', title, season];
        } else if (info.imdbVotes >= 10000) {
            chain = ['Series', 'Votes', '10000+', title, season];
        } else if (info.imdbVotes >= 7000) {
            chain = ['Series', 'Votes', '7000+', title, season];
        } else if (info.imdbVotes >= 3000) {
            chain = ['Series', 'Votes', '3000+', title, season];
        } else if (info.imdbVotes >= 1000) {
            chain = ['Series', 'Votes', '1000+', title, season];
        } else {
            chain = ['Series', 'Votes', 'Defunct', title, season];
        }
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Series', 'Votes', 'Unsorted', title, season];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.genre) {
        info.genre.forEach(function (genre) {
            chain = ['Series', 'Genre', '' + genre, title, season];
            addCdsObject(obj, createContainerChain(chain));
        });
    } else {
        chain = ['Series', 'Genre', 'Unsorted', title, season];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.complete) {
        chain = ['Series', 'Completed', title, season];
        addCdsObject(obj, createContainerChain(chain));
    }
}

function addVideoCategory(obj) {
    if (!doHttpGet || !urlEncode)
        return;

    var res = grabVideoMetrics(obj);
    if (res.duration && res.duration <= 10) {
        print('[video] Skipping item - too short (<10); file: ', obj.location);
        return;
    }
    if (!res.dimensions) {
        print('[video] Skipping item - no dimensions; file: ', obj.location);
        return;
    }

    var response = doHttpGet(VIDEO_GUESSIT_URL + '?options=-Llt&filename=' + urlEncode(obj.location));
    if (!response) {
        print('[video] Skipping item - no HTTP response; file: ', obj.location);
        return;
    }

    var movie = JSON.parse(response)
    if (!movie) {
        print('[video] Skipping item - bad HTTP response `', response, '`; file: ', obj.location);
        return;
    }

    //print('[video] Processing item; file: ', obj.location, ' (' + obj.mimetype + ')');

    var mtmp;
    var minfo = {
        type: movie.type,
        title: movie.title,
        year: +movie.year,
        complete: null,
        seasons: null,
        episodes: null,
        duration: null,
        dimensions: null,
        genre: [],
        director: [],
        writer: [],
        certified: null,
        imdbRating: null,
        imdbVotes: null,
        episode: {
          title: null,
          season: +movie.season,
          episode: +movie.episode,
          year: null,
          duration: null,
          dimensions: null,
          genre: [],
          director: [],
          writer: [],
          certified: null,
          imdbRating: null,
          imdbVotes: null,
        }
    };

    if (movie.res && movie.type === 'episode') {
        minfo.episode.duration = res.duration;
        minfo.episode.dimensions = res.dimensions;
    } else {
        minfo.duration = res.duration;
        minfo.dimensions = res.dimensions;
    }

    if (movie.ext) {
        minfo.type = movie.ext.type;
        minfo.title = movie.ext.title;
        mtmp = (movie.ext.year || '').match(/(\d+)(?:\-(\d+))?/);
        if (mtmp) {
            minfo.year = +mtmp[0];
            minfo.complete = +mtmp[1];
        }
        if (minfo.complete) {
            minfo.seasons = movie.ext.total_seasons;
            minfo.episodes = movie.ext.total_episodes; // Hypothetic nonexisting property
        }
        mtmp = (movie.ext.runtime || '').match(/(\d+)/)
        if (mtmp)
            minfo.duration = +mtmp[0];
        minfo.certified = movie.ext.rated;
        minfo.genre = (movie.ext.genre || '').split(/, /);
        minfo.director = (movie.ext.director || '').split(/, /);
        minfo.writer = (movie.ext.writer || '').split(/, /).map(function (writer) {
            var name = writer.match(/[^\(\[\)\]]+/);
            if (!name)
                return;
            return name[0].trim();
        }).filter(function (writer) {
            return !!writer;
        });
        minfo.imdbRating = +movie.ext.imdb_rating;
        minfo.imdbVotes = +(movie.ext.imdb_votes || '').replace(',', '');

        if (movie.ext.specific) {
            minfo.episode.title = movie.ext.specific.title;
            mtmp = +movie.ext.specific.year;
            if (mtmp)
                minfo.episode.year = mtmp;
            mtmp = (movie.ext.specific.runtime || '').match(/(\d+)/)
            if (mtmp)
                minfo.episode.duration = +mtmp[0];
            minfo.episode.certified = movie.ext.specific.rated;
            minfo.episode.genre = (movie.ext.specific.genre || '').split(/, /);
            minfo.episode.director = (movie.ext.specific.director || '').split(/, /);
            minfo.episode.writer = (movie.ext.specific.writer || '').split(/, /).map(function (writer) {
                var name = writer.match(/[^\(\[\)\]]+/);
                if (!name)
                    return;
                return name[0].trim();
            }).filter(function (writer) {
                return !!writer;
            });
            minfo.episode.imdbRating = +movie.ext.specific.imdb_rating;
            minfo.episode.imdbVotes = +(movie.ext.specific.imdb_votes || '').replace(',', '');
        }
    }

    switch (minfo.type) {
        case 'movie':
            if (res.duration && res.duration <= 45) {
                print('[video] Skipping item - too short (<45); file: ', obj.location);
                return;
            }
            addMovie(obj, minfo);
            break;
        case 'series':
        case 'episode':
            if (minfo.episode && minfo.episode.episode) {
                addEpisode(obj, minfo);
            } else {
                print('[video] Confusing item - no episode information; file: ', obj.location);
                addMovie(obj, minfo);
            }
            break;
    }
}

function addVideo(obj) {
    var chain = ['Video', 'All Video'];
    addCdsObject(obj, createContainerChain(chain));

    var dir = getRootPath(object_script_path, obj.location);

    if (dir.length > 0) {
        chain = ['Video', 'Directories'];
        chain = chain.concat(dir);
        addCdsObject(obj, createContainerChain(chain));
    }

    addVideoCategory(obj);
}

function addImage(obj) {
    var chain = ['Photos', 'All Photos'];
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);

    var date = obj.meta[M_DATE];
    if (date) {
        var dateParts = date.split('-');
        if (dateParts.length > 1) {
            var year = dateParts[0];
            var month = dateParts[1];

            chain = ['Photos', 'Year', year, month];
            addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);
        }

        chain = ['Photos', 'Date', date];
        addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);
    }

    var dir = getRootPath(object_script_path, obj.location);

    if (dir.length > 0) {
        chain = ['Photos', 'Directories'];
        chain = chain.concat(dir);
        addCdsObject(obj, createContainerChain(chain));
    }
}

function addTrailer(obj) {
    var chain;

    chain = ['Online Services', 'Apple Trailers', 'All Trailers'];
    addCdsObject(obj, createContainerChain(chain));

    var genre = obj.meta[M_GENRE];
    if (genre) {
        genres = genre.split(', ');
        for (var i = 0; i < genres.length; i++) {
            chain = ['Online Services', 'Apple Trailers', 'Genres', genres[i]];
            addCdsObject(obj, createContainerChain(chain));
        }
    }

    var reldate = obj.meta[M_DATE];
    if ((reldate) && (reldate.length >= 7)) {
        chain = ['Online Services', 'Apple Trailers', 'Release Date', reldate.slice(0, 7)];
        addCdsObject(obj, createContainerChain(chain));
    }

    var postdate = obj.aux[APPLE_TRAILERS_AUXDATA_POST_DATE];
    if ((postdate) && (postdate.length >= 7)) {
        chain = ['Online Services', 'Apple Trailers', 'Post Date', postdate.slice(0, 7)];
        addCdsObject(obj, createContainerChain(chain));
    }
}

// main script part

if (getPlaylistType(orig.mimetype) === '') {
    var arr = orig.mimetype.split('/');
    var mime = arr[0];
    
    // var obj = copyObject(orig);
    
    var obj = orig; 
    obj.refID = orig.id;
    
    if (mime === 'audio') {
        addAudio(obj);
    }
    
    if (mime === 'video') {
        if (obj.onlineservice === ONLINE_SERVICE_APPLE_TRAILERS) {
            addTrailer(obj);
        } else {
            addVideo(obj);
        }
    }
    
    if (mime === 'image') {
        addImage(obj);
    }

    if (orig.mimetype === 'application/ogg') {
        if (orig.theora === 1) {
            addVideo(obj);
        } else {
            addAudio(obj);
        }
    }
}
