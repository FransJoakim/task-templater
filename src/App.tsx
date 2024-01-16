import React, { useCallback, useEffect, useRef } from "react";
import "./App.css";
import data from "./data.json";
import {
  atomFamily,
  selectorFamily,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState,
} from "recoil";

type Attributes = { [key: string]: string | undefined };

interface NodeInterface {
  id: string;
  nodeName: string;
  children: NodeInterface[];
  attributes: Attributes | null;
  textContent: string | null;
}

const NodeAtom = atomFamily<NodeInterface, string>({
  key: "node",
  default: (id) => ({
    id,
    nodeName: "",
    children: [],
    attributes: null,
    textContent: null,
  }),
});

// @ts-ignore
// const NestedState = selectorFamily<any, string>({
//   key: "nested",
//   get:
//     (id) =>
//     ({ get }) => {
//       const node = get(NodeAtom(id));
//       return {
//         ...node,
//         children: node.children.map((child) => get(NestedState(child.id))),
//       };
//     },
// });

const PushChild = selectorFamily<any, string>({
  key: "pushChild",
  set:
    (id) =>
    ({ get, set }, child) => {
      const childNode = get(NodeAtom(child.id));
      if (childNode.nodeName) return;
      const node = get(NodeAtom(id));
      set(NodeAtom(id), {
        ...node,
        children: [...node.children, { ...child, children: [] }],
      });
    },
});

const LIST = "b1d05756-9085-4806-9031-6cc12067b73a";

const bar = {
  id: "984ba8ea-3a82-44a8-9b7c-76r3eefa1d30",
  nodeName: "input",
  attributes: {
    type: "text",
  },
  children: [],
  textContent: null,
};

const foo = {
  id: "33dbd09d-fde0-4c93-b800-cb36ac145828",
  nodeName: "li",
  attributes: {
    label: "c",
  },
  children: [bar],
  textContent: null,
};

const Node = ({ id }: { id: string }) => {
  const [node, setNode] = useRecoilState(NodeAtom(id));
  if (!node.nodeName) return null;

  if (node.nodeName === "#text") {
    if (node.textContent === null) return null;
    return (
      <input
        value={node.textContent}
        onChange={(e) => setNode({ ...node, textContent: e.target.value })}
        style={{ border: "none" }}
      ></input>
    );
  }

  if (node.nodeName === "input")
    return React.createElement(node.nodeName, {
      disabled: true,
    });

  return React.createElement(
    node.nodeName,
    node.attributes,
    node.children.map((child) => <Node key={child.id} id={child.id} />)
  );
};

function App() {
  const init = useRef(false);
  // const state = useRecoilValue(NestedState("root"));
  const pushChild = useSetRecoilState(PushChild(LIST));

  const setAtom = useRecoilCallback(({ set }) => (node: NodeInterface) => {
    set(NodeAtom(node.id), {
      ...node,
      children: node.children?.map((child) => ({
        ...child,
        children: [],
      })),
    });
  });

  const nestAtom = useCallback(
    (node: NodeInterface) => {
      node.children.forEach((child) => {
        nestAtom(child);
      });
      setAtom(node);
    },
    [setAtom]
  );

  useEffect(() => {
    if (!init.current) {
      nestAtom(data);
      init.current = true;
    }
  }, [nestAtom, setAtom]);

  return (
    <main>
      <div className="container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            pushChild(foo);
            setAtom(bar);
            setAtom(foo);
          }}
        >
          <Node id={data.id} />
          <input type="submit" value="Submit" />
        </form>
      </div>
    </main>
  );
}

export default App;
