import { useEffect } from 'react';
import { Keyboard } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { isAndroid } from './utils';
export default function useKeyboard() {
  let keyboardIsActive = useSharedValue(false);
  let keyboardHeight = useSharedValue(0);
  useEffect(() => {
    let kds = Keyboard.addListener(
      `keyboard${isAndroid ? 'Did' : 'Will'}Show`,
      ({ endCoordinates: { height: h } }) => {
        keyboardIsActive.value = true;
        keyboardHeight.value = withTiming(h);
      }
    );
    let kdh = Keyboard.addListener(
      `keyboard${isAndroid ? 'Did' : 'Will'}Hide`,
      () => {
        keyboardIsActive.value = false;
        keyboardHeight.value = withTiming(0);
      }
    );
    return () => {
      kds.remove();
      kdh.remove();
    };
  }, []);
  return {
    keyboardIsActive,
    keyboardHeight,
  };
}
