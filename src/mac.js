const write = process.stdout.write.bind(process.stdout);
const fse = require("fs-extra");
const babel = require("babel-core");
const cmd = require("command-exists");
const { downloadNode } = require("./utils")
const { execSync } = require("child_process");


module.exports = async (options)=>{
	const app = options.app+".app";
	write("Packaging into "+app+" (src dir: '"+options.src+"', main: '"+options.main+"') ");

	if(options.override && fse.existsSync(app)){
		write("\nDeleting old package ")
		fse.removeSync(app);
	}

	write("\nCreating folder structure ");
	fse.ensureDirSync(app); write(".");
	fse.ensureDirSync(app+"/Contents"); write(".");
	fse.ensureDirSync(app+"/Contents/MacOS"); write(".");
	fse.ensureDirSync(app+"/Contents/Resources"); write(".");
	fse.ensureDirSync(app+"/Contents/Resources/app"); write(".");


	const node_path = await downloadNode(process.env.HOME+'/.proton/', /node-v[0-9]+.[0-9]+.[0-9]+-darwin-x64.tar.gz/, ".tar.gz")

	write("\nCopying node into "+app+" ");
	fse.copyFileSync(node_path, app+"/Contents/MacOS/node");

	write("\nWriting Info.plist ")
	fse.writeFileSync(app+"/Contents/Info.plist",
"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n\
<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n\
<plist version=\"1.0\">\n\
<dict>\n\
	<key>CFBundleName</key>\n\
	<string>"+options.app+"</string>\n\
	<key>CFBundleExecutable</key>\n\
	<string>main</string>\n\
	<key>CFBundleIconFile</key>\n\
	<string>Icon</string>\n\
	<key>CFBundleIdentifier</key>\n\
	<string>"+options.bundleId+"</string>\n\
	<key>CFBundleVersion</key>\n\
	<string>0.1</string>\n\
	<key>CFBundleGetInfoString</key>\n\
	<string>0.1 built by me</string>\n\
	<key>CFBundleShortVersionString</key>\n\
	<string>0.1</string>\n\
</dict>\n\
</plist>\n");

	write("and node wrapper ");
	fse.writeFileSync(app+"/Contents/MacOS/main",
'#!/bin/sh\n\
DIR=$(dirname "$0")\n\
"$DIR/node" "$DIR/../Resources/app/'+options.src+'/'+options.main+'"\n', {mode: 0o755});

	write("\nCopying application files ");
	fse.copySync(options.icon, app+"/Contents/Resources/Icon.icns");
	fse.readdirSync('.').forEach(file => {
		if(file.indexOf(app) == -1){
			write(".");
			if(file == "node_modules"){
				fse.readdirSync("node_modules").forEach(module => {
					const options = {};
					if(module == "libui-node"){
						options.filter = (src, dest) => src.indexOf("libui-node/build/Release") == -1
					}
					fse.copySync("node_modules/"+module, app+"/Contents/Resources/app/node_modules/"+module, options)			
				});
			} else {
				fse.copySync(file, app+"/Contents/Resources/app/"+file);
			}
		}
	});


	write("\nTranspiling source files ");
	fse.readdirSync(app+"/Contents/Resources/app/"+options.src).forEach(file => {
		write("\n\t"+options.src+"/"+file);
		fse.writeFileSync(app+"/Contents/Resources/app/"+options.src+"/"+file,
						 babel.transformFileSync(app+"/Contents/Resources/app/"+options.src+"/"+file, {ast: false}).code)
	});

	// DOESN'T WORK!
	// write("\nPruning dependencies\n");
	// const o = execSync(
	// 	cmd("yarn") ? "yarn install --silent --production --ignore-scripts --prefer-offline"
	// 				: "npm prune --production",
	// 	{cwd: process.cwd()+"/"+app+"/Contents/Resources/app"}
	// );
	// console.log(o.toString());

};
