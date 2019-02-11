# @marp-team/marp-react

[![CircleCI](https://img.shields.io/circleci/project/github/marp-team/marp-react/master.svg?style=flat-square)](https://circleci.com/gh/marp-team/marp-react/)
[![Codecov](https://img.shields.io/codecov/c/github/marp-team/marp-react/master.svg?style=flat-square)](https://codecov.io/gh/marp-team/marp-react)
[![LICENSE](https://img.shields.io/github/license/marp-team/marp-react.svg?style=flat-square)](./LICENSE)

**[Marp](https://marp.app) renderer component for React.**

### :warning: Currently Marp React is under developing and not ready to use.

> :point_right: See also [the prototyped example at CodeSandbox][prototype].

[prototype]: https://codesandbox.io/s/kkryjmyy75

## Before using Marp React

This component is suited to create presentation tools integrated with Marp by React. Marp would create the static slide contents consist of plain HTML and CSS, so you have to notice that **it's not suited to control the content of your slide via React**.

React community has more appropriate and awesome tools for such that purpose. Typically these tools should help if you want to create a beautiful slide deck via React:

- **[Spectacle]** can create and control your slide deck with React's some flexibilities.
- **[mdx-deck]** is the best alternative for creating slide deck based on [MDX]: _Markdown + React components_.

[mdx-deck]: https://github.com/jxnblk/mdx-deck
[mdx]: https://mdxjs.com/
[spectacle]: https://github.com/FormidableLabs/spectacle

If you really think to need, you can even use Marp React within these frameworks.

## `<Marp>` component

This is a simple usage of Marp renderer. It renders slides via [inline SVG](https://marpit.marp.app/inline-svg) to `<div>` elements.

```jsx
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

### Constructor option

[Marp constructor options](https://github.com/marp-team/marp-core#constructor-options) can change in `options` prop.

```jsx
<Marp
  markdown=":+1:"
  options={{
    emoji: {
      shortcode: true,
      unicode: true,
    },
  }}
/>
```

### Custom renderer

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

## `<MarpWorker>` component _(Experimental)_

For the best UI experience of the integrated web app, the conversion logic of Markdown can be put into [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) by using `<MarpWorker>`. It has a lot of advantages over a regular `<Marp>` component.

- UI-blocking by converting large Markdown will reduce to the minimum.
- It allows blazing fast live preview by a simple but clever queueing.
- A browser JS does not need to include Marp, and the worker JS can be [lazy loading](https://web.dev/fast/reduce-javascript-payloads-with-code-splitting).

```jsx
<MarpWorker worker={new Worker('worker.js')} markdown="# Hello, Marp Worker!" />
```

```javascript
// worker.js
require('@marp-team/marp-react/lib/worker')()
```

## ToDo

- [x] Create repository
- [x] Implement React renderer component based on [our prototype][prototype]
- [x] Support rendering in worker for replacing [Marp Web](https://github.com/marp-team/marp-web) live preview feature
- [ ] Support additional theme(s)

## Author

Managed by [@marp-team](https://github.com/marp-team).

- <img src="https://github.com/yhatt.png" width="16" height="16"/> Yuki Hattori ([@yhatt](https://github.com/yhatt))

## License

[MIT License](LICENSE)
