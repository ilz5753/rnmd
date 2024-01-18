import type { ReactNode } from 'react';
import type { TextStyle } from 'react-native';
import type { StyleProp } from 'react-native';
import React from 'react';
import { Text } from 'react-native';
// import { cloneDeep } from 'lodash';

export interface IRegexes {
  regex: RegExp;
  textStyle: StyleProp<TextStyle>;
}
export function RenderMD(regexes: IRegexes[], text: string) {
  // let copy = cloneDeep(text);
  let output: ReactNode[] = [];
  let lastIndex = 0;
  for (let { regex, textStyle } of regexes) {
    let match = regex.exec(text);
    if (match !== null) {
      const matchedText = match[0];
      // const textBeforeMatch = text.substring(lastIndex, match.index);
      const content = match[1];
      console.log({ matchedText, content });
      output.push(
        <Text {...{ key: lastIndex, style: [textStyle] }}>{content}</Text>
      );
      lastIndex = match.index + matchedText.length;
    }
  }
  //   while (_continue) {
  //     _continue = lastIndex < text.length;
  //   }
  console.log({ output });
  return output;
}
