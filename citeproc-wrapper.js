var fs  = require('fs');
var path = require('path');
var CSL = require('./src/citeproc.js').CSL;

function Citeproc (preferredLocale, styleDir, styleFile, citations, done) {
    
    var basePath = path.normalize('.');

    // localeDir (hard-wired)
    localeDir = path.join(basePath, "locales");
    
    // styleDir
    pathToStyleFile = path.join(styleDir, styleFile);
    

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
            self.sniffLocales(style);
            return done(); 
        });
    }

    this.sniffLocales = function() {
        stylexml = CSL.setupXml(style);
        
        localeIDs = ["en-US"];

        this.extendLocaleList(localeIDs, preferredLocale);

        var styleNode = stylexml.getNodesByName(stylexml.dataObj, "style")[0];
        var defaultLocale = stylexml.getAttributeValue(styleNode, "default-locale");
        this.extendLocaleList(localeIDs, defaultLocale);

        var nodeNames = ["layout", "if", "else-if", "condition"];
        for (var i=0,ilen=nodeNames.length;i<ilen;i++) {
            this.sniffLocaleOnOneNodeName(stylexml, localeIDs, nodeNames[i]);
        }
    }

    this.sniffLocaleOnOneNodeName = function(nodeName) {
        var nodes = stylexml.getNodesByName(stylexml.dataObj, nodeName);
        for (var i=0,ilen=nodes.length;i<ilen;i++) {
            var nodeLocales = stylexml.getAttributeValue(nodes[i], "locale");
            if (nodeLocales) {
                nodeLocales = nodeLocales.split(/ +/);
                for (var j=0,jlen=nodeLocales.length;j<jlen;j++) {
                    this.extendLocaleList(localeIDs, nodeLocales[j]);
                }
            }
        }
    }
    
    this.extendLocaleList = function(localeList, locale) {
        var forms = ["base", "best"];
        if (locale) {
            normalizedLocale = CSL.localeResolve(locale);
            for (var i=0,ilen=forms.length;i<ilen;i++) {
                if (normalizedLocale[forms[i]] && localeList.indexOf(normalizedLocale[forms[i]]) === -1) {
                    localeList.push(normalizedLocale[forms[i]]);
                }
            }
        }
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
