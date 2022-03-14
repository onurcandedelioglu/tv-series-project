// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"detailspage/details.js":[function(require,module,exports) {
var baseEndpoint = "https://api.tvmaze.com";
var params = new URLSearchParams(window.location.search);
var isTvShows = params.has('id');

if (isTvShows) {
  var seriesId = params.get('id');
  showDetail(seriesId);
}

var selectBox = document.querySelector('[data-select]');
var subject = document.querySelector('[data-subject]');
var summaryButton = document.querySelector("[data-summary-button]");

function showDetail(id) {
  //SHOW DETAILS
  var detailsEndpoint = "".concat(baseEndpoint, "/shows/").concat(id);
  fetch(detailsEndpoint).then(function (response) {
    if (!response.ok) {
      throw "There were no results";
    }

    return response.json();
  }).then(function (response) {
    var seriesImage = response.image.medium;
    var img = document.querySelector('[data-image]');
    img.src = seriesImage;
    var seriesName = response.name;
    var name = document.querySelector('[data-name]');
    name.innerHTML = seriesName.toUpperCase();
    var summary = response.summary;
    summary = summary.replace(/<p[^>]*>/g, "");
    summary = summary.replace(/<\/?p[^>]*>/g, "");
    var summarySection = "\n            <div data-summary-text class=\"details__summarytext\"><p class=\"details__text\">".concat(summary, "</p></div>\n        ");
    subject.insertAdjacentHTML("afterbegin", summarySection);
    var summaryTextArea = document.querySelector('[data-summary-text]');
    var summaryTextHeight = summaryTextArea.offsetHeight;

    if (summaryTextHeight > 360) {
      summaryButton.classList.add('-activeButton');
    }
  }).catch(function (error) {
    subject.innerHTML = "This Tv Show Faulty.";
  }); //CAST

  var castEndpoint = "".concat(baseEndpoint, "/shows/").concat(id, "/cast");
  fetch(castEndpoint).then(function (response) {
    if (!response.ok) {
      throw "There were no results";
    }

    return response.json();
  }).then(function (response) {
    var castParent = document.querySelector('[data-cast]');
    var cast = response;
    var count = 0;
    cast.forEach(function (item) {
      if (count > 5) return false;
      var castImage = item.person.image.medium;
      var castName = item.person.name;
      var characterName = item.character.name;
      var castAside = "\n                <div class=\"details__info\">\n                    <img class=\"details__castimage\" src=\"".concat(castImage, "\">\n                    <p class=\"details__castname\">").concat(castName, "</p>\n                    <p class=\"details__charactername\">").concat(characterName, "</p>\n                </div>\n            ");
      castParent.insertAdjacentHTML("beforeend", castAside);
      count++;
    });
  }).catch(function (error) {// let castParent = document.querySelector('[data-cast]');
    // let errorHandle = `
    // <p class="error__handle">Cast Not Found.</p>
    // `;
    // castParent.insertAdjacentHTML("beforeend", errorHandle);
  }); //SEASON

  var seasonEndpoint = "".concat(baseEndpoint, "/shows/").concat(id, "/seasons");
  fetch(seasonEndpoint).then(function (response) {
    if (!response.ok) {
      throw "There were no results";
    }

    return response.json();
  }).then(function (response) {
    var seasonParent = document.querySelector('[data-season]');
    var season = response;
    season.forEach(function (item) {
      var number = item.number;
      var premiereDate = item.premiereDate;
      var seasonId = item.id;
      if (premiereDate == null) return; //continue ve break yapılamıyor.

      var seasonAside = "\n                <button data-button data-season-number=\"".concat(number, "\" data-season-episode-id=\"").concat(seasonId, "\" class=\"season__button\">\n                    <span class=\"season__number\"> Season ").concat(number, "</span>\n                    <span class=\"season__date\">").concat(premiereDate, "</span>\n                </button>\n            ");
      seasonParent.insertAdjacentHTML("beforeend", seasonAside);
      var selectBoxOption = "\n                <option data-option class=\"season__option\" select-season-number=\"".concat(number, "\" select-season-episode-id=\"").concat(seasonId, "\">Season ").concat(number, "\n                </option>\n            ");
      selectBox.insertAdjacentHTML("beforeend", selectBoxOption);
    });
    var seasonButton = document.querySelectorAll('[data-button]');
    seasonButton.forEach(function (button) {
      button.addEventListener('click', selectSeason);
    });
    seasonButton[0].classList.add("-selectedSeason");
    getSummary(season[0].id, season[0].number);
    getEpisodes(season[0].id);
  }).catch(function (error) {// let seasonParent = document.querySelector('[data-season]');
    // let errorHandle = `
    // <p class="error__handle">Season Not Found.</p>
    // `;
    // seasonParent.insertAdjacentHTML("beforeend", errorHandle);
  });
}

var seasonSection = document.querySelector("[data-scroll]");

function selectSeason(event) {
  seasonSection.scrollIntoView(true);
  var buttons = document.querySelectorAll('[data-button]');
  buttons.forEach(function (item) {
    item.classList.remove("-selectedSeason");
  });
  var pressedButton = event.target;
  pressedButton.classList.add("-selectedSeason");
  var seasonNumber = pressedButton.getAttribute('data-season-number');
  var seasonNumberItem = document.querySelector('[data-season-episode]');
  seasonNumberItem.innerHTML = "Season ".concat(seasonNumber);
  var seasonEpisodeId = pressedButton.getAttribute('data-season-episode-id');
  getSummary(seasonEpisodeId, seasonNumber);
  getEpisodes(seasonEpisodeId);
  var episodeSeason = document.querySelectorAll('[data-episode-aside]');
  episodeSeason.forEach(function (item) {
    item.remove();
  });
}

function getSummary(seasonEpisodeId, seasonNumber) {
  var seasonEndpoint = "".concat(baseEndpoint, "/seasons/").concat(seasonEpisodeId);
  var summaryItem = document.querySelector('[data-summary]');
  var seasonNumberItem = document.querySelector('[data-season-episode]');
  seasonNumberItem.innerHTML = "Season ".concat(seasonNumber);
  fetch(seasonEndpoint).then(function (response) {
    if (!response.ok) {
      throw "There were no results";
    }

    return response.json();
  }).then(function (response) {
    summaryItem.innerHTML = response.summary;
  }).catch(function (error) {// let summaryItem = document.querySelector('[data-summary]');
    // summaryItem.innerHTML = `Season Summary Not Found.`;
  });
}

var seriesPicture = document.querySelector('[data-image]').src;

function getEpisodes(seasonEpisodeId) {
  var seasonEpisodesEndpoint = "".concat(baseEndpoint, "/seasons/").concat(seasonEpisodeId, "/episodes");
  fetch(seasonEpisodesEndpoint).then(function (response) {
    if (!response.ok) {
      throw "There were no results";
    }

    return response.json();
  }).then(function (response) {
    var episodeParent = document.querySelector('[data-episode]');
    var episode = response;
    var errorsEpisodes = document.querySelectorAll('[data-error]');
    errorsEpisodes.forEach(function (item) {
      item.remove();
    });
    episode.forEach(function (item) {
      var episodeNumber = item.number;
      var episodeName = item.name;
      var episodeImage;
      if (item.image == null) episodeImage = document.querySelector("[data-image]").src;else episodeImage = item.image.medium;

      if (episodeNumber == null) {
        episodeNumber = "Special";
      }

      var episodeAside = "\n                <div data-episode-aside=".concat(episodeNumber, " class=\"season__episodeaside\">\n                    <div class=\"season__episodeitem\" style=\"background-image:url(").concat(episodeImage, ")\">\n                        <h2 class=\"season__episodenumber\">Episode ").concat(episodeNumber, "</h2>\n                    </div>\n                    <h2 class=\"season__episodename\">").concat(episodeName, "</h2>\n                </div>\n                    ");
      episodeParent.insertAdjacentHTML("beforeend", episodeAside);
    });
  }).catch(function (error) {// let episodeParent = document.querySelector('[data-episode]');
    // let errorHandle = `
    // <p data-error class="error__handle">Episodes Not Found.</p>
    // `
    // episodeParent.insertAdjacentHTML("beforeend", errorHandle);
  });
}

var detailSubject = document.querySelector('[details-subject]');
summaryButton.addEventListener('click', showMore);

function showMore() {
  var isPressedButton = summaryButton.getAttribute("data-summary-button");

  if (isPressedButton == "true") {
    subject.classList.add("-active");
    detailSubject.classList.add('-removeafter');
    summaryButton.setAttribute("data-summary-button", "false");
    summaryButton.innerHTML = "Less Show";
    return false;
  }

  subject.classList.remove("-active");
  detailSubject.classList.remove('-removeafter');
  summaryButton.setAttribute("data-summary-button", "true");
  summaryButton.innerHTML = "Read More";
  detailSubject.scrollIntoView(true);
  return true;
}

function selectBoxSeason(event) {
  seasonSection.scrollIntoView(true);
  var seasonIndex = selectBox.options[selectBox.selectedIndex];
  var seasonId = seasonIndex.getAttribute("select-season-number");
  var seasonEpisodeId = seasonIndex.getAttribute("select-season-episode-id");
  getSummary(seasonEpisodeId, seasonId);
  getEpisodes(seasonEpisodeId);
  var episodeSeason = document.querySelectorAll('[data-episode-aside]');
  episodeSeason.forEach(function (item) {
    item.remove();
  });
}

selectBox.addEventListener('change', selectBoxSeason);
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54368" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","detailspage/details.js"], null)
//# sourceMappingURL=/details.fb0ceafe.js.map