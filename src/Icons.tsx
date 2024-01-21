import React from 'react';
import { Path, Svg } from 'react-native-svg';

export interface IIcon {
  color: string;
}
function SearchIcon({ color }: IIcon) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Path
        d="M24 21.021l2.05 2.05a2.106 2.106 0 01-2.979 2.979L21.021 24M5.333 14.4a9.067 9.067 0 1118.134 0 9.067 9.067 0 01-18.134 0z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}
function EyeOpenIcon({ color }: IIcon) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Path
        d="M16 2.667v2.666m12 1.334l-2 2m-22-2l2 2m10 20.666c4.806 0 9.084-3.127 11.836-5.761 1.996-1.91 1.996-5.233 0-7.144-2.752-2.634-7.03-5.761-11.836-5.761s-9.084 3.127-11.836 5.761c-1.996 1.91-1.996 5.233 0 7.144 2.752 2.634 7.03 5.761 11.836 5.761zM20 20a4 4 0 11-8 0 4 4 0 018 0z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}
function EyeCloseIcon({ color }: IIcon) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Path
        d="M5.333 5.333l21.334 21.334m-8-7.686a4 4 0 01-5.648-5.648m13.125 7.477a29.906 29.906 0 002.03-1.947 4.113 4.113 0 000-5.726c-2.608-2.743-7.087-6.47-12.174-6.47-1.188 0-2.344.203-3.45.55M8.667 9.07c-1.945 1.242-3.603 2.765-4.84 4.066a4.113 4.113 0 000 5.726c2.607 2.743 7.086 6.47 12.173 6.47 2.49 0 4.836-.893 6.887-2.127"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}
function ChevronLeftIcon({ color }: IIcon) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Path
        d="M22 25l-12-9 12-9"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
function ChevronRightIcon({ color }: IIcon) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Path
        d="M10 7l12 9-12 9"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
function ArrowLeftIcon({ color }: IIcon) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Path
        d="M12.667 9L6 16m0 0l6.667 7M6 16h20"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
function ArrowRightIcon({ color }: IIcon) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Path
        d="M19.333 23L26 16m0 0l-6.667-7M26 16H6"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
function CloseIcon({ color }: IIcon) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Path
        d="M21.657 10.343L10.343 21.657m11.314 0L10.343 10.343"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
function SaveIcon({ color }: IIcon) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Path
        d="M21.654 6.25l.53-.53-.53.53zm3.427 3.426l-.53.53.53-.53zM9.583 26.33v.75h1.5v-.75h-1.5zm10.664 0v.75h1.5v-.75h-1.5zm-1.383-15.247a.75.75 0 000-1.5v1.5zm-6.399-1.5a.75.75 0 000 1.5v-1.5zm13.115 3.109v9.372h1.5v-9.372h-1.5zM22.064 25.58H9.266v1.5h12.798v-1.5zM5.75 22.064V9.266h-1.5v12.798h1.5zM9.266 5.75h9.372v-1.5H9.266v1.5zm11.858 1.03l3.426 3.426 1.06-1.06-3.425-3.427-1.06 1.06zm-2.486-1.03c.932 0 1.827.37 2.486 1.03l1.06-1.06a5.016 5.016 0 00-3.546-1.47v1.5zM9.266 25.58a3.516 3.516 0 01-3.516-3.516h-1.5a5.016 5.016 0 005.016 5.016v-1.5zm16.314-3.516a3.516 3.516 0 01-3.516 3.516v1.5a5.016 5.016 0 005.016-5.016h-1.5zm1.5-9.372c0-1.33-.528-2.606-1.47-3.547l-1.06 1.06c.66.66 1.03 1.554 1.03 2.487h1.5zM5.75 9.266A3.516 3.516 0 019.266 5.75v-1.5A5.016 5.016 0 004.25 9.266h1.5zm5.332 17.064v-6.399h-1.5v6.399h1.5zm1.383-7.782h6.4v-1.5h-6.4v1.5zm7.782 1.383v6.399h1.5v-6.399h-1.5zm-1.383-1.383c.764 0 1.383.62 1.383 1.383h1.5a2.883 2.883 0 00-2.883-2.883v1.5zm-7.782 1.383c0-.764.62-1.383 1.383-1.383v-1.5a2.883 2.883 0 00-2.883 2.883h1.5zm7.782-10.349h-6.399v1.5h6.4v-1.5z"
        fill={color}
      />
    </Svg>
  );
}
function CopyIcon({ color }: IIcon) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Path
        d="M11.399 11.399V9.266A4.266 4.266 0 0115.665 5h6.399a4.266 4.266 0 014.266 4.266v6.399a4.266 4.266 0 01-4.266 4.266h-2.133m-8.532-8.532H9.266A4.266 4.266 0 005 15.665v6.399a4.266 4.266 0 004.266 4.266h6.399a4.266 4.266 0 004.266-4.266v-2.133m-8.532-8.532h4.266a4.266 4.266 0 014.266 4.266v4.266"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
/**
 * `32 * 32` icons
 */
export const Icons = {
  SearchIcon,
  EyeOpenIcon,
  EyeCloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CloseIcon,
  SaveIcon,
  CopyIcon,
};
