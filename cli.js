#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    join = path.join,
    cwd = process.cwd(),
    pkgPath = join(cwd, 'package.json'),
    nmPath = join(cwd, 'node_modules');

var argv = process.argv;

var fixed = false;

argv.forEach(function(opt) {
    if(opt == '-f' || opt == '--fixed')
        fixed = true;
});

if(!fs.existsSync(pkgPath)) {
    console.error('\x1B[31mConnot find package.json in current directory\x1B[39m');
    process.exit(1);
}

var pkgJSON = require(pkgPath),
    deps = pkgJSON.dependencies, 
    devDeps = pkgJSON.devDependencies,
    optDeps = pkgJSON.optionalDependencies;


if((deps || devDeps) && !fs.existsSync(nmPath)) {
    console.error('\x1B[31mPlease run \'npm install\' first\x1B[39m');
    process.exit(1);
}

function fixDeps(deps) {
    Object.keys(deps).forEach(function(pkg) {
            var version = deps[pkg], depPkg;
        if(fixed ||!version || /^\s*$/.test(version)) {
            try {
                depPkg = require(join(nmPath, pkg, 'package.json'));
            }catch(e) {
                console.warn('\x1B[33mCan not find dep package for "' + pkg + '"\x1B[39m');
                return;
            }
            if(fixed) 
                deps[pkg] = depPkg.version;
            else
                deps[pkg] = "~" + depPkg.version;
        }
    });
}

deps && fixDeps(deps);
devDeps && fixDeps(devDeps);
optDeps && fixDeps(optDeps);

fs.writeFileSync(pkgPath, JSON.stringify(pkgJSON, null, 4));
console.log('\x1B[32mdone!\x1B[39m');





