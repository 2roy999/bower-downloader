
BowerRegistry = require('bower-registry-client');
fs = require('fs');

//registry = BowerRegistry({ cache: false });

packageName = process.argv[2];

downloadPackage(packageName);

function downloadPackage(packageName) {
    fs.exists(packageName, function (exists) {
        if (!exists) {
        }
    })
}
