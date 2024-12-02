// src/declarations.d.ts

declare module 'lottie-react-native' {
  import {Component} from 'react';
  import {ViewProps} from 'react-native';

  export interface AnimationProps extends ViewProps {
    source: any;
    autoPlay?: boolean;
    loop?: boolean;
    style?: any;
  }

  export default class LottieView extends Component<AnimationProps> {}
}
