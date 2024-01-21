import { merge } from 'lodash';
import React, { useMemo } from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import Animated from 'react-native-reanimated';
// eslint-disable-next-line
import { defaultRules, parserFor, reactFor, ruleOutput } from 'simple-markdown';
import { MDPreviewRules, type IMDPreviewRulesColors } from './rules';
import { DefaultMDPreviewStyles, type TMDStyles } from './utils';
declare module 'simple-markdown' {
  export function reactFor(...input: any[]): any;
  export function ruleOutput(...input: any[]): any;
}
export interface IMDPreviewColors {
  bg?: string;
  ruleColors?: IMDPreviewRulesColors;
}
export interface IMDPreview {
  styles?: TMDStyles;
  md: string;
  colors?: IMDPreviewColors;
}
function MDPreviewViaError({ styles = {}, md, colors = {} }: IMDPreview) {
  let { bg = 'white', ruleColors } = colors;
  let RULES = useMemo(
    () =>
      merge(
        {},
        defaultRules,
        MDPreviewRules(merge({}, DefaultMDPreviewStyles, styles), ruleColors)
      ),
    [styles, ruleColors]
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
