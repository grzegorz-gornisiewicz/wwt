var db = require('../db'),
        GameObject = require('../models/gameobject.js'),
        Session = require('../models/session.js');

exports.details = function (req, res) {
    console.log("called details: " + JSON.stringify(req.params));
    var session_id = new Buffer(req.get("token"), 'base64');

    console.log("Session " + session_id);

    Session.findOne({ _id: session_id }, function(err, session) {
        if (err || session === null) {
            console.log("Session " + session_id + " not found.");
            res.json({status: false, err: err});
            return console.error(err);
        }

        console.log("Session details: " + session);

        GameObject.findOne({ name: req.body.name }, function(err, item) {
            if (err || item === null) {
                console.log("GameObject " + req.body.name + " not found.");
                res.json({status: false, err: err});
                return console.error(err);
            }

            res.json({status: true, details: item});
            console.log("GameObject details" + item);
        });
        return;
    });
};

exports.list = function (req, res) {
    GameObject.find(function (err, items) {
        if (err) {
            res.json({status: false, err: err});
            return console.error(err);
        }

        //remember about context lose outside the function
        var itemsJSON = new Array();

        items.forEach(function (item) {
            itemsJSON.push(item);//{id: item.id, name: item.name, created: item.created, updated: item.updated, from: item.from, to: item.to, founder: item.founder});
        });

        res.json({status: true, items: itemsJSON});
    });
};

exports.create = function (req, res) {
    console.log('req.body: ' + req.body);

    GameObject.findOne({ name: req.body.name }, function(err, route) {
        if (err || route !== null) {
            console.log("GameObject " + req.body.name + " already created.");
            if (route !== null) {
                res.json({status: false, err: "GameObject " + req.body.name + " already created."});
            } else {
                res.json({status: false, err: err.errmsg});
            }
            return console.error(err);
        }

        var item = new GameObject({name: req.body.name, owner: req.body.owner});
        item.save(function (err) {
            if (err) {
                res.json({status: false, err: err.errmsg});
                return console.error(err);
            }
            //saved!
            res.json({status: true});
        });
        console.log("New GameObject details:" + item);
    });
};
