import { css } from "@linaria/core";
import { lazy, memo, Suspense, useEffect, type ComponentProps } from "react";
import type { JsonView } from "react-json-view-lite";

const TextAreaView = ({ data }: { data: object }) => {
  return (
    <textarea
      readOnly
      tabIndex={0}
      className={cssJsonDataContainer}
      defaultValue={JSON.stringify(data, null, 2)}
    />
  )
}

const LaziedViewer = lazy(() => import("react-json-view-lite").then((m) => ({
  default: (p: ComponentProps<typeof JsonView>) => {
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
          container: cssJsonDataContainer
        }}
        shouldExpandNode={(level) => level < 2}
        {...p}
      />
    )
  }
  ,
})));

export const AnimationFileDataViewerJsonViewer = memo(({ data }: { data: object }) => {
  return (
    <Suspense fallback={
      <TextAreaView data={data} />
    }>
      <LaziedViewer
        data={data}
      />
    </Suspense>
  );
});

const cssJsonDataContainer = css`
  height: 100%;
  background: #F1F1F1;
  padding: 0.5rem;
  font-size: 1rem;
  line-height: 1.5;
  width: 48rem;
  font-family: monospace;
  border: 1px solid var(--borderColor);
  min-height: 720px;

  output& {
    opacity: 0.8;
  }

  [role="treeitem"] {
    padding: 0 1.5rem;
  }
  > [role="treeitem"] {
    padding: 0;
  }
`;
