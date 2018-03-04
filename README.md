# proton-packager

Creates bundles for [proton-native](https://github.com/kusti8/proton-native).
It will download the latest node version and create a fully self-contained package.

**At the moment, only Mac app bundles are supported. Contributions are welcome!**

```
  Usage: proton-packager [options] [command]


  Commands:

    mac <AppName>

  Options:

    -h, --help             output usage information
    -s, --src <dir>        source folder [src]
    -m, --main <main>      name of the main script inside src [index.js]
    -b, --bundle <bundle>  bundle identifier [my.proton.application]
    -i, --icon <icon>      icns file to use as app icon
    -v, --version <ver>    version of the app [package.json: version]
    -f, --force            overwrite old package
```

### Examples

For a project with the structure:
```
my-app
├── node_modules
├── package.json
├── src
│   └── index.js
└── .babelrc
```
simply run 
```sh
proton-packager mac MyApp
```
to create the app bundle `MyApp.app`.

For a project with the structure:
```
proton-test
├── node_modules
├── package.json
├── application
│   └── main.js
└── .babelrc
```
use 
```sh
proton-packager mac MyApp -s application -m main.js
```
