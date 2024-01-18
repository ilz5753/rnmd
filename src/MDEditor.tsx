import { isUndefined } from 'lodash';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type Dispatch,
} from 'react';
import { StyleSheet, TextInput, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
// import { MDRegexes } from './constants';
// import { type IRegexes } from './utils';
export type TMDEditorPadSize = 'x' | 'xx' | 'xxx';
export interface IPress {
  onPress?(): void;
  onLongPress?(): void;
  disabled?: boolean;
}
export interface IMDEditorHeaderBtn {
  /**
   * width and height of btn
   */
  size: number;
}
export interface IMDEditorHeaderSearchBtn extends IMDEditorHeaderBtn {
  toggleSearch(): void;
}
export interface IMDEditorHeaderPreviewBtn extends IMDEditorHeaderBtn {
  togglePreview(): void;
  visible?: boolean;
}
export type TMDEditorBtn = ComponentType<IMDEditorHeaderBtn>;
export interface IMDEditorHeader {
  /**
   * a number between 48 to 72
   */
  height?: number;
  /**
   * header background color
   *
   * > must be set if use pass `shadowColor`
   */
  bg?: string;
  /**
   * in format of hex.
   *
   * e.g. `#123456`
   */
  shadowColor?: string;
  /**
   * screen title
   */
  title: string;
  /**
   * screen subtitle
   */
  subtitle?: string;
  /**
   * `close | back | clear | ...` buttons
   */
  LeftBtn?: TMDEditorBtn;
  /**
   * `check | done | save | ...` buttons
   */
  RightBtn?: TMDEditorBtn;
  SearchBtn: ComponentType<IMDEditorHeaderSearchBtn>;
  PreviewBtn?: ComponentType<IMDEditorHeaderPreviewBtn>;
}
export interface IMDEditor {
  /**
   * background color
   */
  bg?: string;
  /**
   * horizontal pan?
   */
  horizontal?: boolean;
  /**
   * Safe Area View Height size
   */
  savHeight?: number;
  /**
   * Markdown Preview
   */
  preview?: boolean;
  /**
   * md text
   */
  text?: string;
  /**
   * md text updater function
   */
  setText?: Dispatch<string>;
  paddingSize?: TMDEditorPadSize;
  header: IMDEditorHeader;
  /**
   * direction state
   */
  isRTL?: boolean;
}

const MDEditorCtx = createContext<IMDEditor | null>(null);
export const useMDEditor = () => {
  let ctx = useContext(MDEditorCtx);
  if (ctx === null)
    throw new Error(
      'You forgot to wrap Root component inside of "MDEditorProvider".'
    );
  return ctx;
};
export function MDEditorProvider() {
  let [] = useState();
  return <MDEditorCtx.Provider {...{ value: null }} />;
}
// let regexes: IRegexes[] = [
//   {
//     regex: MDRegexes.boldText,
//     textStyle: [{ fontSize: 24, fontWeight: 'bold', lineHeight: 16 }],
//   },
// ];
const IconWrapper = ({ size = 24, children }: any) => (
  <Animated.View
    {...{
      style: [{ width: size, height: size }, styles.hidden],
      children,
      entering: FadeIn,
      exiting: FadeOut,
      layout: Layout,
    }}
  />
);
export function MDEditor({
  bg,
  horizontal = false,
  preview = false,
  savHeight = 48,
  text = '',
  setText,
  paddingSize = 'xx',
  header,
  isRTL = false,
}: IMDEditor) {
  let {
    shadowColor,
    bg: hbg,
    LeftBtn,
    title,
    subtitle,
    height: hHeight,
    RightBtn,
    PreviewBtn,
    SearchBtn,
  } = header;
  let { width: w, height: h } = useWindowDimensions();
  let wStyle = useMemo(() => ({ width: w }), [w]);
  let hStyle = useMemo(() => ({ height: h }), [h]);
  /**
   * updates is from this instance (MDEditor or better TextInput) or not
   */
  let fromInside = useRef(false);
  let [value, setValue] = useState('');
  let [showPreview, setShowPreview] = useState(false);
  let [showSearch, setShowSearch] = useState(false);
  let panWidth = useSharedValue(0);
  let panHeight = useSharedValue(0);
  let panWidthHelp = useSharedValue(0);
  let panHeightHelp = useSharedValue(0);
  let gx = Gesture.Pan()
    .onUpdate(({ translationX, translationY }) => {
      if (horizontal) panWidth.value = translationX + panWidthHelp.value;
      else panHeight.value = translationY + panHeightHelp.value;
    })
    .onEnd(() => {
      if (horizontal) panWidthHelp.value = panWidth.value;
      else panHeightHelp.value = panHeight.value;
    });
  let gy = Gesture.Pan()
    .onUpdate(({ translationX, translationY }) => {
      if (horizontal) panWidth.value = translationX + panWidthHelp.value;
      else panHeight.value = translationY + panHeightHelp.value;
    })
    .onEnd(() => {
      if (horizontal) panWidthHelp.value = panWidth.value;
      else panHeightHelp.value = panHeight.value;
    });
  let onFocus = useCallback(() => {
    fromInside.current = true;
  }, []);
  /**
   * release text updating by inner TextInput instance and make better functionality
   *
   * useful in: **onSubmitEditting**, **onBlur**
   */
  let onFinishEditing = useCallback(() => {
    fromInside.current = false;
  }, []);
  let onChangeText = useCallback(
    (txt: string) => {
      setValue(txt);
      if (setText) setText(txt);
    },
    [setText]
  );
  useEffect(() => {
    if (!fromInside.current) setValue(text);
  }, [text]);
  let fd: any = useMemo(
    () => ({ flexDirection: `row${isRTL ? '-reverse' : ''}` }),
    [isRTL]
  );
  let ta: any = useMemo(
    () => ({ textAlign: `${isRTL ? 'right' : 'left'}` }),
    [isRTL]
  );
  let pad = useMemo(() => {
    let size = 8;
    switch (paddingSize) {
      case 'xx':
        size = 16;
        break;
      case 'xxx':
        size = 24;
        break;
      default:
        break;
    }
    return size;
  }, [paddingSize]);
  let gap = useMemo(() => ({ gap: pad / 3 }), [pad]);
  let headerHeight = useMemo(() => {
    let h = hHeight ?? 60;
    if (h < 48) h = 48;
    else if (h > 72) h = 72;
    return h;
  }, [hHeight]);
  let size = useMemo(() => headerHeight * 0.72, [headerHeight]);
  let togglePreview = useCallback(() => {
    panWidth.value = withTiming(0);
    panHeight.value = withTiming(0);
    panWidthHelp.value = 0;
    panHeightHelp.value = 0;
    // if (showPreview) {
    // } else {
    // }
    setShowPreview((p) => !p);
  }, [showPreview]);
  let toggleSearch = useCallback(() => {
    setShowSearch((s) => !s);
  }, []);
  let gesture = Gesture.Simultaneous(gx, gy);
  return (
    <Animated.View
      {...{
        style: [wStyle, hStyle, { backgroundColor: bg }],
      }}
    >
      <Animated.View
        {...{
          style: [
            wStyle,
            {
              paddingTop: savHeight,
              height: savHeight + headerHeight,
            },
            { backgroundColor: hbg },
            !isUndefined(shadowColor) && {
              shadowColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 3.6,
              elevation: 6,
            },
          ],
        }}
      >
        <Animated.View
          {...{
            style: [
              fd,
              styles.aic,
              styles.jcsb,
              { paddingHorizontal: pad },
              { height: headerHeight },
              //   { borderWidth: 1 },
            ],
          }}
        >
          <Animated.View
            {...{
              style: [fd, styles.aic, LeftBtn && gap],
            }}
          >
            {LeftBtn && (
              <IconWrapper {...{ size }}>
                <LeftBtn {...{ size }} />
              </IconWrapper>
            )}
            <Animated.View
              {...{
                style: [!isUndefined(subtitle) && gap],
              }}
            >
              <Animated.Text
                {...{
                  style: [
                    ta,
                    { fontSize: 18, fontWeight: '600', color: 'black' },
                  ],
                }}
              >
                {title}
              </Animated.Text>
              {subtitle && (
                <Animated.Text
                  {...{ style: [ta, { fontSize: 13.5, color: 'gray' }] }}
                >
                  {subtitle}
                </Animated.Text>
              )}
            </Animated.View>
          </Animated.View>
          <Animated.View
            {...{
              style: [fd, styles.aic, (PreviewBtn || RightBtn) && gap],
            }}
          >
            <IconWrapper {...{ size }}>
              <SearchBtn {...{ size, toggleSearch }} />
            </IconWrapper>
            {preview && PreviewBtn && (
              <IconWrapper {...{ size }}>
                <PreviewBtn
                  {...{ size, togglePreview, visible: showPreview }}
                />
              </IconWrapper>
            )}
            {RightBtn && (
              <IconWrapper {...{ size }}>
                <RightBtn {...{ size }} />
              </IconWrapper>
            )}
          </Animated.View>
        </Animated.View>
      </Animated.View>
      <Animated.View {...{ style: [styles.f1] }}>
        {/* SearchBar */}
        {showSearch && <></>}
        <GestureDetector {...{ gesture }}>
          <Animated.View {...{}}>
            <TextInput
              {...{
                value,
                onChangeText,
                onFocus,
                onBlur: onFinishEditing,
                onSubmitEditing: onFinishEditing,
              }}
            />
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  aic: {
    alignItems: 'center',
  },
  jcsb: {
    justifyContent: 'space-between',
  },
  f1: {
    flex: 1,
  },
  input: {
    paddingHorizontal: 6,
  },
  hidden: {
    overflow: 'hidden',
  },
});
