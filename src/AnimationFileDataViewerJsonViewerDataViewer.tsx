import { lazy, memo, useEffect, type ComponentProps } from "react";
import type { JsonView } from "react-json-view-lite";

export type AnimationFileDataViewerJsonViewerDataViewerProps = ComponentProps<typeof JsonView> & {
  expand: number;
  className: string;
}

export const AnimationFileDataViewerJsonViewerDataViewer = lazy(() => import("react-json-view-lite").then((m) => ({
  default: memo(({ expand, className, ...p }: AnimationFileDataViewerJsonViewerDataViewerProps) => {
    useEffect(() => {
      let destroyed = false;
      let styleLink: HTMLLinkElement | null = null
      import("react-json-view-lite/dist/index.css?url")
        .then(({ default: url }) => {
          if (destroyed) return;

          styleLink = document.createElement("link");
          styleLink.href = url;
          styleLink.type = 'text/css';
          styleLink.rel = "stylesheet";
          document.head.appendChild(styleLink);
        });
      return () => {
        destroyed = true;
        console.log('removing', styleLink);
        styleLink?.remove();
      };
    }, []);
    return (
      <m.JsonView
        style={{
          container: className,
        }}
        shouldExpandNode={(level) => level < expand}
        {...p}
      />
    )
  })
})));
