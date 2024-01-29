import Clipboard from '@react-native-clipboard/clipboard';
import { map } from 'lodash';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import CodeHighlighter from 'react-native-code-highlighter';
import Animated from 'react-native-reanimated';
import { atomOneDarkReasonable } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Icons } from './Icons';
import { SafeOpenUrl, getLanguageName } from './utils';
export interface IMDPreviewRulesColors {
  codeBlockBg?: string;
  codeBlockHeaderBorderBottom?: string;
  codeBlockHeaderLanguage?: string;
  codeBlockHeaderCopyIcon?: string;
  blockQuoteBg?: string;
  blockQuoteBorderLeft?: string;
  inlineCodeBg?: string;
}
export function MDPreviewRules(
  styles: any,
  colors: IMDPreviewRulesColors = {}
) {
  let {
    codeBlockBg = '#161B22',
    codeBlockHeaderBorderBottom = 'gray',
    codeBlockHeaderCopyIcon = 'gray',
    codeBlockHeaderLanguage = 'gray',
    blockQuoteBg = '#f9f9f9',
    blockQuoteBorderLeft = '#cccccc',
    inlineCodeBg = '#161B22',
  } = colors;
  return {
    autolink: {
      react({ content, target }: any, output: any, state: any) {
        state.withinText = true;
        let onPress = async () => await SafeOpenUrl(target);
        return (
          <TouchableOpacity
            {...{ key: state.key, activeOpacity: 0.72, onPress }}
          >
            <Animated.Text {...{ style: styles.autolink }}>
              {output(content, state)}
            </Animated.Text>
          </TouchableOpacity>
        );
      },
    },
    blockQuote: {
      react({ content }: any, output: any, state: any) {
        state.withinText = true;
        return (
          <Animated.View
            {...{
              key: state.key,
              style: [
                {
                  width: '100%',
                  marginVertical: 8,
                  paddingHorizontal: 8,
                  backgroundColor: blockQuoteBg,
                  // borderRadius: 16,
                  borderLeftWidth: 3,
                  borderLeftColor: blockQuoteBorderLeft,
                },
              ],
            }}
          >
            {output(content, state)}
          </Animated.View>
        );
      },
    },
    br: {
      react(_: any, __: any, state: any) {
        // return <Animated.View {...{ key: state.key, style: styles.br }} />;
        return (
          <Animated.Text {...{ key: state.key, style: styles.br }}>
            {'\n\n'}
          </Animated.Text>
        );
      },
    },
    codeBlock: {
      react({ content, lang }: any, _: any, state: any) {
        let language = getLanguageName(lang);
        state.withinText = true;
        let onPress = () => {
          Clipboard.setString(content);
        };
        return (
          <Animated.View
            {...{
              key: state.key,
              style: [
                { width: '100%', paddingHorizontal: 8, marginVertical: 4 },
              ],
            }}
          >
            <Animated.View
              {...{
                style: [
                  {
                    backgroundColor: codeBlockBg,
                    borderRadius: 16,
                    padding: 12,
                  },
                ],
              }}
            >
              <Animated.View
                {...{
                  style: [
                    {
                      borderBottomColor: codeBlockHeaderBorderBottom,
                      borderBottomWidth: 1.5,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: 8,
                      marginBottom: 8,
                    },
                    styles.codeBlockHeaderBorder,
                  ],
                }}
              >
                <Animated.Text
                  {...{
                    style: { fontSize: 13.5, color: codeBlockHeaderLanguage },
                  }}
                >
                  {language}
                </Animated.Text>
                <TouchableOpacity {...{ activeOpacity: 0.72, onPress }}>
                  <Icons.CopyIcon {...{ color: codeBlockHeaderCopyIcon }} />
                </TouchableOpacity>
              </Animated.View>
              <CodeHighlighter
                hljsStyle={atomOneDarkReasonable}
                textStyle={[styles.codeBlock]}
                scrollViewProps={{
                  contentContainerStyle: {
                    width: '100%',
                    backgroundColor: codeBlockBg,
                  },
                }}
                language={language}
              >
                {content}
              </CodeHighlighter>
            </Animated.View>
          </Animated.View>
        );
      },
    },
    del: {
      react({ content }: any, output: any, state: any) {
        state.withinText = true;
        return (
          <Animated.Text {...{ key: state.key, style: styles.del }}>
            {output(content, state)}
          </Animated.Text>
        );
      },
    },
    em: {
      react({ content }: any, output: any, state: any) {
        state.withinText = true;
        return (
          <Animated.Text {...{ key: state.key, style: styles.em }}>
            {output(content, state)}
          </Animated.Text>
        );
      },
    },
    heading: {
      react({ content, level }: any, output: any, state: any) {
        state.withinText = true;
        return (
          <Animated.Text
            {...{
              key: state.key,
              style: [styles.heading, styles[`heading${level}`]],
            }}
          >
            {output(content, state)}
          </Animated.Text>
        );
      },
    },
    hr: {
      react(_: any, __: any, state: any) {
        return <Animated.View {...{ key: state.key, style: styles.hr }} />;
      },
    },
    image: {
      react({ target }: any, _: any, state: any) {
        return (
          <Animated.Image
            {...{
              key: state.key,
              style: styles.image,
              source: { uri: target },
            }}
          />
        );
      },
    },
    inlineCode: {
      react({ content }: any, _: any, state: any) {
        state.withinText = true;
        return (
          <Animated.View
            {...{ key: state.key, style: { backgroundColor: inlineCodeBg } }}
          >
            <Animated.Text {...{ style: [styles.inlineCode] }}>
              {content}
            </Animated.Text>
          </Animated.View>
        );
      },
    },
    link: {
      react({ content, target }: any, output: any, state: any) {
        state.withinText = true;
        let onPress = async () => await SafeOpenUrl(target);
        return (
          <TouchableOpacity
            {...{ key: state.key, activeOpacity: 0.72, onPress }}
          >
            <Animated.Text {...{ style: styles.link }}>
              {output(content, state)}
            </Animated.Text>
          </TouchableOpacity>
        );
      },
    },
    list: {
      react({ items, ordered }: any, output: any, state: any) {
        let _items = map(items, (item, key) => {
          let bullet = (
            <Animated.Text
              {...{ style: [{ color: 'black' }, styles['listItemNumber']] }}
            >
              {ordered ? `${key + 1}. ` : '\u2022'}
            </Animated.Text>
          );
          return (
            <Animated.View {...{ key, style: [styles['listItem']] }}>
              {bullet}
              {output(item, state)}
            </Animated.View>
          );
        });
        return (
          <Animated.View {...{ key: state.key, style: styles.list }}>
            {_items}
          </Animated.View>
        );
      },
    },
    mailto: {
      react({ content, target }: any, output: any, state: any) {
        state.withinText = true;
        console.log({ target });
        let onPress = async () => await SafeOpenUrl(target);
        return (
          <TouchableOpacity
            {...{ key: state.key, activeOpacity: 0.72, onPress }}
          >
            <Animated.Text {...{ style: styles.mailto }}>
              {output(content, state)}
            </Animated.Text>
          </TouchableOpacity>
        );
      },
    },
    newline: {
      react(_: any, __: any, state: any) {
        return (
          <Animated.Text {...{ key: state.key, style: styles.newline }}>
            {'\n'}
          </Animated.Text>
        );
      },
    },
    paragraph: {
      react({ content }: any, output: any, state: any) {
        return (
          <Animated.View {...{ key: state.key, style: styles.paragraph }}>
            {output(content, state)}
          </Animated.View>
        );
      },
    },
    strong: {
      react({ content }: any, output: any, state: any) {
        state.withinText = true;
        return (
          <Animated.Text {...{ key: state.key, style: styles.strong }}>
            {output(content, state)}
          </Animated.Text>
        );
      },
    },
    table: {
      react({ header, cells }: any, output: any, state: any) {
        let headers = map(header, (content, key: any) => {
          return (
            <Animated.Text
              {...{
                key,
                style: [
                  { color: 'black' },
                  styles.strong,
                  { paddingHorizontal: 16 },
                ],
              }}
            >
              {output(content, state)}
            </Animated.Text>
          );
        });
        let _header = (
          <Animated.View {...{ style: [styles['tableHeader']] }}>
            {headers}
          </Animated.View>
        );
        let rows = map(cells, (row, r: any) => {
          let _cells = map(row, (content, c) => {
            return (
              <Animated.View {...{ key: c, style: [styles['tableRowCell']] }}>
                {output(content, state)}
              </Animated.View>
            );
          });
          let rowStyles = [styles['tableRow']];
          // eslint-disable-next-line
          if (cells.length - 1 === r) rowStyles.push(styles['tableRowLast']);
          return (
            <Animated.View {...{ key: r, style: rowStyles }}>
              {_cells}
            </Animated.View>
          );
        });
        return (
          <Animated.ScrollView
            {...{ key: state.key, style: styles.table, horizontal: true }}
          >
            <Animated.View>
              {_header}
              {rows}
            </Animated.View>
          </Animated.ScrollView>
        );
      },
    },
    text: {
      react({ content }: any, _: any, state: any) {
        let words = content.split(' ');
        words = map(words, (word, i: any) => {
          if (i !== words.length - 1) word = word + ' ';
          let textStyles = [styles.text];
          if (!state.withinText) textStyles.push(styles['plainText']);
          return (
            <Animated.Text {...{ key: i, style: textStyles }}>
              {word}
            </Animated.Text>
          );
        });
        return words;
      },
    },
    u: {
      react({ content }: any, output: any, state: any) {
        state.withinText = true;
        return (
          <Animated.Text {...{ key: state.key, style: styles.u }}>
            {output(content, state)}
          </Animated.Text>
        );
      },
    },
    url: {
      react({ content, target }: any, output: any, state: any) {
        state.withinText = true;
        let onPress = async () => await SafeOpenUrl(target);
        return (
          <TouchableOpacity
            {...{ key: state.key, activeOpacity: 0.72, onPress }}
          >
            <Animated.Text {...{ style: styles.url }}>
              {output(content, state)}
            </Animated.Text>
          </TouchableOpacity>
        );
      },
    },
  };
}
