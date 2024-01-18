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
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutLeft,
  FadeOutRight,
  FadeOutUp,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ReClamp } from './utils';
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
export interface IMDEditorColors {
  //
}
export interface IMDEditor {
  colors: IMDEditorColors;
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
const IconWrapper = ({
  size = 24,
  children,
  isRTL = false,
  left = false,
}: any) => {
  return (
    <Animated.View
      {...{
        style: [{ width: size, height: size }, styles.hidden],
        children,
        entering: left || isRTL ? FadeInLeft : FadeInRight,
        exiting: left || isRTL ? FadeOutLeft : FadeOutRight,
        layout: Layout,
      }}
    />
  );
};
export function MDEditor({
  bg,
  horizontal = false,
  preview = false,
  savHeight = 48,
  text = '',
  setText,
  paddingSize = 'xxx',
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
  let z = useMemo(() => (isRTL ? -1 : 1), [isRTL]);
  let { width: w, height: h } = useWindowDimensions();
  let pad = useMemo(() => {
    let size = 12;
    switch (paddingSize) {
      case 'xx':
        size = 18;
        break;
      case 'xxx':
        size = 24;
        break;
      default:
        break;
    }
    return size;
  }, [paddingSize]);
  let hPad = useMemo(() => pad / 2, [pad]);
  let gap = useMemo(() => ({ gap: pad / 3 }), [pad]);
  let headerHeight = useMemo(() => {
    let h = hHeight ?? 60;
    if (h < 48) h = 48;
    else if (h > 72) h = 72;
    return h;
  }, [hHeight]);
  let size = useMemo(() => headerHeight * 0.72, [headerHeight]);
  let HeaderHeight = useMemo(
    () => savHeight + headerHeight,
    [savHeight, headerHeight]
  );
  let RemainHeight = useMemo(() => h - HeaderHeight, [h, HeaderHeight]);
  let wStyle = useMemo(() => ({ width: w }), [w]);
  let hStyle = useMemo(() => ({ height: h }), [h]);
  /**
   * updates is from this instance (MDEditor or better TextInput) or not
   */
  let fromInside = useRef(false);
  let [value, setValue] = useState('');
  let [search, setSearch] = useState('');
  let [showPreview, setShowPreview] = useState(false);
  let [showSearch, setShowSearch] = useState(false);
  let active = useSharedValue(false);
  let wThrid = useMemo(() => w * 0.2, [w]);
  let hThrid = useMemo(() => RemainHeight * 0.2, [RemainHeight]);
  let panWidth = useSharedValue(wThrid);
  let panHeight = useSharedValue(hThrid);
  let panWidthHelp = useSharedValue(wThrid);
  let panHeightHelp = useSharedValue(hThrid);
  let gx = Gesture.Pan()
    .onUpdate(({ translationX }) => {
      let sum = translationX + panWidthHelp.value;
      let a = w - wThrid - pad;
      console.log({ sum, wThrid, a, pad });
      if (isRTL) panWidth.value = ReClamp(sum, wThrid - w, -wThrid - pad);
      else panWidth.value = ReClamp(sum, wThrid, w - wThrid - pad);
      // if (isRTL) panWidth.value = ReClamp(sum, wThrid, w - wThrid - pad);
      // else panWidth.value = ReClamp(sum, wThrid - w, -wThrid - pad);
    })
    .onEnd(() => {
      panWidthHelp.value = panWidth.value;
    });
  let gy = Gesture.Pan()
    .onUpdate(({ translationY }) => {
      panHeight.value = ReClamp(
        translationY + panHeightHelp.value,
        hThrid,
        RemainHeight - hThrid - pad
      );
    })
    .onEnd(() => {
      panHeightHelp.value = panHeight.value;
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
  let BG = useMemo(() => ({ backgroundColor: bg }), [bg]);
  let horInput = useAnimatedStyle(() => ({
    width: panWidth.value,
    height: RemainHeight,
    // height: RemainHeight,
  }));
  let horMd = useAnimatedStyle(() => ({
    width: w - (pad + panWidth.value),
    height: RemainHeight,
    // height: RemainHeight,
  }));
  let verInput = useAnimatedStyle(() => ({
    width: w,
    height: panHeight.value,
    // height: RemainHeight,
  }));
  let verMd = useAnimatedStyle(() => ({
    width: w,
    height: RemainHeight - (pad + panHeight.value),
    // height: RemainHeight,
  }));
  return (
    <Animated.View
      {...{
        style: [wStyle, hStyle, BG],
      }}
    >
      <Animated.View
        {...{
          style: [
            wStyle,
            {
              paddingTop: savHeight,
              height: HeaderHeight,
            },
            { backgroundColor: hbg },
            !isUndefined(shadowColor) && [
              {
                shadowColor,
              },
              styles.shadowProps,
            ],
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
              <IconWrapper {...{ size, left: true, isRTL }}>
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
            <IconWrapper {...{ size, isRTL }}>
              <SearchBtn {...{ size, toggleSearch }} />
            </IconWrapper>
            {preview && PreviewBtn && (
              <IconWrapper {...{ size, isRTL }}>
                <PreviewBtn
                  {...{ size, togglePreview, visible: showPreview }}
                />
              </IconWrapper>
            )}
            {RightBtn && (
              <IconWrapper {...{ size, isRTL }}>
                <RightBtn {...{ size }} />
              </IconWrapper>
            )}
          </Animated.View>
        </Animated.View>
      </Animated.View>
      <Animated.View {...{ style: [styles.f1, horizontal && fd] }}>
        {horizontal ? (
          <>
            <Animated.View {...{ style: [horInput] }}>
              <TextInput
                {...{
                  value,
                  onChangeText,
                  onFocus,
                  onBlur: onFinishEditing,
                  onSubmitEditing: onFinishEditing,
                  style: [styles.f1, { padding: hPad }],
                  multiline: true,
                }}
              />
            </Animated.View>
            <GestureDetector {...{ gesture: gx }}>
              <Animated.View
                {...{
                  style: [
                    { width: pad },
                    { height: RemainHeight },
                    styles.center,
                    { borderWidth: 1 },
                  ],
                }}
              >
                <Animated.View
                  {...{
                    style: [
                      {
                        width: pad / 3,
                        height: 2 * pad,
                        backgroundColor: 'black',
                      },
                      styles.searchBr,
                    ],
                  }}
                />
              </Animated.View>
            </GestureDetector>
            <Animated.View
              {...{
                style: [horMd],
              }}
            ></Animated.View>
          </>
        ) : (
          <>
            <Animated.View {...{ style: [verInput] }}>
              <TextInput
                {...{
                  value,
                  onChangeText,
                  onFocus,
                  onBlur: onFinishEditing,
                  onSubmitEditing: onFinishEditing,
                  style: [styles.f1, { padding: hPad }],
                  multiline: true,
                }}
              />
            </Animated.View>
            <GestureDetector {...{ gesture: gy }}>
              <Animated.View
                {...{
                  style: [
                    wStyle,
                    { height: pad },
                    { borderWidth: 1 },
                    styles.center,
                  ],
                }}
              >
                <Animated.View
                  {...{
                    style: [
                      {
                        width: 2 * pad,
                        height: pad / 3,
                        backgroundColor: 'black',
                      },
                      styles.searchBr,
                    ],
                  }}
                />
              </Animated.View>
            </GestureDetector>
            <Animated.View
              {...{
                style: [verMd],
              }}
            ></Animated.View>
          </>
        )}
        {/* <Animated.View {...{ style: [mdInput, { borderWidth: 1 }] }}>
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
        {horizontal ? (
          <GestureDetector {...{ gesture: gx }}>
            <Animated.View
              {...{ style: [{ width: pad }, { height: RemainHeight }] }}
            ></Animated.View>
          </GestureDetector>
        ) : (
          <GestureDetector {...{ gesture: gy }}>
            <Animated.View
              {...{ style: [{ height: pad }, wStyle] }}
            ></Animated.View>
          </GestureDetector>
        )}
        <Animated.View></Animated.View> */}

        {/*  */}
        {/* <GestureDetector {...{ gesture }}>
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
        </GestureDetector> */}
        {/* SearchBar */}
        {showSearch && (
          <Animated.View
            {...{
              style: [
                wStyle,
                styles.overlay,
                { paddingHorizontal: pad },
                { top: pad },
              ],
              entering: FadeInUp,
              exiting: FadeOutUp,
              layout: Layout,
            }}
          >
            <Animated.View
              {...{
                style: [
                  // { padding: hPad },
                  styles.searchBr,
                  BG,
                  // styles.shadowProps,
                  { borderWidth: 1 },
                  fd,
                  styles.aic,
                ],
              }}
            >
              {/*  */}
              {/* <Animated.View></Animated.View> */}
              <TextInput
                {...{
                  style: [styles.f1, styles.searchBr, { padding: hPad }],
                  onChangeText: setSearch,
                  value: search,
                }}
              />
            </Animated.View>
          </Animated.View>
        )}
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
  overlay: {
    position: 'absolute',
    zIndex: 1,
  },
  searchBr: {
    borderRadius: 12,
  },
  shadowProps: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3.6,
    elevation: 6,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
