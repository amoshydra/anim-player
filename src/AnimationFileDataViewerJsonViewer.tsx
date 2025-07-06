import { css } from "@linaria/core";
import { memo, Suspense, useDeferredValue, useState } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";
import { AnimationFileDataViewerJsonViewerDataViewer } from "./AnimationFileDataViewerJsonViewerDataViewer";
import { Button, IconButton } from "./ComponentButtons";

const SimpleTextAreaView = ({ data }: { data: object }) => {
  return (
    <textarea
      readOnly
      tabIndex={0}
      className={cssJsonDataContainer}
      defaultValue={JSON.stringify(data, null, 2)}
    />
  )
}

export const AnimationFileDataViewerJsonViewer = memo(({ data }: { data: object }) => {
  const [showJsonViewer , setShowJsonViewer] = useState(true);
  const [expand, setExpand] = useState(2);
  const deferredExpand = useDeferredValue(expand);

  return (
    <div className={cssContainer}>

      <div className={cssIndentationControlContainer}>
        <Button
          onClick={() => {
            setShowJsonViewer(s => !s);
          }}
        >
          {showJsonViewer ? 'Show plain viewer' : 'Show JSON viewer'}
        </Button>

        {
          showJsonViewer && (
            <>
              <span>Show Level: {expand}</span>
              <IconButton
                onClick={() => {
                  setExpand(e => Math.max(e - 1, 2));
                }}
                aria-label="decrease"
              >
                <LuMinus />
              </IconButton>
              <IconButton
                onClick={() => {
                  setExpand(e => e + 1);
                }}
                aria-label="increase"
              >
                <LuPlus />
              </IconButton>
            </>
          )
        }
      </div>

      <Suspense
        fallback={<output className={cssJsonDataContainer}>Loading...</output>}
      >
        {
          !showJsonViewer
            ? <SimpleTextAreaView data={data} />
            : (
              <AnimationFileDataViewerJsonViewerDataViewer
                className={cssJsonDataContainer}
                data={data}
                expand={deferredExpand}
              />
            )
        }
      </Suspense>
    </div>
  );
});

const cssContainer = css`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  height: 100%;
  min-height: 0;
`;

const cssIndentationControlContainer = css`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const cssJsonDataContainer = css`
  height: 100%;
  min-height: 0;
  background: #F1F1F1;
  padding: 0.5rem;
  font-size: 1rem;
  line-height: 1.5;
  width: 48rem;
  font-family: monospace;
  border: 1px solid var(--borderColor);
  overflow: auto;

  [role="treeitem"] {
    padding: 0 1.5rem;
  }
  > [role="treeitem"] {
    padding: 0;
  }
`;
