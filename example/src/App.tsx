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
        text: ['This is Editor', Array(10000).fill('').join('a')].join(
          '\n\n\n'
        ),
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
