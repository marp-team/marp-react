# @marp-team/marp-react

[![Storybook](https://raw.githubusercontent.com/storybooks/brand/master/badge/badge-storybook.svg?sanitize=true)](https://marp-react.netlify.com/)
[![CircleCI](https://img.shields.io/circleci/project/github/marp-team/marp-react/master.svg?style=flat-square&logo=circleci)](https://circleci.com/gh/marp-team/marp-react/)
[![Codecov](https://img.shields.io/codecov/c/github/marp-team/marp-react/master.svg?style=flat-square&logo=codecov)](https://codecov.io/gh/marp-team/marp-react)
[![npm](https://img.shields.io/npm/v/@marp-team/marp-react.svg?style=flat-square&logo=npm)](https://www.npmjs.com/package/@marp-team/marp-react)
[![LICENSE](https://img.shields.io/github/license/marp-team/marp-react.svg?style=flat-square)](./LICENSE)

**[Marp](https://marp.app) renderer component for React.**

## Before using Marp React

This component is suited to create presentation tools integrated with Marp by React. Marp would create the static slide contents consist of plain HTML and CSS, so you have to notice that **it's not suited to control the content of your slide via React**.

React community has more appropriate and awesome tools for such that purpose. Typically these tools should help if you want to create a beautiful slide deck via React:

- **[Spectacle]** can create and control your slide deck with React's some flexibilities.
- **[mdx-deck]** is the best alternative for creating slide deck based on [MDX]: _Markdown + React components_.

[mdx-deck]: https://github.com/jxnblk/mdx-deck
[mdx]: https://mdxjs.com/
[spectacle]: https://github.com/FormidableLabs/spectacle

If you really think to need, you can even use Marp React within these frameworks.

## Install

```bash
# yarn
yarn add @marp-team/marp-core @marp-team/marp-react

# npm
npm install --save @marp-team/marp-core @marp-team/marp-react
```

## Usage

### `<Marp>` component

This is a simple usage of `<Marp>` renderer component. It renders slides via [inline SVG](https://marpit.marp.app/inline-svg) to `<div>` elements.

```jsx
import { Marp } from '@marp-team/marp-react'
import React from 'react'
import ReactDOM from 'react-dom'

const markdown = `
# Page 1

---

## Page 2`

ReactDOM.render(<Marp markdown={markdown} />, document.getElementById('app'))

/* <div id="app">
 *   <div class="marp-xxxxxxxx">
 *     <svg data-marpit-svg viewBox="0 0 1280 960">
 *       <foreignObject width="1280" height="960">
 *         <section><h1>Page 1</h1></section>
 *       </foreignObject>
 *     </svg>
 *   </div>
 *   <div class="marp-xxxxxxxx">
 *     <svg data-marpit-svg viewBox="0 0 1280 960">
 *       <foreignObject width="1280" height="960">
 *         <section><h2>Page 2</h2></section>
 *       </foreignObject>
 *     </svg>
 *   </div>
 * </div>
 */
```

#### Constructor option

[Marp constructor options](https://github.com/marp-team/marp-core#constructor-options) can change in `options` prop.

```jsx
<Marp
  markdown=":+1:"
  options={{
    inlineSVG: false,
    emoji: {
      shortcode: true,
      unicode: true,
    },
  }}
/>
```

#### Custom renderer

You can use a custom renderer by passing `render` prop or `children` prop.

```jsx
// Use `render` prop
<Marp markdown="# Hello, Marp!" render={customRenderer} />

// or children
<Marp markdown="# Hello, Marp!">{customRenderer}</Marp>
```

The example of custom renderer is here:

```jsx
const customRenderer = slides => (
  <div className="marp">
    {slides.map(({ slide, comments }, i) => (
      <div className="slide" key={i}>
        {slide}
        {comments.map((comment, ci) => (
          <p className="comment" key={ci}>
            {comment}
          </p>
        ))}
      </div>
    ))}
  </div>
)
```

> :information_source: See also [Render Props](https://reactjs.org/docs/render-props.html) in the document of React.


#### markdown-it plugins

You can use `markdown-it` plugins by configuring `Marp` object via `init` prop.

```jsx
<Marp
  markdown={text('Markdown', `
::: columns
The delimiter \`:::\` should not be shown here.
:::
  `)}
  init={marp => marp.use(markdownItContainer, 'columns')}
/>
```

### `<MarpWorker>` component _(Experimental)_

For the best performance of the integrated web app, `<MarpWorker>` allows using [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) for Markdown conversion. It has a lot of clear advantages over a regular `<Marp>` component.

- It does not block UI thread while converting large Markdown.
- A blazing fast live preview by a simple but clever queueing system is available.
- No longer need to include a huge Marp Core into main JS.
- Web Worker will be loaded asynchronously, so the first paint will not block.

The renderer using worker may be default component of Marp React in future.

#### Basic usage

You can use it just by swapping from `<Marp>` to `<MarpWorker>`. By default, `<MarpWorker>` will use a pre-built worker via [jsDelivr](https://www.jsdelivr.com/) CDN.

```jsx
import { MarpWorker } from '@marp-team/marp-react'
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
  <MarpWorker markdown="# Hello, Marp Worker!" />,
  document.getElementById('app')
)
```

#### Use custom worker

The custom worker may specify via `worker` prop.

```jsx
<MarpWorker worker={new Worker('worker.js')} markdown="# Hello, Marp Worker!" />
```

```javascript
// worker.js
require('@marp-team/marp-react/lib/worker')()
```

#### Initial rendering

`<MarpWorker>`'s custom renderer might be called with `undefined` slides argument, unlike `<Marp>`. It means an initial rendering of the component while preparing worker.

You may show waiting user a loading message as follows:

```jsx
<MarpWorker worker={new Worker('worker.js')} markdown="# Hello, Marp Worker!">
  {slides =>
    slides ? (
      <div className="marp">
        {slides.map(({ slide }) => (
          <div className="slide" key={i}>
            {slide}
          </div>
        ))}
      </div>
    ) : (
      <p>Loading Marp Worker...</p>
    )
  }
</MarpWorker>
```

## ToDo

- [x] Implement React renderer component based on [our prototype](https://codesandbox.io/s/kkryjmyy75)
- [x] Support rendering in worker for replacing [Marp Web](https://github.com/marp-team/marp-web) live preview feature
  - [x] Allow using worker via CDN (`importScript()`)
  - [x] Use worker hosted on CDN by default
- [ ] Support additional theme(s)
- [ ] Support swapping engine (e.g. [Marpit](https://github.com/marp-team/marpit))

## Author

Managed by [@marp-team](https://github.com/marp-team).

- <img src="https://github.com/yhatt.png" width="16" height="16"/> Yuki Hattori ([@yhatt](https://github.com/yhatt))

## License

[MIT License](LICENSE)
