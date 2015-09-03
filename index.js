
var Promise = require("bluebird");
var execAsync = Promise.promisifyAll(require('child_process')).execAsync;
var BowerRegistry = require('bower-registry-client');
Promise.promisifyAll(BowerRegistry.prototype);
var bower = new BowerRegistry({ cache: false });


packageNames = process.argv.slice(2);

Promise.all(packageNames.map(downloadPackage)).finally(function () {
    process.exit();
});

function downloadPackage(packageName) {
    if (downloadPackage.downloaded === undefined) {
        downloadPackage.downloaded = {};
    }

    if (downloadPackage.downloaded[packageName] === undefined) {
        downloadPackage.downloaded[packageName] = 'STARTED';
        return bower.lookupAsync(packageName).then(function (packageInfo) {
            return execAsync('git clone ' + packageInfo.url + ' ' + packageName + ' --bare');
        }).then (function () {
            return execAsync('git show HEAD:bower.json', { cwd: packageName });
        }).then(function (stds) {
            var stdout = stds[0];
            return JSON.parse(stdout);
        }).then(function (json) {
            var downloads = Object.keys(json.dependencies || {}).map(function (dependecy) {
                return downloadPackage(dependecy);
            });
            downloadPackage.downloaded[packageName] = 'FINISHED';
            console.log(packageName, ': Download Finished');
            return downloads
        }).spread(function () {
            return true;
        }, function (error) {
            downloadPackage.downloaded[packageName] = 'ERROR';
            console.error(packageName, ':', error);
            return false;
        });
    }
    else {
        return Promise.resolve(true);
    }
}