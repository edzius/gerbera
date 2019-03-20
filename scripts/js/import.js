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

var regexExt = /^(mkv|avi|mp4)$/i;
var regexLang = /^(LT|EN|RU)/i;
var regexSubs = /([A-Z]*sub)/i;
var regexYear = /^\(?(\d\d\d\d)\)?$/;
var regexCode = /^(x264|h264|web\-?rip|web\-?dl|web\-?dlrip|dvd\-?rip|b[dr]\-?rip|hd\-?rip|hdtv|720p|1080p|avc|aac|ac3|dts|divx|xvid|bluray)$/i;
var regexTime = /(\d+):(\d+):(\d+)/;
var regexView = /(\d+)x(\d+)/;
var regexSeason = /^S(\d+)/i;
var regexEpisode = /E(\d+)$/i;

function matchFileExt(value) {
    if (value.length < 3 || value.length > 4)
        return;
    var ret = value.match(regexExt);
    if (ret)
        return ret[1];
}

function matchLanguage(value) {
    if (value.length < 2 || value.length > 3)
        return;
    var ret = value.match(regexLang);
    if (ret)
        return ret[1];
}

function matchSubtitres(value) {
    var ret = value.match(regexSubs);
    if (ret)
        return ret[1];
}

function matchYear(value) {
    var ret = value.match(regexYear);
    if (ret)
        return ret[1];
}

function matchCoding(value) {
    var ret = value.match(regexCode);
    if (ret)
        return ret[1];
}

function matchSeason(value) {
    var ret = value.match(regexSeason);
    if (ret)
        return ret[1];
}

function matchEpisode(value) {
    var ret = value.match(regexEpisode);
    if (ret)
        return ret[1];
}

function processNameArray(arr) {
    var ret = {};
    var lastId;

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
            lastId = i;
        }
        if (!ret.episode && episode) {
            ret.episode = episode;
            lastId = i;
        }
    }

    ret.ok = !!lastId;

    if (lastId) {
        ret.title = arr.slice(0, lastId).join(' ');
    }

    if (obj.res && obj.res.duration) {
        var res = obj.res.duration.match(regexTime);
        if (res)
            ret.duration = new Date(null, null, null, res[1], res[2], res[3]);
    }

    if (obj.res && obj.res.resolution) {
        var res = obj.res.resolution.match(regexView);
        if (res)
            ret.resolution = {
                width: +res[1],
                height: +res[2],
            };
    }

    return ret;
}

function partitionName(name) {
    if (!name)
        return name;
    return name.split(/[ \.\-_]/);
}

function processLocation(path) {
    var parts = path.split('/');
    if (parts.length < 2)
        return;

    return parts[parts.length - 2];
}

function getMovieInfo(obj) {
    var label;
    var parts;
    var infoDir;
    var infoDat;

    label = processLocation(obj.location);
    parts = partitionName(label);
    if (parts) {
        infoDir = processNameArray(parts);
        if (infoDir.ok)
            print('Usable direcotry: ', label);
    }

    parts = partitionName(obj.title);
    if (parts) {
        infoDat = processNameArray(parts);
        if (!infoDat.ok)
            print('Cannot parse "', obj.title, '"');
    }

    if (!infoDir && !infoDat) {
        print('Cannot parse "', obj.title, '", "', label, '"');
        return {};
    }

    var result = infoDir || {};
    if (infoDir && infoDir.ok)
        result.dir = label;
    for (var key in infoDat) {
        if (!result[key])
            result[key] = infoDat[key];
    }
    return result;
}

function addMovie(obj, mov) {
    if (!mov.title) {
        chain = ['Movies', 'Unsorted'];
        addCdsObject(obj, createContainerChain(chain));
        return;
    } else {
        chain = ['Movies', 'List'];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (mov.year) {
        chain = ['Movies', 'Year', mov.year];
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Movies', 'Year', 'Unsorted'];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (mov.duration) {
        if (mov.duration.getHours() >= 3) {
            chain = ['Movies', 'Duration', '3 Hour'];
        } else if (mov.duration.getHours() >= 2 && mov.duration.getMinutes() >= 30) {
            chain = ['Movies', 'Duration', '2.5 Hour'];
        } else if (mov.duration.getHours() >= 2 && mov.duration.getMinutes() >= 0) {
            chain = ['Movies', 'Duration', '2 Hour'];
        } else if (mov.duration.getHours() >= 1 && mov.duration.getMinutes() >= 30) {
            chain = ['Movies', 'Duration', '1.5 Hour'];
        } else {
            chain = ['Movies', 'Duration', '1 Hour'];
        }
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Movies', 'Duration', 'Unsorted'];
        addCdsObject(obj, createContainerChain(chain));
    }

    if (mov.resolution) {
        if (mov.resolution.height >= 1080) {
            chain = ['Movies', 'Resolution', '1080p'];
            addCdsObject(obj, createContainerChain(chain));
        } else if (mov.resolution.height >= 720) {
            chain = ['Movies', 'Resolution', '720p'];
            addCdsObject(obj, createContainerChain(chain));
        } else {
            chain = ['Movies', 'Resolution', '*VGA'];
            addCdsObject(obj, createContainerChain(chain));
        }
    } else {
        chain = ['Movies', 'Resolution', 'Unsorted'];
        addCdsObject(obj, createContainerChain(chain));
    }
}

function addSerie(obj, mov) {
    if (!mov.dir) {
        if (!mov.title) {
            chain = ['Series', 'Unsorted'];
            addCdsObject(obj, createContainerChain(chain));
            return;
        }
        chain = ['Series', 'List', mov.title + ' ' + mov.season + (mov.year ? (' ' + mov.year) : '')];
        addCdsObject(obj, createContainerChain(chain));
    } else {
        chain = ['Series', 'List', mov.dir];
        addCdsObject(obj, createContainerChain(chain));
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

    var mov = getMovieInfo(obj);
    if (mov.season || mov.episode)
        addSerie(obj, mov);
    else
        addMovie(obj, mov);
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
