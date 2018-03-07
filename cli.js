#!/usr/bin/env node
const program = require('commander');
const fse = require("fs-extra");
const path = require("path");

const packageJson = (start) => {
	if(start == "/") return;

	if(fse.existsSync(start+"/package.json")){
		return require(start+"/package.json");
	} else {
		return packageJson(path.dirname(start));
	}
}

program
	.option('-o, --out-dir <dir>', 'output folder [build]', 'build')
	.option('-s, --src <dir>', 'source folder [src]', 'src')
	.option('-m, --main <main>', 'name of the main script inside src [index.js]', 'index.js')
	.option('-b, --bundle <bundle>', 'bundle identifier [my.proton.application]', 'my.proton.application')
	.option('-i, --icon <icon>', 'icns file to use as app icon', __dirname + "/Icon.icns")
	.option('-v, --version <ver>', 'version of the app [package.json: version]')
	.option('--no-transpile', 'don\'t transpile source files using babel')
	.option('-f, --force', 'overwrite old package')
	.command('mac <AppName>').description("create a macOS .app bundle")
	.action((app, cmd)=>{
		const version = typeof program.version === "function" ? 
							(packageJson(process.cwd()+"/"+program.src) || {version:"0.0.0"}).version
						  : program.version;

		require("./src/mac")({
			app,
			outDir: program.outDir,
			bundleId: program.bundle,
			src: program.src,
			main: program.main,
			icon: program.icon,
			override: program.force,
			transpile: program.transpile
		})
	})

program.parse(process.argv);

if (program.args.length < 2) {
  program.help();
}

// let args = process.argv.splice(2);

// let APPNAME;
// let SRCDIR = "src";
// let MAIN = "index.js";
// let OVERRIDE = args.includes("-f");

// args = args.filter(v => v !== "-f")

// if(args.length >= 1 && args.length <= 3){
// 	APPNAME = args[0];
// 	if(args.length >= 2){
// 		SRCDIR = args[1];
// 		if(args.length == 3){
// 			MAIN = args[2];
// 		}
// 	}
// } else {
// 	console.error(
// "Usage:\n\
// 	proton-package AppName [src folder name] [main.js]\
// ");
// 	return 1;
// }
