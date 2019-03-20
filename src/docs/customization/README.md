# Customization

## Config File

The DocSPA configuration should be modified by editing the `docspa.config.ts` file in the in the `src` folder.  DocSPA settings are derived from the following sources in order of least to highest priority:

- `SetttingService`
- `window.$docsify`
- `docspa.config.ts`

### Config Example

Here is a basic `docspa.config.ts` with notes:

```js
const config = {
  basePath: 'docs/',              // Where the markdown fiels are located
  homepage: 'README.md',          // Default page to load when navigating to a directrory
  sideLoad: [                     // Additional content load (can be set to false)
    '_sidebar.md',
    '_navbar.md',
    '_right_sidebar.md',
    '_footer.md'
  ],
  coverpage: '_coverpage.md',     // Coverpage to loads (can be set to false)
  plugins: [                      // Docsify plugins
    window['EditOnGithubPlugin'].create('https://github.com/swimlane/docspa/blob/master/src/docs/', null, '✎ Edit this page')
  ]
};
```

i> In the [quick start](../quickstart) the config file is located at `src/docspa.config.ts`.  The location and name of the is arbitrary but must be imported and set used as configuration for the `DocspaCoreModule`.

## Modules

The primary method for extending a DocSPA application is via [Angular modules](https://angular.io/guide/architecture-modules).  These modules should be imported to your root application module.  Often a module requires using the `forRoot(config)` syntax for supplying additional configuration information.

### `DocspaCoreModule`

This module includes the core services and components required by DocSPA.  This module should be imported using the `forRoot` static method and providing the `config` object described above.

```js { mark="3,14" }
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DocspaCoreModule } from '@swimlane/docspa-core';

import { AppComponent } from './app.component';
import { config } from '../docspa.config';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DocspaCoreModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### `MarkdownModule`

DocSPA utilizes remark for markdown parsing and, thereby, supports [remark plugins](https://github.com/remarkjs/remark/blob/master/doc/plugins.md#list-of-plugins). To include remark plugins use the `MarkdownModule` module.  The config for the `MarkdownModule` is a [unified preset](https://github.com/unifiedjs/unified#preset) with an additional property for a reporter (for example [vfile-reporter](https://github.com/vfile/vfile-reporter)).

```js { mark="3-5,16" }
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DocspaCoreModule, MarkdownModule } from '@swimlane/docspa-core';
import { preset } from '@swimlane/docspa-remark-preset';

import { AppComponent } from './app.component';
import { config } from '../docspa.config';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DocspaCoreModule.forRoot(config),
    MarkdownModule.forRoot(preset)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

#### YAML Frontmatter

Included in the default plugins is support for yaml frontmatter

```markdown
---
title: Hello
---
```

i> Various parts of DocSPA will display a page title.  By default this page title is the first heading of the page.  This can be overidden by setting the `title` in the YAML Frontmatter.

#### Blocks

<small>using [remark-custom-blocks](https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-custom-blocks)</small>

```markdown { playground }
[[note | Note]]
| This is a note

[[info | Information]]
| _TODO:_
| unit test

[[tip | *Tip*]]
| *Time* is money,
| my friend!

[[warning | **Watch Out!**]]
| A warning

[[figure | **Figure 1: Figure Title**]]
| ![Hello](../logo.png)

[[caption | **Table 1: Table Title**]]
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
```

i> The styles of these elements can be customized using CSS.  Additional custom blocks can be added by adding and configuring `remark-custom-blocks`.

#### Notices

<small>using [remark-custom-blockquotes](https://github.com/montogeek/remark-custom-blockquotes)</small>

```markdown { playground }
> This is a normal blockquote,
> nothing to see here!

i> _TODO:_
i> unit test

!> *Time* is money,
!> my friend!

?> **Watch Out!** A warning
```

i> The styles of these elements can be customized using CSS.  Additional notices can be added by adding and customizing `remark-custom-blockquotes`.

#### Code highlight

DocSPA uses [Prism](https://prismjs.com/) for syntax highlighting.

```javascript
(function () {
  console.log('Hello');
})();
```

```html
<b>hello</b>
```

```markdown
*Hello*
```

Including extensions for line numbers and line highlights.

~~~markdown { playground }
```javascript { .linenos mark="13-27" }
const config = {
  name: 'DocSPA',
  basePath: 'docs/',
  homepage: 'README.md',
  notFoundPage: '_404.md',
  sideLoad: [
    '_sidebar.md',
    '_navbar.md',
    '_right_sidebar.md',
    '_footer.md'
  ],
  coverpage: '_coverpage.md',
  plugins: [
    mermaidHook,
    tabsHook
  ]
};
```
~~~

#### Mermaid

~~~markdown { playground }
```mermaid
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
```

```mermaid
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d
        section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d
        section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d
```

```mermaid
graph LR
    A --- B
    B-->C[fa:fa-ban forbidden]
    B-->D(fa:fa-spinner);
```

~~~

i> See [mermaid docs](https://mermaidjs.github.io/) for more details on the supported syntax.

#### Math

<small>using [remark-math](https://github.com/Rokt33r/remark-math)</small>

```markdown { playground }
$$
E^2=(mc^2)^2+(pc)^2
$$
```

#### Emoji

<small>using [remark-gemoji-to-emoji](https://github.com/jackycute/remark-gemoji-to-emoji) and [remark-html-emoji-image](https://github.com/jackycute/remark-html-emoji-image)</small>

```markdown { playground }
:100: :8ball: :100:
```

#### Markdown Attributes

The default remark plugins include [remark-attr](https://github.com/arobase-che/remark-attr) which allows adding ids, styles, classes, and other atributes to markdown elements.

##### IDs

The slug for a header can be set by adding an id.

```markdown
## Heading Number Two
{ #number-2 }
```

##### Styles

```markdown { playground }
*Doc*{style="color:red; font-size: large"}*SPA*{style="color:blue"}

![](../logo.png){ style="border: 10px solid lightgrey; padding: 10px;"}
```

##### Classes

```markdown { playground }
<span class="badge note">note</span>
<span class="badge info">info</span>
<span class="badge tip" title="This is a tip">tip</span>
<span class="badge warn" title="Watch out!!">warn</span>

`note`{ .badge .note }
*info*{ .badge .info }
**tip**{ .badge .tip title="This is a tip" }
**warn**{ .badge .warn title="Watch out!!" }
```

##### Attributes

```markdown { playground }
![](../logo.png){ width="30px" data-no-zoom }

[www.swimlane.com](http://www.swimlane.com){ target="_blank" }

[ignore](./docs/README.md){ ignore }
```

### `ThemeModule`

DocSPA supports [docsify themes](https://docsify.js.org/#/themes?id=themes). To include a theme add the desired style sheet in your `index.html` file.

```html
<link rel="stylesheet" href="//unpkg.com/docsify/themes/vue.css">
<link rel="stylesheet" href="//unpkg.com/docsify/themes/buble.css">
<link rel="stylesheet" href="//unpkg.com/docsify/themes/dark.css">

<!-- compressed -->
<link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/vue.css">
<link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/buble.css">
<link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/dark.css">
<link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/pure.css">
```

Adding the `ThemeModule` allows you to override CSS variables used in internal style definition.

```js { mark="3,15-19" }
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DocspaCoreModule, ThemeModule } from '@swimlane/docspa-core';

import { AppComponent } from './app.component';
import { config } from '../docspa.config';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DocspaCoreModule.forRoot(config),
    ThemeModule.forRoot({
      theme: {
        '--theme-color': '#0074d9',
        '--theme-color-secondary-light': '#0074d92e'
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### `UseDocsifyPluginsModule`

DocSPA supports many (but not all) [docsify plugins](https://docsify.js.org/#/plugins?id=list-of-plugins).  To include docsify plugins add the `UseDocsifyPluginsModule` and a global `$docsify` and include plugin `<script>` tags in your `index.html` just like you would when running docsify.  This module will load docsify plugins and attach them to internal DocSPA hooks.

!> Not all docsify plugins are supported and in general it is preferred to use remark plugins or custom elements.

```html
<script>
  // support $docsify plugins
  window.$docsify = { plugins: [] };
</script>
<script src="//unpkg.com/docsify@4/lib/plugins/zoom-image.min.js"></script>
<script src="//unpkg.com/docsify-copy-code@2"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.10.0-beta/dist/katex.min.js"></script>
<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
```

```js { mark="3,15" }
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DocspaCoreModule, UseDocsifyPluginsModule } from '@swimlane/docspa-core';

import { AppComponent } from './app.component';
import { config } from '../docspa.config';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DocspaCoreModule.forRoot(config),
    UseDocsifyPluginsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

The following docsify plugins are known to work at this time:

#### Zoom Image

```html
<script src="//unpkg.com/docsify@4/lib/plugins/zoom-image.min.js"></script>
```

```markdown { playground }
![](../logo.png)
```

i> Add the `data-no-zoom` attribute to exclude an image `![](./logo.png){ data-no-zoom="true" }`

#### Copy Code

```html
<script src="//unpkg.com/docsify-copy-code@2"></script>
```

#### Edit on Github

```html
<script src="//unpkg.com/docsify-edit-on-github@1.0.1/index.js"></script>
<script>
  window.$docsify = { 
    plugins: [
      EditOnGithubPlugin.create('https://github.com/swimlane/docspa/blob/master/src/docs/', null, '✎ Edit this page')
    ]
  };
</script>
```

### `RuntimeContentModule`

This module enables embedding runtime Angular templates in markdown content.  As config it requires a list of Angular modules available to the runtime component.

```js { mark="3,15-21" }
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DocspaCoreModule, RuntimeContentModule } from '@swimlane/docspa-core';

import { AppComponent } from './app.component';
import { config } from '../docspa.config';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DocspaCoreModule.forRoot(config),
    RuntimeContentModule.forRoot({
      imports: [
        CommonModule,
        NgxChartsModule,
        BrowserAnimationsModule
      ]
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### `runtime-content`

A `runtime-content` component allows embedding Angular template content into the markdown.

The run time component can be added as HTML into the markdown file:

```markdown { playground }
<runtime-content context='{ "name": "World" }'>
Hello, {{name}}.
</runtime-content>
```

Or by adding `{ run }` to `HTML` fenced code:

~~~markdown { playground }
```html { run context='{ "count": 0 }' }
<button (click)="count = count + 1">Click me: {{count}}</button>
```
~~~

Use `{ playground }` to create a section containing both the code and the runtime result:

```html { playground context='{"data": [{"name":"Germany","value": 8940000},{"name":"USA","value":5000000},{"name":"France","value":7200000}]}' }
<div style="width: 100%; height: 200px">
  <ngx-charts-bar-vertical
    [legend]="true"
    [xAxis]="true"
    [yAxis]="true"
    [results]="data">
  </ngx-charts-bar-vertical>
</div>
<pre>
{{data | json}}
</pre>
```

i> The components available within a runtime element are controlled by the `RuntimeContentModule` `import` array.  These modules must also be added to your root app module.

### `EmbedStackblitzModule`

This module allows embedding stackblitz in markdown. The `embed-stackblitz` custom component may be used to embed StackBlitz projects within documentation.  The `embed-stackblitz` custom component accepts a [StackBlitz project payload](https://stackblitz.com/docs#project-payload) as the `project` input.

```js { mark="3,15" }
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DocspaCoreModule, EmbedStackblitzModule } from '@swimlane/docspa-core';

import { AppComponent } from './app.component';
import { config } from '../docspa.config';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DocspaCoreModule.forRoot(config),
    EmbedStackblitzModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

#### Examples

```markdown { playground }
<embed-stackblitz
  title='Embeded StackBlitz Project<br />DocSPA'
  project='{"template": "javascript", "files": {"index.js": "console.log(123)", "index.html": "Hello World"} }'>
</embed-stackblitz>
```

i> You may also use the `[[stackblitz]]` short-code.

or a path to a project payload (`JSON` file) in the documentation local files (relative to the document root folder):

```markdown { playground }
<embed-stackblitz
  title='Local StackBlitz Project<br />DocSPA'
  project-path="examples/folder/stackblitz">
</embed-stackblitz>
```

i> When providing a payload path, if the `files` property of the payload contains an array, this is treated as an array of relative paths from which the file content will be loaded.

You may also supply a `project-id` to to load an existing StackBlitz project:

```markdown { playground }
<embed-stackblitz
  title='Existing StackBlitz Project<br />DocSPA'
  project-id="sdk-create-project">
</embed-stackblitz>
```

If a both `project-id` and either a `project-path` or `project` input are provided, the files listed in the local project's files are treated as a a patch to the existing StackBlitz project.

```markdown { playground }
<embed-stackblitz
  title='Existing StackBlitz Project with local changes<br />DocSPA'
  project-id="sdk-create-project"
  project-path="examples/folder/stackblitz">
</embed-stackblitz>
```

## Custom Elements

DocSPA was designed to work with custom elements (part of the [web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) suite of technologies).  Once a custom component is loaded they may be embedded directly into the markdown.

i> Custom elements can be defined using `window.customElements.define` or from [angular elements](https://angular.io/guide/elements).  Many custom elements are also defined and aliased to short codes as noted below.

### `md-toc`

The `md-toc` is used to include the table of contents for a give path.

```markdown { playground }
<md-toc path="features" max-depth="2"></md-toc>
```

i> The path is always relative to the root docs folder.  Including `md-toc` without a path will load the TOC for the current page (main content).  `[[toc path="features" max-depth="2"]]` the same as the example above, however, using the shortcode `[[toc]]` (without a path) will insert TOC for the page the shortcodes is found in.

### `md-embed`

```markdown { playground }
<md-embed path="embed"></md-embed>
```

i> `[[include path="embed"]]` the same as the example above.

### `env-var`

The `env-var` component allows displaying variables defined in the `environment` property of the config file.

```markdown { playground }
DocSPA version: <env-var var="version"></env-var>
```

!> `[[var var="version"]]` the same as the example above with the exception that short-codes are block elements.  It is usally expected that `environment` property will contain the contents of your project's `environment.ts`.  `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.  The list of file replacements can be found in `angular.json`.

