# React Native Markdown Editor and View (RNMD)

RNMD is a React Native module that allows seamless integration of a Markdown editor and live preview functionality into your React Native projects.

**Important: This is the first version (v1.0.0) of RNMD. While it is feature-complete for basic usage, we are actively working on updates to improve performance and enhance the user interface. Expect regular updates and improvements in future releases.**

## Thanks

Special thanks to the creators of [react-native-markdown](https://github.com/lwansbrough/react-native-markdown) for their excellent work. RNMD leverages the foundation laid by react-native-markdown to provide a rich Markdown editing and preview experience in React Native.

## Example Videos

vertical | horizontal - ltr | horizontal - rtl
:---: | :---: | :---:
 [Vertical Preview](https://www.dropbox.com/scl/fi/x1r2rapyhbijafk7krliq/Simulator-Screen-Recording-iPhone-14-Pro-Max-2024-01-20-at-03.39.42.mp4?rlkey=nhrnoafw28ca9bqkjfevkugin&dl=0) | [Horizontal Preview - left to right direction](https://www.dropbox.com/scl/fi/yokpu0qujubtdwiso1sjb/Simulator-Screen-Recording-iPhone-14-Pro-Max-2024-01-20-at-03.36.54.mp4?rlkey=89f0czq4xdxnudydlv03lw0p5&dl=0) | [Horizontal Preview - right to left direction](https://www.dropbox.com/scl/fi/bnrnbj4pb6dzjaxuig8ml/Simulator-Screen-Recording-iPhone-14-Pro-Max-2024-01-20-at-03.38.25.mp4?rlkey=51i90gfwxal4nr4lnay9siaxw&dl=0)

## Installation

```bash
npm install @ilz5753/rnmd
# or yarn
yarn add @ilz5753/rnmd
# or bun
bun add @ilz5753/rnmd
```

<!-- ## No Official Release on npm

At the moment, there is no official release of RNMD on npm. This means that while you can install and experiment with the module using the instructions provided above, it is not yet considered stable for production use.

If you are interested in staying updated on the progress of RNMD or contributing to its development, feel free to follow the project on [GitHub](https://github.com/ilz5753/rnmd). -->

## Usage

### MDEditor
Import the `MDEditor` and register as new screen via react-navigation or your navigation strategy and navigate to it through `navigate` function

```tsx
import * as React from 'react';
import { MDEditor } from '@ilz5753/rnmd';

function UserReadMe() {
  return (
    <MDEditor
      {...{
        header: {
          title: 'README',
          subtitle: 'examples/todo/readme.md',
          hasLeftBtn: true,
          // leftBtn: 'back-arrow',
          // leftBtn: 'close',
        },
        // isRTL: true,
        // horizontal: true,
        colors: {
          headerShadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    />
  );
}
```

### MDPreview

Import `MDPreview` and pass your markdown content to it!

```tsx
import * as React from 'react';
import { MDPreview } from '@ilz5753/rnmd';

function UserReadMe() {
  return (
    <MDPreview
      {...{
        md: `# Project
        hey, this is my first repo readme!
        [test link](https://example.com)
        **Bold**
        *italic text*
        `
      }}
    />
  );
}
```

## Features (In Development)

- **Markdown Editor:** Easily integrate a Markdown editor into your React Native application.
- **Live Preview:** Real-time preview of Markdown content through a pan gesture.

- **Flexible Scrolling:** Supports both vertical and horizontal scrolling for a versatile viewing experience.
  Connecting Pans to Gesture Handler: Integrate pan gestures with Gesture Handler for smoother interactions.

- **Search Bar:** Implement a search bar for efficient navigation within the Markdown content.

- **Horizontal or Vertical Preview Pan:** Enable users to choose between horizontal and vertical preview pan.

- **MD Text Input:** Write functions for Markdown text input, allowing users to compose content effortlessly.

- **MD Preview Functions and Render View:** Develop functions for Markdown preview and render the view accordingly.

## Todo

- **Search Box:** Implement search functionality to navigate through Markdown content efficiently.

## Contributing

We welcome contributions to enhance RNMD. If you have suggestions, bug reports, or want to contribute code, please follow our [contribution guidelines](./CONTRIBUTING.md).

---

## MIT

RNMD is licensed under the [MIT License](./LICENSE).

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
