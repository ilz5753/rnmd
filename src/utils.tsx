import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Linking, Platform, StyleSheet } from 'react-native';
// import { cloneDeep } from 'lodash';

export const ReClamp = (value: number, min: number, max: number) => {
  'worklet';
  return Math.min(max, Math.max(min, value));
};
export const isAndroid = Platform.OS === 'android';
// type _Text = 'autolink' | 'blockQuote' | '';
// type _View = 'br' | 'hr';
export type TMDPreviewTag =
  | 'Array'
  | 'heading'
  | 'nptable'
  | 'lheading'
  | 'hr'
  | 'codeBlock'
  | 'fence'
  | 'blockQuote'
  | 'list'
  | 'def'
  | 'table'
  | 'tableSeparator'
  | 'newline'
  | 'paragraph'
  | 'escape'
  | 'autolink'
  | 'mailto'
  | 'url'
  | 'link'
  | 'image'
  | 'reflink'
  | 'refimage'
  | 'em'
  | 'strong'
  | 'u'
  | 'del'
  | 'inlineCode'
  | 'br'
  | 'text';
export type TMDStyles = Partial<
  Record<TMDPreviewTag, StyleProp<TextStyle | ViewStyle | ImageStyle>>
>;
export const DefaultMDPreviewStyles = StyleSheet.create({
  codeBlock: {
    // fontFamily: 'Courier',
    fontWeight: '500',
  },
  del: {
    // backgroundColor: '#222222',
    textDecorationLine: 'line-through',
  },
  em: {
    fontStyle: 'italic',
  },
  heading: {
    fontWeight: '200',
  },
  heading1: {
    fontWeight: '900',
    fontSize: 32,
  },
  heading2: {
    fontWeight: '800',
    fontSize: 24,
  },
  heading3: {
    fontWeight: '700',
    fontSize: 18,
  },
  heading4: {
    fontWeight: '600',
    fontSize: 16,
  },
  heading5: {
    fontWeight: '500',
    fontSize: 13,
  },
  heading6: {
    fontWeight: '400',
    fontSize: 11,
  },
  hr: {
    backgroundColor: '#cccccc',
    height: 1,
    marginTop: 4,
    marginBottom: 8,
  },
  image: {
    height: 50, // TODO: React Native needs to support auto image size
    width: 50, // TODO: React Native needs to support auto image size
  },
  inlineCode: {
    // backgroundColor: '#eeeeee',
    // borderColor: '#dddddd',
    borderRadius: 3,
    borderWidth: 1,
    // fontFamily: 'Courier',
    fontWeight: 'bold',
    color: 'white',
    paddingHorizontal: 2,
  },
  list: {
    paddingLeft: 16,
  },
  listItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
    width: '100%',
    marginBottom: 4,
  },
  listItemBullet: {
    fontSize: 20,
    lineHeight: 20,
  },
  listItemNumber: {
    fontWeight: 'bold',
  },
  paragraph: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  strong: {
    fontWeight: 'bold',
  },
  table: {
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 3,
  },
  tableHeader: {
    // backgroundColor: '#222222',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tableHeaderCell: {
    color: '#ffffff',
    fontWeight: 'bold',
    padding: 5,
  },
  tableRow: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#222222',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tableRowLast: {
    borderColor: 'transparent',
  },
  tableRowCell: {
    padding: 5,
  },
  text: {
    color: '#222222',
  },
  u: {
    borderColor: '#222222',
    borderBottomWidth: 1,
  },
  link: {
    color: '#0047ff',
  },
  autolink: {
    color: '#0047ff',
  },
  mailto: {
    color: '#0047ff',
  },
  url: {
    color: '#0047ff',
  },
});
export const SafeOpenUrl = async (url: string) => {
  if (await Linking.canOpenURL(url)) await Linking.openURL(url);
};
/**
 * **Todo:** implement other `languages formats` for better code visualization.
 */
export const getLanguageName = (lang = 'tsx') => {
  let l = 'plaintext';
  switch (lang) {
    case 'ts':
    case 'typescript':
    case 'tsx':
      l = 'typescript';
      break;
    case 'js':
    case 'javascript':
    case 'jsx':
      l = 'javascript';
      break;
    case 'sh':
    case 'bash':
      l = 'bash';
      break;
    case 'md':
    case 'markdown':
      l = 'markdown';
      break;
    case 'py':
    case 'python':
      l = 'python';
      break;
    case 'c++':
    case 'cpp':
      l = 'cpp';
      break;
    case 'objective-c':
    case 'obj-c':
      l = 'objective-c';
      break;
    case 'java':
    case 'go':
    case 'c':
      l = lang;
      break;
    default:
      break;
  }
  return l;
};
