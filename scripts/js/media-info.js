
var VIDEO_FETCH_URL = getEnv('FETCH_URL') || 'http://localhost:5000';

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

    var title = '' + info.title || 'Untitled';

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

    var title = info.title;
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

function addVideo(obj) {
  var info;
  var length;
  var width, height;
  var path = getRootPath(object_script_path, obj.location);
  var file;

  if (path.length > 0)
    file = createContainerChain(path) + '/' + obj.title;
  else
    file = obj.location;

  if (obj.res && obj.res.duration) {
    res = obj.res.duration.match(/(\d+):(\d+):(\d+)/);
    if (res)
      length = (+res[1] * 60) + (+res[2]) + (+res[3] > 0 ? 1 : 0);
  }
  if (obj.res && obj.res.resolution) {
    res = obj.res.resolution.match(/(\d+)x(\d+)/);
    if (res) {
      width = +res[1];
      height = +res[2];
    }
  }

  if (length && length <= 10) {
      print('[video] Skipping item - too short (<10); file: ', file);
      return;
  }
  if (!width || !height) {
      print('[video] Skipping item - no dimensions; file: ', file);
      return;
  }

  info = httpGetJson(VIDEO_FETCH_URL, {
    filename: file,
  });
  if (!info) {
    print('[video] Skipping item - no movie info: ', file);
    addCdsObject(obj, createContainerChain(['Unknown'].concat(path)));
    return;
  }

  switch (info.type) {
    case 'movie':
      addMovie(obj, info);
      break;
    case 'episode':
      addEpisode(obj, info);
      break;
  }
}

function addGeneric(obj, type) {
  var chain = [type];
  var path = getRootPath(object_script_path, obj.location);
  if (path.length > 0)
    chain = chain.concat(path);
  addCdsObject(obj, createContainerChain(chain));
}

var chain;
var mime = orig.mimetype.split('/')[0];

var obj = orig;
obj.refID = orig.id;

if (mime === 'video') {
  addGeneric(obj, 'Video');
  addVideo(obj);
} else {
  addGeneric(obj, 'Other');
}
