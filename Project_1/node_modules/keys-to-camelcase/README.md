# keys-to-camelcase

[![Build Status](https://travis-ci.org/JonShort/keys-to-camelcase.svg?branch=master)](https://travis-ci.org/JonShort/keys-to-camelcase)

:building_construction: Convert object keys to camelCase using [`camelcase`](https://github.com/sindresorhus/camelcase) :building_construction:

:thumbsup: Can be used within node or the browser :thumbsup:

:rocket: This fork plays nicely with tools like [uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) :rocket:

## Install

npm

```
$ npm install --save keys-to-camelcase
```

Yarn

```
$ yarn add keys-to-camelcase
```

## Usage

```js
const keysToCamelcase = require('keys-to-camelcase');

// Convert an object
keysToCamelcase({ 'foo-bar': true });
//=> {fooBar: true}

// Convert an array of objects
keysToCamelcase([{ 'foo-bar': true }, { 'bar-foo': false }]);
//=> [{fooBar: true}, {barFoo: false}]

keysToCamelcase(
  { 'foo-bar': true, nested: { unicorn_rainbow: true } },
  { deep: true }
);
//=> {fooBar: true, nested: {unicornRainbow: true}}
```

```js
const keysToCamelcase = require('keys-to-camelcase');

const argv = require('minimist')(process.argv.slice(2));
//=> {_: [], 'foo-bar': true}

keysToCamelcase(argv);
//=> {_: [], fooBar: true}
```

## API

### keysToCamelcase(input, [options])

#### input

Type: `Object` `Object[]`

Object or array of objects to camelCase.

#### options

Type: `Object`

##### exclude

Type: `string[]` `RegExp[]`<br>
Default: `[]`

Exclude keys from being camelCased.

e.g.

```js
keysToCamelcase({ 'foo-bar': true, 'bar-foo': true }, { exclude: [/^f/] });
//=> { 'foo-bar': true, barFoo: true }
```

##### deep

Type: `boolean`<br>
Default: `false`

Recurse nested objects and objects in arrays.

e.g.

```js
keysToCamelcase(
  { 'foo-bar': true, 'another-one': { 'bar-foo': false } },
  { deep: true }
);
//=> { fooBar: true, anotherOne: { barFoo: false }}
```

## Related

- [snakecase-keys](https://github.com/bendrucker/snakecase-keys) - Convert an object's keys to snake case
- [camelcase-keys](https://github.com/sindresorhus/camelcase-keys) - The original project which was forked to create keys-to-camelcase

## License

MIT © [Sindre Sorhus](https://sindresorhus.com)  
MIT © [Jon Short](https://jonshort.me)
