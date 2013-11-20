#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    join = path.join,
    cwd = process.cwd(),
    pkgPath = join(cwd, 'package.json'),
    nmPath = join(cwd, 'node_modules');

if(!fs.existsSync(pkgPath)) {
    console.error('\x1B[31mConnot find package.json in current directory\x1B[39m');
    process.exit(1);
}


var pkgJSON = require(pkgPath),
    deps = pkgJSON.dependencies;



if(!fs.existsSync(nmPath)) {
    console.error('\x1B[31mPlease run \'npm install\' first\x1B[39m');
    process.exit(1);
}

Object.keys(deps).forEach(function(pkg) {
    var version = deps[pkg];
    if(!version || /^\s*$/.test(version))
        deps[pkg] = "~" + require(join(nmPath, pkg, 'package.json')).version;
});

fs.writeFileSync(pkgPath, JSON.stringify(pkgJSON, null, 4));
console.log('\x1B[32mdone!\x1B[39m');




    
