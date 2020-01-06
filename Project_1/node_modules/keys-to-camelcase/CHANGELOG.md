# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2018-09-12

### Changed

- Updated source code to ES6 - made more readable
- Rollup bundle config update
- Updated dependencies, fixes nested array bug

## [1.0.1] - 2018-09-08

### Added

- Rollup build configuration
- Changelog

### Changed

- Babel configuration no longer minifies output

### Removed

- Benchmarking system using `matcha`
- .npmignore

## [1.0.0] - 2018-09-07

### Added

- Babel transpilation of source code
- Prettier configuration & hooks

### Changed

- Improve tests, made more verbose & single-responsibility
- Updated licenses to relate to the fork
- Rename project to `keys-to-camelcase` instead of `camelcase-keys`

### Removed

- `xo` style linting
