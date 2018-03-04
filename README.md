# proton-packager

Creates bundles for [proton-native](https://github.com/kusti8/proton-native).
It will download the latest node version and create a fully self-contained package.

**At the moment, only Mac app bundles are supported. Contributions are welcome!**

It can be installed globally or locally:
```sh
yarn add --dev proton-packager // or
npm install -D proton-packager
```
You can then use it on the cli via npx
```sh
npx proton-packager mac MyApp
```
or add a script to your `package.json`:
```js
{
  "name": "my-proton-app",
  "scripts": {
    "package": "proton-packager mac MyApp -f"
  },
  ...
}
```

```

  Usage: proton-packager [options] [command]


  Commands:

    mac <AppName>

  Options:

    -h, --help             output usage information
    -o, --out-dir <dir>    output folder [build]
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

<br/>

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
