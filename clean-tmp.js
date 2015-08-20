
exec = require('child_process').exec;
fs = require('fs');

fs.readdirSync('tmp').forEach(function (file) {
    if (file[0] !== '.') {
        exec('rmdir tmp\'' + file + ' /s', function (err) {
            if (err) {
                console.error(err)
            }
        })
    }
});

