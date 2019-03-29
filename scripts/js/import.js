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

var VIDEO_FETCH_URL = getEnv('GUESSIT_URL') || 'http://localhost:5000';
var VIDEO_GUESSIT_URL = VIDEO_FETCH_URL + '/';
var VIDEO_OMDB_URL = VIDEO_FETCH_URL + '/omdb/';

var VIDEO_TIME_METRIC_RE = /(\d+):(\d+):(\d+)/;
var VIDEO_DIM_METRIC_RE = /(\d+)x(\d+)/;

var FILE_EXT_RE = /^(mkv|avi|mp4)$/i;
var FILE_LANG_RE = /^(LT|EN|RU)/i;
var FILE_SUBS_RE = /([A-Z]*sub)/i;
var FILE_YEAR_RE = /^\(?(\d\d\d\d)\)?$/;
var FILE_CODING_RE = /^(x264|h264|web\-?rip|web\-?dl|web\-?dlrip|dvd\-?rip|b[dr]\-?rip|hd\-?rip|hdtv|720p|1080p|avc|aac|ac3|dts|divx|xvid|bluray)$/i;
var FILE_SEASON_RE = /^S(\d+)/i;
var FILE_EPISODE_RE = /E(\d+)$/i;

function matchFileExt(value) {
    if (value.length < 3 || value.length > 4)
        return;
    var ret = value.match(FILE_EXT_RE);
    if (ret)
        return ret[1];
}

function matchLanguage(value) {
    if (value.length < 2 || value.length > 3)
        return;
    var ret = value.match(FILE_LANG_RE);
    if (ret)
        return ret[1];
}

function matchSubtitres(value) {
    var ret = value.match(FILE_SUBS_RE);
    if (ret)
        return ret[1];
}

function matchYear(value) {
    var ret = value.match(FILE_YEAR_RE);
    if (ret)
        return +ret[1];
}

function matchCoding(value) {
    var ret = value.match(FILE_CODING_RE);
    if (ret)
        return ret[1];
}

function matchSeason(value) {
    var ret = value.match(FILE_SEASON_RE);
    if (ret)
        return +ret[1];
}

function matchEpisode(value) {
    var ret = value.match(FILE_EPISODE_RE);
    if (ret)
        return +ret[1];
}

function cleanPrefixes(name) {
    var result = name.match(/[\[\(\{][^\]\)\}]*[\]\)\}](.*)/)
    if (result)
        return result[1];
    return name;
}

function swapTitle(line, length) {
    let title;
    var pos = length;
    while (pos < length) {
        if (/[ \.\-_]/.test(line[pos]))
          break;
        pos++;
    }
    title = line.slice(0, pos);
    title = title.replace(/(\w{2,})[\._]/g, '$1 ').replace(/(\w{1}\.)(\w{2,})/g, '$1 $2');
    return title;
}

function processName(name) {
    var ret = {
      type: 'movie'
    };
    var lastId;
    var arr;

    if (!name)
        return;

    name = cleanPrefixes(name);
    arr = name.split(/[ \.\-_]/);

    for (var i = arr.length - 1; i >= 0; i--) {
        var val = arr[i];
        var ext = matchFileExt(val);
        var lang = matchLanguage(val);
        var subs = matchSubtitres(val);
        var year = matchYear(val);
        var code = matchCoding(val);
        var season = matchSeason(val);
        var episode = matchEpisode(val);
        if (!ret.ext && ext) {
            ret.ext = ext
            lastId = i;
        }
        if (lang) {
            ret.lang = ret.lang || [];
            ret.lang.push(lang);
            lastId = i;
        }
        if (subs) {
            ret.subs = ret.subs || [];
            ret.subs.push(subs);
            lastId = i;
        }
        if (!ret.year && year) {
            ret.year = year;
            lastId = i;
        }
        if (code) {
            ret.code = ret.code || [];
            ret.code.push(code);
            lastId = i;
        }
        if (!ret.season && season) {
            ret.season = season;
            ret.type = 'episode';
            lastId = i;
        }
        if (!ret.episode && episode) {
            ret.episode = episode;
            ret.type = 'episode';
            lastId = i;
        }
    }

    if (lastId) {
        ret.title = swapTitle(name, arr.slice(0, lastId).join(' ').trim().length);
        return ret;
    } else {
        return;
    }
}

function processDirName(obj) {
    var parts = obj.location.split('/');
    if (parts.length < 2)
        return;

    var file = parts[parts.length - 2];

    return processName(file);
}

function processFileName(obj) {
    var file = obj.title;

    return processName(file);
}

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

function getVideoFileInfo(file) {
    if (!doHttpGet || !urlEncode)
        return;

    var options = [
        '--allowed-languages=lt',
        '--excludes=part',
    ].join(' ');
    var response = doHttpGet(VIDEO_GUESSIT_URL + '?options=' + urlEncode(options) + '&filename=' + urlEncode(file));
    if (!response) {
        print('[video] Skipping item - no HTTP response; file: ', file);
        return;
    }

    var info = JSON.parse(response)
    if (!info) {
        print('[video] Skipping item - bad guessit HTTP response `', response, '`; file: ', file);
        return;
    }

    return info;
}

function getVideoOmdbInfo(type, title, season, episode) {
    if (!doHttpGet || !urlEncode)
        return;

    if (!title)
        return;

    var name = title + ' ' + (season || '') + ' ' + (episode || '');
    var url = VIDEO_OMDB_URL + '?title=' + urlEncode(title);
    if (season && episode)
        url += '&season=' + urlEncode(season) + '&episode=' + urlEncode(episode);
    if (type)
        url += '&type=' + urlEncode(type);

    var response = doHttpGet(url);
    if (!response) {
        print('[video] Skipping item - no HTTP response; name: ', name);
        return;
    }

    var info = JSON.parse(response)
    if (!info) {
        print('[video] Skipping item - bad OMDB HTTP response `', response, '`; name: ', name);
        return;
    }

    return info;
}

function modPersonGeneric(title) {
    return title.replace(/((?<=\bi)m|(?<=\b(you|they))re|(?<=\b(he|she|it))s|(?<=\b(wasn|weren|won))t|(?<=\b(i|you|they))ll|(?<=\b(i|you|we))ve)\b/gi, '\'$1');
}

function modPersonWere(title) {
    return title.replace(/((?<=\bwe)re)\b/gi, '\'$1');
}

function modGenitive(title) {
    return title.replace(/^(\S*)s\b/i, '$1\'s');
}

function grabVideoOmdbInfo(movieInfo, type, title) {
    if (!movieInfo)
        return;

    var movieDetails = getVideoOmdbInfo(type || movieInfo.type, title || movieInfo.title, movieInfo.season, movieInfo.episode);
    if (!movieDetails)
        return;

    return {
        movieInfo: movieInfo,
        movieDetails: movieDetails,
    };
}

function grabVideoOmdbInfoModified(movieInfo, type, title, changed) {
    if (title === changed)
        return;

    return grabVideoOmdbInfo(movieInfo, type, changed);
}

function grabVideoInfo(obj) {
    var videoInfo;
    var localInfo;
    var guessInfo;

    guessInfo = getVideoFileInfo(obj.location);
    videoInfo = grabVideoOmdbInfo(guessInfo);
    if (videoInfo)
        return videoInfo;

    /* Try file name only parsing */
    videoInfo = grabVideoOmdbInfo(getVideoFileInfo(obj.title));
    if (videoInfo)
        return videoInfo;

    localInfo = processDirName(obj);
    if (localInfo) {
        videoInfo = grabVideoOmdbInfo(localInfo);
        if (videoInfo)
            return videoInfo;

        videoInfo = grabVideoOmdbInfo(guessInfo, localInfo.type, localInfo.title);
        if (videoInfo)
            return videoInfo;

        videoInfo = grabVideoOmdbInfoModified(guessInfo, localInfo.type, localInfo.title, modPersonGeneric(localInfo.title));
        if (videoInfo)
            return videoInfo;

        videoInfo = grabVideoOmdbInfoModified(guessInfo, localInfo.type, localInfo.title, modPersonWere(localInfo.title));
        if (videoInfo)
            return videoInfo;

        videoInfo = grabVideoOmdbInfoModified(guessInfo, localInfo.type, localInfo.title, modGenitive(localInfo.title));
        if (videoInfo)
            return videoInfo;
    }

    localInfo = processFileName(obj);
    if (localInfo) {
        videoInfo = grabVideoOmdbInfo(localInfo);
        if (videoInfo)
            return videoInfo;

        videoInfo = grabVideoOmdbInfo(guessInfo, localInfo.type, localInfo.title);
        if (videoInfo)
            return videoInfo;

        videoInfo = grabVideoOmdbInfoModified(guessInfo, localInfo.type, localInfo.title, modPersonGeneric(localInfo.title));
        if (videoInfo)
            return videoInfo;

        videoInfo = grabVideoOmdbInfoModified(guessInfo, localInfo.type, localInfo.title, modPersonWere(localInfo.title));
        if (videoInfo)
            return videoInfo;

        videoInfo = grabVideoOmdbInfoModified(guessInfo, localInfo.type, localInfo.title, modGenitive(localInfo.title));
        if (videoInfo)
            return videoInfo;
    }
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

    var title = '' + info.title || 'Untitled'

    if (info.title) {
        chain = ['Movies', 'List', '[' + (info.year || 'XXXX') + '] ' + info.title];
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Movies', 'List', 'Unsorted'];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.year) {
        chain = ['Movies', 'Year', '' + info.year, title];
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Movies', 'Year', 'Unsorted', title];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.duration) {
        if (info.duration < 30) {
            chain = ['Movies', 'Duration', 'Short', title];
        } else if (info.duration >= 30 && info.duration < 90) {
            chain = ['Movies', 'Duration', '~1 Hour', title];
        } else if (info.duration >= 90 && info.duration < 150) {
            chain = ['Movies', 'Duration', '~2 Hours', title];
        } else if (info.duration >= 150 && info.duration < 210) {
            chain = ['Movies', 'Duration', '~3 Hours', title];
        } else if (info.duration >= 210) {
            chain = ['Movies', 'Duration', 'Loong', title];
        }
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Movies', 'Duration', 'Unsorted', title];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.dimensions) {
        if (info.dimensions.width <= 640 && info.dimensions.height <= 360) {
            chain = ['Movies', 'Quality', 'nHD (640x360)', title];
        } else if (info.dimensions.width <= 800 && info.dimensions.height <= 600) {
            chain = ['Movies', 'Quality', 'SVGA (800x600)', title];
        } else if (info.dimensions.width <= 1024 && info.dimensions.height <= 768) {
            chain = ['Movies', 'Quality', 'XGA (1024x768)', title];
        } else if (info.dimensions.width <= 1280 && info.dimensions.height <= 800) {
            chain = ['Movies', 'Quality', 'WXGA (1280x800)', title];
        } else if (info.dimensions.width <= 1280 && info.dimensions.height <= 1024) {
            chain = ['Movies', 'Quality', 'SXGA (1280x1024)', title];
        } else if (info.dimensions.width <= 1360 && info.dimensions.height <= 768) {
            chain = ['Movies', 'Quality', 'HD (1360x768)', title];
        } else if (info.dimensions.width <= 1440 && info.dimensions.height <= 900) {
            chain = ['Movies', 'Quality', 'WXGA+ (1440x900)', title];
        } else if (info.dimensions.width <= 1600 && info.dimensions.height <= 900) {
            chain = ['Movies', 'Quality', 'HD+ (1600x900)', title];
        } else if (info.dimensions.width <= 1680 && info.dimensions.height <= 1050) {
            chain = ['Movies', 'Quality', 'WSXGA+ (1680x1050)', title];
        } else if (info.dimensions.width <= 1920 && info.dimensions.height <= 1080) {
            chain = ['Movies', 'Quality', 'FHD (1920x1080)', title];
        } else if (info.dimensions.width <= 1920 && info.dimensions.height <= 1200) {
            chain = ['Movies', 'Quality', 'WUXGA (1920x1200)', title];
        } else if (info.dimensions.width <= 2048 && info.dimensions.height <= 1152) {
            chain = ['Movies', 'Quality', 'QWXGA (2048x1152)', title];
        } else if (info.dimensions.width <= 2560 && info.dimensions.height <= 1440) {
            chain = ['Movies', 'Quality', 'QHD (2560x1440)', title];
        } else if (info.dimensions.width <= 3840 && info.dimensions.height <= 2160) {
            chain = ['Movies', 'Quality', '4K UHD (3840x2160)', title];
        } else {
            chain = ['Movies', 'Quality', 'Other', title];
        }
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Movies', 'Quality', 'Unsorted', title];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.certified) {
        chain = ['Movies', 'Certified', '' + info.certified, title];
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Movies', 'Certified', 'Unsorted', title];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.imdbRating) {
        chain = ['Movies', 'Rating', '' + info.imdbRating, title];
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Movies', 'Rating', 'Unsorted', title];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.imdbVotes) {
        if (info.imdbVotes >= 500000) {
            chain = ['Movies', 'Votes', '500000+', title];
        } else if (info.imdbVotes >= 400000) {
            chain = ['Movies', 'Votes', '400000+', title];
        } else if (info.imdbVotes >= 300000) {
            chain = ['Movies', 'Votes', '300000+', title];
        } else if (info.imdbVotes >= 200000) {
            chain = ['Movies', 'Votes', '200000+', title];
        } else if (info.imdbVotes >= 100000) {
            chain = ['Movies', 'Votes', '100000+', title];
        } else if (info.imdbVotes >= 70000) {
            chain = ['Movies', 'Votes', '70000+', title];
        } else if (info.imdbVotes >= 30000) {
            chain = ['Movies', 'Votes', '30000+', title];
        } else if (info.imdbVotes >= 10000) {
            chain = ['Movies', 'Votes', '10000+', title];
        } else if (info.imdbVotes >= 7000) {
            chain = ['Movies', 'Votes', '7000+', title];
        } else if (info.imdbVotes >= 3000) {
            chain = ['Movies', 'Votes', '3000+', title];
        } else if (info.imdbVotes >= 1000) {
            chain = ['Movies', 'Votes', '1000+', title];
        } else {
            chain = ['Movies', 'Votes', 'Defunct', title];
        }
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Movies', 'Votes', 'Unsorted', title];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.genre) {
        info.genre.forEach(function (genre) {
            chain = ['Movies', 'Genre', '' + genre, title];
            addCdsObject(obj, createContainerChain(chain));
        });
    } else {
        chain = ['Movies', 'Genre', 'Unsorted', title];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.director) {
        info.director.forEach(function (director) {
            chain = ['Movies', 'Director', '' + director, title];
            addCdsObject(obj, createContainerChain(chain));
        });
    } else {
        chain = ['Movies', 'Director', 'Unsorted', title];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (info.writer) {
        info.writer.forEach(function (writer) {
            chain = ['Movies', 'Writer', '' + writer, title];
            addCdsObject(obj, createContainerChain(chain));
        });
    } else {
        chain = ['Movies', 'Writer', 'Unsorted', title];
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
    var movieMetrics = grabVideoMetrics(obj);
    if (movieMetrics.duration && movieMetrics.duration <= 10) {
        print('[video] Skipping item - too short (<10); file: ', obj.location);
        return;
    }
    if (!movieMetrics.dimensions) {
        print('[video] Skipping item - no dimensions; file: ', obj.location);
        return;
    }

    var movieInfo;
    var movieDetails;
    var movieGuess = grabVideoInfo(obj);
    if (!movieGuess) {
        print('[video] Partial item - no incomplete info: ', obj.location);
        movieInfo = getVideoFileInfo(obj.location)
    } else {
        movieInfo = movieGuess.movieInfo;
        movieDetails = movieGuess.movieDetails;
    }

    if (!movieInfo) {
        print('[video] Skipping item - no movie info: ', obj.location);
        return;
    }

    //print('[video] Processing item; file: ', obj.location, ' (' + obj.mimetype + ')');

    var mtmp;
    var minfo = {
        type: movieInfo.type,
        title: movieInfo.title,
        year: +movieInfo.year,
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
          season: +movieInfo.season,
          episode: +movieInfo.episode,
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

    if (movieInfo.type === 'episode') {
        minfo.episode.duration = movieMetrics.duration;
        minfo.episode.dimensions = movieMetrics.dimensions;
    } else {
        minfo.duration = movieMetrics.duration;
        minfo.dimensions = movieMetrics.dimensions;
    }

    if (movieDetails) {
        minfo.type = movieDetails.type;
        minfo.title = movieDetails.title;
        mtmp = (movieDetails.year || '').match(/(\d+)(?:\-(\d+))?/);
        if (mtmp) {
            minfo.year = +mtmp[0];
            minfo.complete = +mtmp[1];
        }
        if (minfo.complete) {
            minfo.seasons = movieDetails.total_seasons;
            minfo.episodes = movieDetails.total_episodes; // Hypothetic nonexisting property
        }
        mtmp = (movieDetails.runtime || '').match(/(\d+)/)
        if (mtmp)
            minfo.duration = +mtmp[0];
        minfo.certified = movieDetails.rated;
        minfo.genre = (movieDetails.genre || '').split(/, /);
        minfo.director = (movieDetails.director || '').split(/, /);
        minfo.writer = (movieDetails.writer || '').split(/, /).map(function (writer) {
            var name = writer.match(/[^\(\[\)\]]+/);
            if (!name)
                return;
            return name[0].trim();
        }).filter(function (writer) {
            return !!writer;
        });
        minfo.imdbRating = +movieDetails.imdb_rating;
        minfo.imdbVotes = +(movieDetails.imdb_votes || '').replace(',', '');

        if (movieDetails.specific) {
            minfo.episode.title = movieDetails.specific.title;
            mtmp = +movieDetails.specific.year;
            if (mtmp)
                minfo.episode.year = mtmp;
            mtmp = (movieDetails.specific.runtime || '').match(/(\d+)/)
            if (mtmp)
                minfo.episode.duration = +mtmp[0];
            minfo.episode.certified = movieDetails.specific.rated;
            minfo.episode.genre = (movieDetails.specific.genre || '').split(/, /);
            minfo.episode.director = (movieDetails.specific.director || '').split(/, /);
            minfo.episode.writer = (movieDetails.specific.writer || '').split(/, /).map(function (writer) {
                var name = writer.match(/[^\(\[\)\]]+/);
                if (!name)
                    return;
                return name[0].trim();
            }).filter(function (writer) {
                return !!writer;
            });
            minfo.episode.imdbRating = +movieDetails.specific.imdb_rating;
            minfo.episode.imdbVotes = +(movieDetails.specific.imdb_votes || '').replace(',', '');
        }
    }

    switch (minfo.type) {
        case 'movie':
            if (movieMetrics.duration && movieMetrics.duration <= 45) {
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
