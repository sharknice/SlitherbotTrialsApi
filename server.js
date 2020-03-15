var express = require('express');
var fs = require('fs');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(express.json());

var rawdata = fs.readFileSync('bot-default-options.json');
var defaultOptions = JSON.parse(rawdata);

rawdata = fs.readFileSync('trials.json');
var trials = JSON.parse(rawdata);

var trialIndex = 0;
var trialCount = 0;

app.put('/results', function (req, res) {
    if (req.body) {
        fs.writeFile('data/' + Date.now() + '.json', JSON.stringify(req.body), (err) => {
            if (err) throw err;
            res.send(getOptions());
        });
    }
});

app.listen(3000, function () {
    console.log("slitherbotapi listening at on port localhost:3000");
});

function getOptions() {
    var options = { options: defaultOptions };
    if (trialIndex < trials.length) {
        var trial = trials[trialIndex];
        if(trialCount < trial.attempts) {
            options.options = {...defaultOptions, ...trial.options }
            trialCount++;
        } else {
            trialCount = 0;
            trialIndex++;
            return getOptions();
        }
    }
    return options;
}