import * as React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MDEditor } from 'rnmd';
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
  return (
    <MDEditor
      {...{
        header: {
          title: 'README',
          subtitle: 'examples/files/abcddddddd/todo/readme.md',
          // hasLeftBtn: true,
          // leftBtn: 'back-arrow',
          // leftBtn: 'close',
          height: 48,
        },
        isRTL: true,
        horizontal: true,
        colors: {
          headerShadowColor: 'rgba(0, 0, 0, 0.5)',
        },
        // text: ['```sh', 'yarn example web', '```', '\n\n'].join('\n'),
        text: [
          `**Bold Text**

*Italic Text*

~~Strikethrough Text~~

[Link Text](https://example.com)`,
          `# Heading 1

## Heading 2

### Heading 3`,
          `
- Item 1
- Item 2
- Item 3


1. Ordered Item 1
2. Ordered Item 2
3. Ordered Item 3`,
          '```tsx',
          'console.log("Hello User!");',
          '```',
          '\nJust follow `App.js` for more **`informations`**',
          '\n\n',
        ].join('\n\n'),
      }}
    />
  );
}

const styles = StyleSheet.create({
  f1: {
    flex: 1,
  },
});
