import React, { useEffect, useRef } from "react";
import "./App.css";
import data from "./data.json";
import {
  atomFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";

type Attributes = { [key: string]: string | undefined };

type NodeInterface = {
  id: string;
  nodeName: string;
  parent?: string | null;
  children?: NodeInterface[];
  attributes?: Attributes;
  textContent?: string;
};

const NodeAtom = atomFamily<NodeInterface | null, string>({
  key: "node",
  default: null,
});

interface MountProps {
  data: NodeInterface;
  parent: string | null;
}

const Mount = ({ data, parent }: MountProps) => {
  console.log(data.nodeName, data.id, parent);
  const [node, setNode] = useRecoilState(NodeAtom(data.id));

  useEffect(() => {
    if (!node) {
      setNode({
        ...data,
        parent,
        children: data.children?.map((child) => {
          if (child.nodeName === "#text") return child;
          return {
            id: child.id,
            nodeName: child.nodeName,
          };
        }),
      });
    }
  }, [data, node, parent, setNode]);

  return (
    <>
      {data.children?.forEach((child) => {
        return <Mount data={child} parent={data.id} />;
      })}
    </>
  );
};

interface NodeProps {
  id: string;
}

const Node = ({ id }: NodeProps) => {
  const [node, setNode] = useRecoilState(NodeAtom(id));
  if (!node) return null;

  const children = node.children?.map((child, i) => {
    if (child.nodeName === "#text") {
      return child.textContent;
    } else {
      return <Node key={i} id={child.id} />;
    }
  });
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

  if (!init.current) return <Mount data={data} parent="form" />;

  return (
    <main>
      <div className="container">
        <form>
          <Node id={data.id} />
          <input type="submit" value="Submit" />
        </form>
      </div>
    </main>
  );
}

export default App;
