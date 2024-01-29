import { isUndefined } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeInUp,
  FadeOutUp,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Icons } from './Icons';
import { MDPreview, type IMDPreview } from './MDPreview';
import useKeyboard from './useKeyboard';
import { ReClamp, isAndroid } from './utils';

export type TMDEditorPadSize = 'x' | 'xx' | 'xxx';
export interface IPress {
  onPress?(): void;
  onLongPress?(): void;
  disabled?: boolean;
}
export interface IMDEditorHeader {
  /**
   * a number between `48 - 72`
   * @default 60
   */
  height?: number;
  /**
   * screen title
   */
  title: string;
  /**
   * screen subtitle
   */
  subtitle?: string;
  hasLeftBtn?: boolean;
  leftBtn?: 'close' | 'back-chevron' | 'back-arrow';
  leftPress?: IPress;
}
export interface IMDEditorColors {
  wrapperBg?: string;
  headerBg?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  headerShadowColor?: string;
  headerBackIcon?: string;
  headerCloseIcon?: string;
  headerSearchIcon?: string;
  headerSaveIcon?: string;
  headerPreviewEnabledIcon?: string;
  headerPreviewDisabledIcon?: string;
  panBg?: string;
  panShadowColor?: string;
  panDragView?: string;
  activePanBg?: string;
  activePanShadowColor?: string;
  activePanDragBg?: string;
  editorBg?: string;
  editorTextColor?: string;
}
export interface IMDEditorInput {
  fontSize?: number;
}
export type TMDEditorPreview = Omit<IMDPreview, 'md'>;
export interface IMDEditor {
  /**
   * colors object
   */
  colors: IMDEditorColors;
  /**
   * horizontal pan?
   */
  horizontal?: boolean;
  /**
   * Top Safe Area View Height size
   * @default 48
   */
  topSavHeight?: number;
  /**
   * Bottom Safe Area View Height size
   * @default 34
   */
  bottomSavHeight?: number;
  /**
   * md text
   */
  text?: string;
  /**
   * md text updater function
   */
  onSubmitText?: Dispatch<string>;
  paddingSize?: TMDEditorPadSize;
  /**
   * direction state
   */
  isRTL?: boolean;
  header: IMDEditorHeader;
  editorConfig?: IMDEditorInput;
  previewConfig?: TMDEditorPreview;
}
let _wz = 0.2;
let _wh = 0.24;
let minMultiplier = (n = 1) => n * _wz;
let minWorkletMultiplier = (n = 1) => {
  'worklet';
  return n * _wh;
};
export function MDEditorRender({
  colors,
  horizontal = false,
  topSavHeight = 48,
  bottomSavHeight = 34,
  text = '',
  onSubmitText,
  paddingSize = 'xx',
  header,
  isRTL = false,
  editorConfig = {},
  previewConfig = {},
}: IMDEditor) {
  /**
   * updates is from this instance (MDEditor or better TextInput) or not
   */
  let fromInside = useRef(false);
  let [value, onChangeText] = useState('');
  let [search, setSearch] = useState('');
  let [showPreview, setShowPreview] = useState(true);
  let [showSearch, setShowSearch] = useState(false);
  let activeX = useSharedValue(false);
  let activeY = useSharedValue(false);
  let {
    wrapperBg = '#ffffff',
    headerBg = '#ffffff',
    headerBackIcon = '#000000',
    headerCloseIcon = '#000000',
    headerPreviewDisabledIcon = '#000000',
    headerPreviewEnabledIcon = '#000000',
    headerSearchIcon = '#000000',
    headerSaveIcon = '#000000',
    headerShadowColor,
    panBg = '#ffffff',
    panShadowColor = 'rgba(0, 0, 0, 0.5)',
    panDragView = '#000000',
    activePanBg = '#007aff',
    activePanShadowColor = '#000000',
    activePanDragBg = '#ffffff',
    headerTitle = '#000000',
    headerSubtitle = '#878787',
    editorBg = '#ffffff',
    editorTextColor = '#000000',
  } = colors;
  let {
    hasLeftBtn = false,
    leftBtn = 'back-chevron',
    leftPress,
    title,
    subtitle,
    height: hHeight,
  } = header;
  let { fontSize: editorFontSize = 16 } = editorConfig;
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
  // let uGap = useMemo(() => ({ gap: pad }), [pad]);
  let _Pad = useMemo(() => ({ padding: 8 }), []);
  let gap = useMemo(() => ({ gap: pad / 3 }), [pad]);
  let fd: any = useMemo(
    () => ({ flexDirection: `row${isRTL ? '-reverse' : ''}` }),
    [isRTL]
  );
  let ta: any = useMemo(
    () => ({ textAlign: `${isRTL ? 'right' : 'left'}` }),
    [isRTL]
  );
  let headerHeight = useMemo(() => {
    let h = hHeight ?? 60;
    if (h < 48) h = 48;
    else if (h > 72) h = 72;
    return h;
  }, [hHeight]);
  let { keyboardHeight, keyboardIsActive } = useKeyboard();
  let { width: w, height: h } = useWindowDimensions();
  let HeaderHeight = useMemo(
    () => topSavHeight + headerHeight,
    [topSavHeight, headerHeight]
  );
  /**
   * bottom safe area view height size
   */
  let bsh = useDerivedValue(
    () => (keyboardIsActive.value ? 0 : bottomSavHeight),
    [bottomSavHeight]
  );
  let spaces = useDerivedValue(() => HeaderHeight + bsh.value, [HeaderHeight]);
  let _RemainHeight_ = useDerivedValue(
    () => h - (spaces.value + keyboardHeight.value),
    [h]
  );
  let wp = useMemo(() => w - pad, [w, pad]);
  let wz = useMemo(() => minMultiplier(wp), [wp]);
  let mw = useMemo(() => wp - wz, [wp, wz]);
  let hp = useDerivedValue(() => _RemainHeight_.value - pad, [pad]);
  let hz = useDerivedValue(() => minWorkletMultiplier(hp.value));
  let mh = useDerivedValue(() => hp.value - hz.value);
  let BG = useAnimatedStyle(() => ({
    backgroundColor: wrapperBg,
  }));
  let bshStyle = useAnimatedStyle(() => ({
    height: bsh.value,
  }));
  let dx = useSharedValue(wp / 2);
  let hdx = useSharedValue(wp / 2);
  let dy = useSharedValue(0);
  let hdy = useSharedValue(0);
  let gx = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          activeX.value = true;
        })
        .onUpdate(({ translationX }) => {
          dx.value = ReClamp(translationX + hdx.value, wz, mw);
        })
        .onEnd(() => {
          hdx.value = dx.value;
          activeX.value = false;
        })
        .enabled(showPreview),
    [wz, mw, showPreview]
  );
  let gy = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          activeY.value = true;
        })
        .onUpdate(({ translationY }) => {
          dy.value = ReClamp(translationY + hdy.value, hz.value, mh.value);
        })
        .onEnd(() => {
          hdy.value = dy.value;
          activeY.value = false;
        })
        .enabled(showPreview),
    [showPreview]
  );
  let horHeight: any = useMemo(
    () => ({
      height: '100%',
    }),
    []
  );
  let horLowWidth = useAnimatedStyle(() => ({
    width: dx.value,
  }));
  let horMaxWidth = useAnimatedStyle(() => ({
    width: w - dx.value,
  }));
  let verLowHeight = useAnimatedStyle(() => ({
    height: dy.value,
  }));
  let verMaxHeight = useAnimatedStyle(() => ({
    height: hp.value - dy.value,
  }));
  useEffect(() => {
    if (!fromInside.current) onChangeText(text);
  }, [text]);
  let onFocus = useCallback(() => {
    fromInside.current = true;
  }, []);
  /**
   * release text updating by inner TextInput instance and make better functionality
   *
   * useful for: **onSubmitEditting**, **onBlur**
   */
  let onFinishEditing = useCallback(() => {
    fromInside.current = false;
  }, []);
  let ti = useMemo(
    () => (
      <TextInput
        {...{
          value,
          onChangeText,
          onFocus,
          onBlur: onFinishEditing,
          onSubmitEditing: onFinishEditing,
          style: [
            styles.f1,
            {
              fontSize: editorFontSize,
              color: editorTextColor,
              backgroundColor: editorBg,
              textAlignVertical: 'top',
            },
          ],
          multiline: true,
        }}
      />
    ),
    [value, editorFontSize, editorBg, editorTextColor]
  );
  let P = useMemo(
    () => <MDPreview {...{ md: value, ...previewConfig }} />,
    [value, previewConfig]
  );
  let PanXBg = useAnimatedStyle(() => ({
    // [isRTL ? 'right' : `left`]: dx.value - (isRTL ? pad : 0),
    backgroundColor: withTiming(activeX.value ? activePanBg : panBg),
    opacity: withTiming(showPreview ? 1 : 0.5),
  }));
  let PanYBg = useAnimatedStyle(() => ({
    backgroundColor: withTiming(activeY.value ? activePanBg : panBg),
    opacity: withTiming(showPreview ? 1 : 0.5),
    // top: dy.value,
  }));
  let PanXShadow = useAnimatedStyle(() => ({
    shadowColor: withTiming(
      showPreview
        ? activeX.value
          ? activePanShadowColor
          : panShadowColor
        : 'transparent'
    ),
  }));
  let PanYShadow = useAnimatedStyle(() => ({
    shadowColor: withTiming(
      showPreview
        ? activeY.value
          ? activePanShadowColor
          : panShadowColor
        : 'transparent'
    ),
  }));
  let PanBgStyle = useMemo(
    () => [styles.center, showPreview && styles.shadowProps],
    [panBg, panShadowColor, showPreview]
  );
  let DragXBg = useAnimatedStyle(() => ({
    backgroundColor: withTiming(activeX.value ? activePanDragBg : panDragView),
  }));
  let DragYBg = useAnimatedStyle(() => ({
    backgroundColor: withTiming(activeY.value ? activePanDragBg : panDragView),
  }));
  useAnimatedReaction(
    () => hp.value,
    (hpv) => {
      if (!horizontal) {
        let hzv = minWorkletMultiplier(hpv);
        if (showPreview) {
          dy.value = withTiming(hzv);
          hdy.value = hzv;
        } else {
          dy.value = withTiming(hpv);
          hdy.value = hpv;
        }
      }
    },
    [horizontal, showPreview]
  );
  /**
   * header left color
   */
  let hlc = useMemo(
    () => (leftBtn === 'close' ? headerCloseIcon : headerBackIcon),
    [leftBtn, headerBackIcon, headerCloseIcon]
  );
  /**
   * header left icon
   */
  let Hli = useMemo(() => {
    let icon = isRTL ? Icons.ChevronRightIcon : Icons.ChevronLeftIcon;
    switch (leftBtn) {
      case 'back-arrow':
        icon = isRTL ? Icons.ArrowRightIcon : Icons.ArrowLeftIcon;
        break;
      case 'close':
        icon = Icons.CloseIcon;
        break;
      default:
        break;
    }
    return icon;
  }, [leftBtn, isRTL]);
  /** */
  let PreviewIcon = useMemo(
    () => (showPreview ? Icons.EyeCloseIcon : Icons.EyeOpenIcon),
    [showPreview]
  );
  let togglePreview = useCallback(() => {
    let sp = !showPreview;
    if (horizontal) {
      let x = sp ? hdx.value : wp;
      dx.value = withTiming(x, undefined, (f) => {
        if (f) runOnJS(setShowPreview)(sp);
      });
    } else {
      let y = sp ? hdy.value : hp.value;
      dy.value = withTiming(y, undefined, (f) => {
        if (f) runOnJS(setShowPreview)(sp);
      });
    }
    // setShowPreview(sp);
    // if (horizontal) {
    //   let wp = w - pad;
    //   let z = isRTL ? -1 : 1;
    //   let mw = z * wp;
    //   if (sp) mw = z * wThrid;
    //   panWidth.value = withTiming(mw, undefined, f => {
    //     if (f) runOnJS(setShowPreview)(sp);
    //   });
    //   panWidthHelp.value = mw;
    // } else {
    //   let mh = _RemainHeight_.value - pad;
    //   if (sp)
    //     mh = keyboardIsActive.value
    //       ? h - (spaces.value + keyboardHeight.value + pad + _hThrid_.value)
    //       : _hThrid_.value;
    //   panHeight.value = withTiming(mh, undefined, f => {
    //     if (f) runOnJS(setShowPreview)(sp);
    //   });
    //   panHeightHelp.value = mh;
    // }
  }, [horizontal, showPreview, wp]);
  let toggleSearch = useCallback(() => {
    setShowSearch((s) => !s);
  }, []);
  let save = useCallback(() => {
    if (onSubmitText) onSubmitText(value);
  }, [onSubmitText, value]);
  return (
    <KeyboardAvoidingView
      {...{
        style: [styles.f1],
        behavior: isAndroid ? 'height' : 'padding',
      }}
    >
      <Animated.View {...{ style: [styles.f1, BG] }}>
        <Animated.View
          {...{
            style: [
              styles.fw,
              {
                paddingTop: topSavHeight,
                height: HeaderHeight,
              },
              { backgroundColor: headerBg },
              !isUndefined(headerShadowColor) && [
                {
                  shadowColor: headerShadowColor,
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
                style: [styles.f1, fd, styles.aic, hasLeftBtn && gap],
              }}
            >
              {hasLeftBtn && (
                <TouchableOpacity {...{ activeOpacity: 0.72, ...leftPress }}>
                  <Hli {...{ color: hlc }} />
                </TouchableOpacity>
              )}
              <Animated.View
                {...{
                  style: [!isUndefined(subtitle) && gap, styles.f1],
                }}
              >
                <Animated.Text
                  {...{
                    style: [
                      ta,
                      styles.f1,
                      { fontSize: 18, fontWeight: '600', color: headerTitle },
                    ],
                    numberOfLines: 1,
                    ellipsizeMode: 'middle',
                  }}
                >
                  {title}
                </Animated.Text>
                {subtitle && (
                  <Animated.Text
                    {...{
                      style: [
                        ta,
                        styles.f1,
                        { fontSize: 13.5, color: headerSubtitle },
                      ],
                      numberOfLines: 1,
                      ellipsizeMode: 'middle',
                    }}
                  >
                    {subtitle}
                  </Animated.Text>
                )}
              </Animated.View>
            </Animated.View>
            <Animated.View
              {...{
                style: [fd, styles.aic, gap],
              }}
            >
              <TouchableOpacity
                {...{
                  activeOpacity: 0.72,
                  onPress: toggleSearch,
                }}
              >
                <Icons.SearchIcon {...{ color: headerSearchIcon }} />
              </TouchableOpacity>
              <TouchableOpacity
                {...{
                  activeOpacity: 0.72,
                  onPress: togglePreview,
                }}
              >
                <PreviewIcon
                  {...{
                    color: showPreview
                      ? headerPreviewDisabledIcon
                      : headerPreviewEnabledIcon,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                {...{
                  activeOpacity: 0.72,
                  onPress: save,
                }}
              >
                <Icons.SaveIcon
                  {...{
                    color: headerSaveIcon,
                  }}
                />
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </Animated.View>
        <Animated.View {...{ style: [styles.f1] }}>
          {horizontal ? (
            <Animated.View {...{ style: [styles.f1, fd] }}>
              <Animated.View
                {...{
                  style: [isRTL ? horMaxWidth : horLowWidth, _Pad, horHeight],
                }}
              >
                {ti}
              </Animated.View>
              {/* <Animated.View
                {...{
                  style: [
                    {
                      width: pad,
                    },
                    horHeight,
                  ],
                }}>
              </Animated.View> */}
              <GestureDetector {...{ gesture: gx }}>
                <Animated.View
                  {...{
                    style: [
                      {
                        width: pad,
                        // top: 0,
                      },
                      horHeight,
                      // styles.overlay,
                      // styles.f1,
                      styles.center,
                      PanBgStyle,
                      PanXBg,
                      PanXShadow,
                    ],
                  }}
                >
                  <Animated.View
                    {...{
                      style: [
                        {
                          width: pad / 3,
                          height: 2 * pad,
                        },
                        styles.searchBr,
                        DragXBg,
                      ],
                    }}
                  />
                </Animated.View>
              </GestureDetector>
              <Animated.View
                {...{
                  style: [
                    isRTL ? horLowWidth : horMaxWidth,
                    _Pad,
                    { [`padding${isRTL ? 'Start' : 'End'}`]: pad * 1.5 },
                    horHeight,
                  ],
                }}
              >
                {P}
              </Animated.View>
            </Animated.View>
          ) : (
            <Animated.View {...{ style: [styles.f1] }}>
              <Animated.View
                {...{
                  style: [verLowHeight, _Pad, styles.fw],
                }}
              >
                {ti}
              </Animated.View>
              {/* <Animated.View
                {...{
                  style: [
                    {
                      height: pad,
                    },
                    styles.fw,
                  ],
                }}>
              </Animated.View> */}
              <GestureDetector {...{ gesture: gy }}>
                <Animated.View
                  {...{
                    style: [
                      // styles.f1,
                      styles.fw,
                      {
                        height: pad,
                        // left: 0,
                      },
                      // styles.overlay,
                      styles.center,
                      PanBgStyle,
                      PanYBg,
                      PanYShadow,
                    ],
                  }}
                >
                  <Animated.View
                    {...{
                      style: [
                        {
                          width: 2 * pad,
                          height: pad / 3,
                        },
                        styles.searchBr,
                        DragYBg,
                      ],
                    }}
                  />
                </Animated.View>
              </GestureDetector>
              <Animated.View
                {...{
                  style: [verMaxHeight, _Pad, styles.fw],
                }}
              >
                {P}
              </Animated.View>
            </Animated.View>
          )}
          {showSearch && (
            <Animated.View
              {...{
                style: [
                  styles.fw,
                  styles.overlay,
                  { paddingHorizontal: pad },
                  { top: pad },
                ],
                entering: FadeInUp,
                exiting: FadeOutUp,
              }}
            >
              <Animated.View
                {...{
                  style: [
                    styles.searchBr,
                    BG,
                    { borderWidth: 1 },
                    fd,
                    styles.aic,
                  ],
                }}
              >
                <TextInput
                  {...{
                    style: [styles.f1, styles.searchBr, { padding: pad / 2 }],
                    onChangeText: setSearch,
                    value: search,
                  }}
                />
              </Animated.View>
            </Animated.View>
          )}
        </Animated.View>
        <Animated.View {...{ style: [bshStyle] }} />
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
export function MDEditor(props: IMDEditor) {
  return (
    <ErrorBoundary>
      <MDEditorRender {...props} />
    </ErrorBoundary>
  );
}
const styles = StyleSheet.create({
  aic: {
    alignItems: 'center',
  },
  jcsb: {
    justifyContent: 'space-between',
  },
  fw: {
    width: '100%',
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
