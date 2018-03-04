const write = process.stdout.write.bind(process.stdout);
const fse = require("fs-extra");
const path = require('path');
const request = require('request');
const rp = require('request-promise-native');
const decompress = require("decompress");


async function downloadNode(dir, regex, ext){
	write("\nFetching node binary: ");
	fse.ensureDirSync(dir);
	let node_archive = (await rp("https://nodejs.org/dist/latest/")).match(regex)[0];
	write(node_archive+" ");

	if(!fse.existsSync(dir+node_archive)){
		write("\n\tDownloading into "+dir+" ")
		await new Promise((res, rej)=>{
			request("https://nodejs.org/dist/latest/"+node_archive)
				.pipe(fse.createWriteStream(dir+node_archive))
				.on("finish", res);
			});
		write("\n\tExtracting node binary ");
		await decompress(dir+node_archive, dir, {filter: file => file.path.endsWith(path.join("bin","node"))});
	} else {
		write("\n\tSkipping, current version is already cached in "+dir+" ");
	}
	return path.join(dir, path.basename(node_archive, ext), "bin", "node");
}

module.exports = {downloadNode};
