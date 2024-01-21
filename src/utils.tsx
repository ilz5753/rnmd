import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Linking, Platform } from 'react-native';
// import { cloneDeep } from 'lodash';

export const ReClamp = (value: number, min: number, max: number) => {
  'worklet';
  return Math.min(max, Math.max(min, value));
};
export const isAndroid = Platform.OS === 'android';
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
export const DefaultMDPreviewStyles = {
  codeBlock: {
    // fontFamily: 'Courier',
    fontWeight: '500',
  },
  del: {
    backgroundColor: '#222222',
  },
  em: {
    fontStyle: 'italic',
  },
  heading: {
    fontWeight: '200',
  },
  heading1: {
    fontSize: 32,
  },
  heading2: {
    fontSize: 24,
  },
  heading3: {
    fontSize: 18,
  },
  heading4: {
    fontSize: 16,
  },
  heading5: {
    fontSize: 13,
  },
  heading6: {
    fontSize: 11,
  },
  hr: {
    backgroundColor: '#cccccc',
    height: 1,
  },
  image: {
    height: 50, // TODO: React Native needs to support auto image size
    width: 50, // TODO: React Native needs to support auto image size
  },
  inlineCode: {
    backgroundColor: '#eeeeee',
    borderColor: '#dddddd',
    borderRadius: 3,
    borderWidth: 1,
    // fontFamily: 'Courier',
    fontWeight: 'bold',
  },
  list: {},
  listItem: {
    flexDirection: 'row',
  },
  listItemBullet: {
    fontSize: 20,
    lineHeight: 20,
  },
  listItemNumber: {
    fontWeight: 'bold',
  },
  paragraph: {
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
    backgroundColor: '#222222',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tableHeaderCell: {
    color: '#ffffff',
    fontWeight: 'bold',
    padding: 5,
  },
  tableRow: {
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
};
export const SafeOpenUrl = async (url: string) => {
  if (await Linking.canOpenURL(url)) await Linking.openURL(url);
};
