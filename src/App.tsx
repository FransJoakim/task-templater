import React from "react";
import "./App.css";
import data from "./data.json";

type Attributes = { [key: string]: string | undefined };

type NodeInterface = {
  nodeName: string;
  attributes?: Attributes;
  children?: (string | NodeInterface)[];
};

const createChildNodes = (nodes: (string | NodeInterface)[]) => {
  return nodes.map((node, i) => {
    if (typeof node === "object") {
      return <Node key={i} node={node} />;
    } else {
      return node;
    }
  });
};

const Node = ({ node }: { node: NodeInterface }) => {
  const children = node.children ? createChildNodes(node.children) : null;
  return React.createElement(node.nodeName, node.attributes ?? null, children);
};

function App() {
  return (
    <main>
      <div className="container">
        <form>
          <Node node={data} />
          <input type="submit" value="Submit" />
        </form>
      </div>
    </main>
  );
}

export default App;
