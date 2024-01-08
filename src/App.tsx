import React from "react";
import "./App.css";
import data from "./data.json";
import { atomFamily, useRecoilState } from "recoil";

type Attributes = { [key: string]: string | undefined };

type NodeInterface = {
  id: string;
  nodeName: string;
  attributes?: Attributes;
  children?: (NodeInterface | string)[];
};

const NodeAtom = atomFamily<NodeInterface | null, string>({
  key: "node",
  default: null,
});

const Node = ({ data }: { data: NodeInterface }) => {
  // this whole motherfucker needs to be a object, with a method for rendering the component
  // the values (i.e. string value) needs to be accessible (as JSON) and part of a state that could be updated
  // this motherfucker also needs to be movable

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
      {React.createElement(
        data.nodeName,
        {
          ...data.attributes,
          onClick: (e: React.MouseEvent<Element, MouseEvent>) => {
            e.stopPropagation();
            console.log("clicked", data.nodeName);
          },
        },
        children
      )}
      <button>click</button>
    </span>
  );

  const [node, setNode] = useRecoilState(NodeAtom(data.id));
  if (!node) {
    setNode({
      ...data,
      children: data.children?.map((child) => {
        // TODO: This is a hack to get around the fact that strings are not valid nodes
        if (typeof child === "string") return "";
        return child.id;
      }),
    });
    return null;
  }
};

function App() {
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
