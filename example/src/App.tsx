import { MDEditor } from '@ilz5753/rnmd';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
          subtitle: 'examples/readme.md',
          hasLeftBtn: true,
          // leftBtn: 'back-arrow',
          leftBtn: 'close',
          height: 48,
        },
        // isRTL: true,
        // horizontal: true,
        colors: {
          headerShadowColor: 'rgba(0, 0, 0, 0.5)',
        },
        text: [
          `**Bold Text**

*Italic Text*

~~**Strikethrough Text**~~

[***GGGGGGGGGGGG***](g://g.g?g=g)

[Link Text](https://example.com)`,
          `>:warning: #### The quarterly results look great!

>> - Revenue was off the chart.
>> - Profits were higher than ever.


>  *Everything* is going according to **plan**.
          

---

# Heading 1

## Heading 2

### Heading 3`,
          `
- Item 1
- Item 2
- Item 3

> test

1. Ordered Item 1
2. Ordered Item 2
3. Ordered Item 3


> ** bold text **


| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title |
| Header      | Title |
| Paragraph   | First paragraph. <br><br> Second paragraph. |
`,
          '```ts',
          `// Reanimated clamp function
const ReClamp = (value: number, min: number, max: number) => {
  'worklet';
  return Math.min(max, Math.max(min, value));
};`,
          '```',
          '\n',
          '```sh',
          'mkdir docs && cd docs',
          '```',
          '\n',
          '```js',
          'console.log("Hello User!");',
          '```',
          '\nJust follow `App.js` for more informations',
          '\n',
          '```py',
          `a = "User"
b = 1
while b <= 4:
  print(a, b)
  b += 1
`,
          '```',
          '\n\n',
        ].join('\n'),
        previewConfig: {
          colors: {
            ruleColors: {
              blockQuoteBorderLeft: '#0047ff',
            },
          },
        },
      }}
    />
  );
}

const styles = StyleSheet.create({
  f1: {
    flex: 1,
  },
});
