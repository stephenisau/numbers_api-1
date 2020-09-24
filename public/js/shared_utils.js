// Utility functions shared between the client and the server

(function (exports) {
  /**
   * @return {number} in [min, max) (inclusive-exclusive).
   */
  exports.randInt = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  exports.clamp = function (min, max, num) {
    return Math.max(min, Math.min(max, num));
  };

  exports.randomIndex = function (array) {
    return exports.randInt(0, array.length);
  };

  exports.randomChoice = function (array) {
    return array[exports.randomIndex(array)];
  };

  exports.getOrdinalSuffix = function (num) {
    if (num === 11 || num == 12 || num == 13) {
      return "" + num + "th";
    } else if (num % 10 === 1) {
      return "" + num + "st";
    } else if (num % 10 === 2) {
      return "" + num + "nd";
    } else if (num % 10 === 3) {
      return "" + num + "rd";
    } else {
      return "" + num + "th";
    }
  };

  var MONTH_NAMES = "January February March April May June July August September October November December".split(
    " "
  );
  exports.dateToString = function (date) {
    return (
      MONTH_NAMES[date.getMonth()] +
      " " +
      exports.getOrdinalSuffix(date.getDate())
    );
  };

  var MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  exports.dateToDayOfYear = function (date) {
    var day = 0;
    for (var i = 0; i < date.getMonth(); ++i) {
      day += MONTH_DAYS[i];
    }
    return day + date.getDate();
  };

  exports.monthDayToDayOfYear = function (month, day) {
    var date = new Date(2004, month - 1, day);
    return exports.dateToDayOfYear(date);
  };

  exports.getStandalonePrefix = function (number, type, data) {
    data = data || {};
    if (type === "math") {
      return "" + number + " is";
    } else if (type === "trivia") {
      return "" + number + " is";
    } else if (type === "date") {
      var date = new Date(2004, 0, number);
      if (data.year) {
        if (data.year < 0) {
          return (
            exports.dateToString(date) +
            " is the day in " +
            -data.year +
            " BC that"
          );
        } else {
          return (
            exports.dateToString(date) + " is the day in " + data.year + " that"
          );
        }
      } else {
        return exports.dateToString(date) + " is the day that";
      }
    } else if (type === "year") {
      // TODO: consider different grammar for year in the past vs. year in the future
      if (number < 0) {
        return "" + -number + " BC is the year that";
      } else {
        return "" + number + " is the year that";
      }
    }
  };

  const NUM_FROM_URL_REGEX = /(-?[0-9]+)(?:\/(-?[0-9]+))?/;
  exports.getNumFromUrl = function (url) {
    const matches = NUM_FROM_URL_REGEX.exec(url);
    if (!matches) return null;

    if (matches[2]) {
      // The number is a date, convert to day of year
      return utils.dateToDayOfYear(new Date(2004, matches[1] - 1, matches[2]));
    } else {
      return parseInt(matches[1], 10);
    }
  };

  exports.changeUrlToNum = function (url, num) {
    const matches = NUM_FROM_URL_REGEX.exec(url);
    let needle = NUM_FROM_URL_REGEX;
    if (!matches) {
      needle = "random";
    }

    if (url.match(/\/date/) || (matches && matches[2])) {
      // number is a day of year, so convert to date and into m/d notation
      let date = new Date(2004, 0);
      date.setDate(num);
      num = `${date.getMonth() + 1}/${date.getDate()}`;
    }
    return url.replace(needle, num);
  };
})(typeof exports === "undefined" ? (this["utils"] = {}) : exports);
