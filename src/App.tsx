import React from "react";
import "./App.css";
import data from "./data.json";
import { atomFamily, useRecoilState, useSetRecoilState } from "recoil";

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

const InitAtoms = (data: NodeInterface, parent: string | null) => {
  const setNode = useSetRecoilState(NodeAtom(data.id));
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
  data.children?.forEach((child) => {
    if (child.nodeName === "#text") return;
    InitAtoms(child, data.id);
  });
};

interface NodeProps {
  data: NodeInterface;
}

const Node = ({ data }: NodeProps) => {
  const [node, setNode] = useRecoilState(NodeAtom(data.id));
  if (!node) return null;

  // rewrite: only gets data from state
  const children = !data.children
    ? null
    : data.children.map((child, i) => {
        if (typeof child === "object") {
          return <Node key={i} data={child} />;
        } else {
          return child;
        }
      });
  const Component = (
    <span style={{ display: "flex" }}>
      {React.createElement(data.nodeName, {
        ...data.attributes,
        onClick: (e: React.MouseEvent<Element, MouseEvent>) => {
          e.stopPropagation();
          console.log("clicked", data.nodeName);
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
  React.useEffect(() => {
    InitAtoms(data, null);
  }, []);

  return (
    <main>
      <div className="container">
        <form>
          <Node data={data} />
          <input type="submit" value="Submit" />
        </form>
      </div>
    </main>
  );
}

export default App;
