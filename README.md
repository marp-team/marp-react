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

## ToDo

- [x] Create repository
- [x] Implement React renderer component based on [our prototype][prototype]
- [ ] Support rendering in worker for replacing [Marp Web](https://github.com/marp-team/marp-web) live preview feature
- [ ] Support additional theme(s)

## Author

Managed by [@marp-team](https://github.com/marp-team).

- <img src="https://github.com/yhatt.png" width="16" height="16"/> Yuki Hattori ([@yhatt](https://github.com/yhatt))

## License

[MIT License](LICENSE)
