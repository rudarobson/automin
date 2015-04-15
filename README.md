# automin
test
> A Front end development plugin providing, templates, easy replacement of <script> <link> and static resources tags for deployment and debugging, a template engine similar to custom tags of web components (static generation of html using custom tags), and a lot more
Fully Customizable.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install automin --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('automin');
```

and load dependencies.
```js
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-clean');
```
## The "build-block" task
## Files used
```
+-- Gruntfile.js
+-- src/
|   +-- index.html
|   +-- scripts/
|   |   +-- file1.js
|   |   +-- file2.js
+-- a/root/path
|   +-- file1.js
|   +-- file2.js
```
### Overview
build-block calculates the path relative to the current processing html, so a root option is needed.
must run theses tasks with these targets
```
concat:automin
uglify:automin
cssmin:automin
clean:build-block
```

```js
grunt.initConfig({
  'build-block': {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.root
Type: `String`
Required: `true`

A string value that is used for search as the root in script,link, and other resource tags being built.
ex:
```js{
    options: 'a/Root/Path'
}
```
```html
<!-- build:js built_file.js -->
&lt;script...src="/file1.js"...&gt;
&lt;script...src="/file2.js"...&gt;
<!-- /build -->
```
files would be  a/Root/Path/file1.js and a/RootPath/file2.s
relative to the Gruntfile.js (path running the console)
#### options.tmp
Type: `String`
Default value: `'.tmp'`

A string value that is used as path for temporary files

### Usage Examples

```js{
    options: 'a/Root/Path'
}
```
```html
<!-- build:js built_file.js -->
&lt;script...src="/file1.js"...&gt;
&lt;script...src="/file2.js"...&gt;
<!-- /build -->
```

would generate

```
+-- Gruntfile.js
+-- src/
|   +-- index.html
+-- a/root/path
|   +-- file1.js
|   +-- file2.js
```
#### Default Options
Html
```html
```

```js
grunt.initConfig({
  'build-block': {
    options: {
        tmp:'.tmp',
        root:'src'
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

#License
A custom license, read please ;).

##Everything is undex development, including documentation, readme.md etc.
