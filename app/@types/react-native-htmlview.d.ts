declare module 'react-native-htmlview' {
  import { Component } from 'react';
  import { StyleProp, TextStyle, ViewStyle } from 'react-native';

  interface HTMLViewProps {
    value: string; // HTML content
    stylesheet?: { [key: string]: StyleProp<TextStyle | ViewStyle> };
    onLinkPress?: (url: string) => void;
    onError?: (error: any) => void;
  }

  export default class HTMLView extends Component<HTMLViewProps> {}
}
