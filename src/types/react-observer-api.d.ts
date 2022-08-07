declare module 'react-observer-api' {
  export interface UseVisibilityHookOptions {
    root?: HTMLElement;
    threshold?: number;
    rootMargin?: string;
  }

  export const useVisibilityHook: (options?: UseVisibilityHookOptions) => {
    setElement: (ref: React.Ref<React.ReactNode>) => void;
    isVisible: boolean;
    forceVisible: () => void;
    forceCheck: () => void;
  };

  export function LazyLoad(props: {
    children: React.ReactNode;
    config?: UseVisibilityHookOptions;
    style?: CSSProperties;
    as?: string;
    forceVisible?: boolean;
  }): JSX.Element;

}