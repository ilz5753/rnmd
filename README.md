# RNMD (React Native Markdown Editor and View)

RNMD is a React Native module that allows seamless integration of a Markdown editor and live preview functionality into your React Native projects.

> **Important: This module is currently in development and may not be feature-complete. Please use it with caution and expect updates and improvements in future releases.**

## Installation

```bash
npm install rnmd
# or yarn
yarn add rnmd
# or bun
bun add rnmd
```

## Usage

Import the `MDEditor` and register as new screen via react-navigation or your navigation strategy and navigate to it through `navigate` function

```tsx
// showcase via expo
import { Entypo, Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { IMDEditorHeaderSearchBtn, MDEditor } from 'rnmd';
export default function App() {
  return (
    <GestureHandlerRootView
      {...{
        style: [styles.f1],
      }}
    >
      <Test />
    </GestureHandlerRootView>
  );
}
function Test() {
  let SearchBtn = React.useCallback(
    ({ size, toggleSearch }: IMDEditorHeaderSearchBtn) => {
      return (
        <TouchableOpacity
          {...{
            onPress: toggleSearch,
            activeOpacity: 0.72,
            style: [styles.f1, styles.center],
          }}
        >
          <Ionicons
            {...{
              name: 'ios-search-outline',
              size: size * 0.6,
              color: 'black',
            }}
          />
        </TouchableOpacity>
      );
    },
    []
  );
  let PreviewBtn = React.useCallback(
    ({ size, togglePreview, visible }: IMDEditorHeaderSearchBtn) => {
      return (
        <TouchableOpacity
          {...{
            onPress: togglePreview,
            activeOpacity: 0.72,
            style: [styles.f1, styles.center],
          }}
        >
          <Entypo
            {...{
              name: `eye${visible ? '-with-line' : ''}`,
              size: size * 0.6,
              color: 'black',
            }}
          />
        </TouchableOpacity>
      );
    },
    []
  );
  return (
    <MDEditor
      {...{
        header: {
          title: 'README',
          subtitle: 'examples/todo/readme.md',
          bg: 'white',
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          SearchBtn,
          PreviewBtn,
        },
        // isRTL: true,
      }}
    />
  );
}
const styles = StyleSheet.create({
  f1: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 200,
    height: 60,
    marginVertical: 20,
    borderWidth: 1,
  },
});
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

## Contributing

We welcome contributions to enhance RNMD. If you have suggestions, bug reports, or want to contribute code, please follow our [contribution guidelines](./CONTRIBUTING.md).

---

## MIT

RNMD is licensed under the [MIT License](./LICENSE).

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
