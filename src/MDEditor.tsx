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
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeInUp,
  FadeOutUp,
  Layout,
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

export function MDEditor({
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
  // let z = useMemo(() => (isRTL ? -1 : 1), [isRTL]);
  let { width: w, height: h } = useWindowDimensions();
  let { keyboardHeight, keyboardIsActive } = useKeyboard();
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
  let HeaderHeight = useMemo(
    () => topSavHeight + headerHeight,
    [topSavHeight, headerHeight]
  );
  /**
   * bottom safe area view height size
   */
  let bsh = useDerivedValue(
    () => (keyboardIsActive.value ? 5 : bottomSavHeight),
    [bottomSavHeight]
  );
  let bshStyle = useAnimatedStyle(() => ({
    height: bsh.value,
  }));
  let spaces = useDerivedValue(() => HeaderHeight + bsh.value, [HeaderHeight]);
  let _RemainHeight_ = useDerivedValue(
    () => h - (spaces.value + keyboardHeight.value),
    [h]
  );
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
  let wThrid = useMemo(() => w * 0.2, [w]);
  let _hThrid_ = useDerivedValue(() => _RemainHeight_.value * 0.2);
  let _hThrid_sup = useDerivedValue(() => _RemainHeight_.value * 0.8);
  let maxW = useMemo(() => w - wThrid - pad, [w, wThrid, pad]);
  let panWidth = useSharedValue(wThrid);
  let panHeight = useSharedValue(0);
  let panWidthHelp = useSharedValue(wThrid);
  let panHeightHelp = useSharedValue(0);
  let gx = Gesture.Pan()
    .onStart(() => {
      activeX.value = true;
    })
    .onUpdate(({ translationX }) => {
      let sum = translationX + panWidthHelp.value;
      if (isRTL) panWidth.value = ReClamp(sum, -maxW, -wThrid);
      else panWidth.value = ReClamp(sum, wThrid, maxW);
    })
    .onEnd(() => {
      panWidthHelp.value = panWidth.value;
      activeX.value = false;
    })
    .enabled(showPreview);
  let gy = Gesture.Pan()
    .onStart(() => {
      activeY.value = true;
    })
    .onUpdate(({ translationY }) => {
      panHeight.value = ReClamp(
        translationY + panHeightHelp.value,
        _hThrid_.value,
        _hThrid_sup.value - pad
      );
    })
    .onEnd(() => {
      panHeightHelp.value = panHeight.value;
      activeY.value = false;
    })
    .enabled(showPreview);
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
  useEffect(() => {
    if (!fromInside.current) onChangeText(text);
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
    let sp = !showPreview;
    if (horizontal) {
      let wp = w - pad;
      let z = isRTL ? -1 : 1;
      let mw = z * wp;
      if (sp) mw = z * wThrid;
      panWidth.value = withTiming(mw, undefined, (f) => {
        if (f) runOnJS(setShowPreview)(sp);
      });
      panWidthHelp.value = mw;
    } else {
      let mh = _RemainHeight_.value - pad;
      if (sp)
        mh = keyboardIsActive.value
          ? h - (spaces.value + keyboardHeight.value + pad + _hThrid_.value)
          : _hThrid_.value;
      panHeight.value = withTiming(mh, undefined, (f) => {
        if (f) runOnJS(setShowPreview)(sp);
      });
      panHeightHelp.value = mh;
    }
  }, [horizontal, showPreview, w, pad, wThrid, isRTL, h]);
  let toggleSearch = useCallback(() => {
    setShowSearch((s) => !s);
  }, []);
  let BG = useMemo(() => ({ backgroundColor: wrapperBg }), [wrapperBg]);
  let _Pad = useMemo(() => ({ padding: hPad }), [hPad]);
  let horHeight = useAnimatedStyle(() => ({
    height: _RemainHeight_.value,
  }));
  let horInput = useAnimatedStyle(() => ({
    width: Math.abs(panWidth.value),
  }));
  let horMd = useAnimatedStyle(() => ({
    width: w - (pad + Math.abs(panWidth.value)),
  }));
  let verInput = useAnimatedStyle(() => ({
    height: panHeight.value,
  }));
  let verMd = useAnimatedStyle(() => ({
    height: _RemainHeight_.value - (pad + panHeight.value),
  }));
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
  let PanXBg = useAnimatedStyle(() => ({
    backgroundColor: withTiming(activeX.value ? activePanBg : panBg),
    opacity: withTiming(showPreview ? 1 : 0.5),
  }));
  let PanYBg = useAnimatedStyle(() => ({
    backgroundColor: withTiming(activeY.value ? activePanBg : panBg),
    opacity: withTiming(showPreview ? 1 : 0.5),
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
            },
          ],
          multiline: true,
        }}
      />
    ),
    [value, editorFontSize, editorBg, editorTextColor]
  );
  let save = useCallback(() => {
    if (onSubmitText) onSubmitText(value);
  }, [onSubmitText, value]);
  useAnimatedReaction(
    () => keyboardHeight.value,
    (kh) => {
      if (!horizontal) {
        if (showPreview) {
          let s = spaces.value + kh + pad + _hThrid_.value;
          let y = kh === 0 ? _hThrid_.value : h - s;
          panHeight.value = withTiming(y);
          panHeightHelp.value = y;
        } else {
          let s = spaces.value + kh + pad + (kh === 0 ? _hThrid_.value : 0);
          let y = kh === 0 ? _RemainHeight_.value - pad : h - s;
          panHeight.value = withTiming(y);
          panHeightHelp.value = y;
        }
      }
    },
    [horizontal, h, pad, showPreview]
  );
  let P = useMemo(
    () => <MDPreview {...{ md: value, ...previewConfig }} />,
    [value, previewConfig]
  );
  return (
    <KeyboardAvoidingView
      {...{ style: [styles.f1], behavior: isAndroid ? 'height' : 'padding' }}
    >
      <Animated.View
        {...{
          style: [styles.f1, BG],
        }}
      >
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
            <Animated.View {...{ style: [styles.f1, fd, horHeight] }}>
              <Animated.View {...{ style: [horInput, _Pad] }}>
                {ti}
              </Animated.View>
              <GestureDetector {...{ gesture: gx }}>
                <Animated.View
                  {...{
                    style: [
                      { width: pad },
                      // { height: RemainHeight },

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
                  style: [horMd, _Pad],
                }}
              >
                {P}
              </Animated.View>
            </Animated.View>
          ) : (
            <Animated.View {...{ style: [styles.f1] }}>
              <Animated.View {...{ style: [styles.fw, verInput, _Pad] }}>
                {ti}
              </Animated.View>
              <GestureDetector {...{ gesture: gy }}>
                <Animated.View
                  {...{
                    style: [
                      styles.fw,
                      { height: pad },
                      PanBgStyle,
                      PanYBg,
                      // { borderWidth: 1 },
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
                  style: [styles.fw, verMd, _Pad],
                }}
              >
                {P}
              </Animated.View>
            </Animated.View>
          )}
          <Animated.View
            {...{
              style: [bshStyle, { borderWidth: 1 }],
            }}
          />
          {/* SearchBar */}
          {showSearch && (
            <Animated.View
              {...{
                style: [
                  styles.fw,
                  styles.overlay,
                  { paddingHorizontal: pad },
                  { top: pad },
                ],
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
                  entering: FadeInUp,
                  exiting: FadeOutUp,
                  layout: Layout,
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
    </KeyboardAvoidingView>
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
