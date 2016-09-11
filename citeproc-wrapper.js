var fs  = require('fs');
var path = require('path');
var CSL = require('./src/citeproc.js').CSL;

function Citeproc (preferredLocale, styleDir, styleFile, citations, done) {
    
    // localeDir (hard-wired)
    localeDir = "locales";
    
    // styleDir
    pathToStyleFile = path.join(styleDir, styleFile);
    
    // localeIDs global
    localeIDs = [];

    // Constructs the wrapper
    this.construct = function () {
        var self = this;
        self.loadStyle(pathToStyleFile, function () {
            self.setupSys();
            self.loadLocales(function () {
                citeproc = new CSL.Engine(sys, style, preferredLocale);
                done(citeproc);
            });
        });
    }

    // The internal CSL.Engine object 
    var citeproc;

    // Implements retrieveLocale and retrieveItem
    var sys;

    // Holds the content of a .csl file 
    var style;
    
    // All the added references which will be formatted
    var citations = citations;
    
    // Holds the content of a locales-*-*.xml file
    var locale;
    
    // Extract locale IDs from serialized style XML
    
    // Normalize locale IDs

    // Rigs up the sys object for the internal citeproc
    this.setupSys = function () {
        sys = {
            retrieveLocale: function (language) {
                return locales[language];
            },
            retrieveItem: function (id) {
                return citations[id];
             }
        };
    }

    this.loadStyle = function (file, done) {
        var self = this;
        fs.readFile(file, function (err, data) {
            if (err) return done(err);
            style = data.toString();
            localeIDs = CSL.getLocaleNames(style, preferredLocale);
            return done();
        });
    }

    this.loadLocales = function (done) {
        locales = {};
        this.loadOneLocale(0, done);
    }

    this.loadOneLocale = function (pos, done) {
        if (pos === localeIDs.length) {
            done();
            return;
        }
        var self = this;
        fs.readFile(path.join(localeDir, "locales-" + localeIDs[pos] + ".xml"), function (err, data) {
            if (err) return done(err);
            locales[localeIDs[pos]] = data.toString();
            self.loadOneLocale(pos+1, done);
        });
        
    }

    this.construct();
}

module.exports = Citeproc;
