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
  let LeftBtn = React.useCallback(
    ({ size, togglePreview, visible }: IMDEditorHeaderSearchBtn) => {
      return (
        <TouchableOpacity
          {...{
            // onPress: togglePreview,
            activeOpacity: 0.72,
            style: [styles.f1, styles.center],
          }}
        >
          <Ionicons
            {...{
              name: `chevron-back`,
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
          LeftBtn,
        },
        isRTL: true,
        preview: true,
        horizontal: true,
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
