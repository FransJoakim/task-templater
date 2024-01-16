import React, { useCallback, useEffect, useRef } from "react";
import "./App.css";
import data from "./data.json";
import {
  atomFamily,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
} from "recoil";

type Attributes = { [key: string]: string | undefined };

type BaseInterface = {
  id: string;
  nodeName: string;
};

interface NodeInterface extends BaseInterface {
  children: BaseInterface[];
  attributes: Attributes | null;
  textContent: string | null;
}

interface NestedNodeInterface extends NodeInterface {
  children: NestedNodeInterface[];
}

const NodeAtom = atomFamily<NodeInterface | null, string>({
  key: "node",
  default: null,
});

const nestChildNodes = (children: BaseInterface[]) => {
  return children?.map((child) => <Node key={child.id} id={child.id} />);
};

const Node = ({ id }: { id: string }) => {
  console.log("go");
  const [node, setNode] = useRecoilState(NodeAtom(id));
  console.log("node", node);
  if (!node) return null;

  const children = nestChildNodes(node.children);
  const Component = (
    <span style={{ display: "flex" }}>
      {React.createElement(node.nodeName, {
        ...node.attributes,
        onClick: (e: React.MouseEvent<Element, MouseEvent>) => {
          e.stopPropagation();
          console.log("clicked", node.nodeName);
        },
        children,
      })}
      <button>click</button>
    </span>
  );

  // needs function to add components to state
  // accesses and sets parent node
  // i.e. inserts or deletes node from parent children list

  return Component;
};

function App() {
  const init = useRef(false);

  const setAtom = useRecoilCallback(
    ({ set }) =>
      (node: NestedNodeInterface) => {
        console.log("set", {
          ...node,
          children: data.children?.map((child) => ({
            id: child.id,
            nodeName: child.nodeName,
          })),
        });
        set(NodeAtom(node.id), {
          ...node,
          children: data.children?.map((child) => ({
            id: child.id,
            nodeName: child.nodeName,
          })),
        });
      }
  );

  const nestAtom = useCallback(
    (node: NestedNodeInterface) => {
      node.children.forEach((child) => {
        nestAtom(child);
      });
      setAtom(node);
    },
    [setAtom]
  );

  useEffect(() => {
    if (!init.current) {
      data.children.forEach((child) => {
        nestAtom(child);
      });
      setAtom(data);
      init.current = true;
    }
  }, [nestAtom, setAtom]);

  return <></>;
  // <main>
  //   <div className="container">
  //     <form>
  //       <Node id="form" />
  //       <input type="submit" value="Submit" />
  //     </form>
  //   </div>
  // </main>
}

export default App;
