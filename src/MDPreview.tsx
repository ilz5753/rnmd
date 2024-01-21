import { merge } from 'lodash';
import React, {
  useMemo,
  type ComponentType,
  type PropsWithChildren,
} from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import Animated from 'react-native-reanimated';
// eslint-disable-next-line
import { defaultRules, parserFor, reactFor, ruleOutput } from 'simple-markdown';
import { MDPreviewRules } from './rules';
import { DefaultMDPreviewStyles, type TMDStyles } from './utils';
declare module 'simple-markdown' {
  export function reactFor(...input: any[]): any;
  export function ruleOutput(...input: any[]): any;
}
export interface IMDRule {
  regex?: RegExp;
  style?: StyleProp<TextStyle>;
  Render?: ComponentType<PropsWithChildren<{}>>;
}
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
export interface IMDPreviewColors {
  bg?: string;
}
export interface IMDPreview {
  styles?: TMDStyles;
  md: string;
  colors?: IMDPreviewColors;
}
function MDPreviewViaError({ styles = {}, md, colors = {} }: IMDPreview) {
  let { bg = 'white' } = colors;
  let RULES = useMemo(
    () =>
      merge(
        {},
        defaultRules,
        MDPreviewRules(merge({}, DefaultMDPreviewStyles, styles))
      ),
    [styles]
  );
  let PARSER = useMemo(() => parserFor(RULES), [RULES]);
  let parse = useMemo(
    () => PARSER(`${md}\n\n`, { inline: false }),
    [PARSER, md]
  );
  let renderer = useMemo(() => reactFor(ruleOutput(RULES, 'react')), [RULES]);
  return (
    <Animated.ScrollView
      {...{
        style: [{ backgroundColor: bg }],
      }}
    >
      {renderer(parse)}
    </Animated.ScrollView>
  );
}
export function MDPreview(props: IMDPreview) {
  return (
    <ErrorBoundary>
      <MDPreviewViaError {...props} />
    </ErrorBoundary>
  );
}
