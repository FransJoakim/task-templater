import React, { useCallback, useEffect, useRef } from "react";
import "./App.css";
import data from "./data.json";
import { atomFamily, useRecoilCallback, useRecoilValue } from "recoil";

type Attributes = { [key: string]: string | undefined };
interface NodeInterface {
  id: string;
  nodeName: string;
  children: NodeInterface[];
  attributes: Attributes | null;
  textContent: string | null;
}

const NodeAtom = atomFamily<NodeInterface | null, string>({
  key: "node",
  default: null,
});

function App() {
  const init = useRef(false);

  const setAtom = useRecoilCallback(({ set }) => (node: NodeInterface) => {
    console.log("setAtom", node.nodeName);
    set(NodeAtom(node.id), {
      ...node,
      children: data.children?.map((child) => ({
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
  }, [nestAtom]);

  const OtherNode5 = ({ id }: { id: string }) => {
    const node = useRecoilValue(NodeAtom(id));
    console.log("node", node?.nodeName);
    if (!node) return null;
    if (node.nodeName === "#text") return node.textContent;
    return React.createElement(node.nodeName, null, null);
  };
  const OtherNode4 = ({ id }: { id: string }) => {
    const node = useRecoilValue(NodeAtom(id));
    console.log("node", node?.nodeName);
    if (!node) return null;
    if (node.nodeName === "#text") return node.textContent;
    return React.createElement(node.nodeName, null, null);
  };
  const OtherNode3 = ({ id }: { id: string }) => {
    const node = useRecoilValue(NodeAtom(id));
    console.log("node", node?.nodeName);
    if (!node) return null;
    const children = node.children.map((childNode) => childNode.textContent);
    if (node.nodeName === "#text") return node.textContent;
    return React.createElement(node.nodeName, null, children);
  };
  const OtherNode2 = ({ id }: { id: string }) => {
    const node = useRecoilValue(NodeAtom(id));
    console.log("node", node?.nodeName);
    if (!node) return null;
    if (node.nodeName === "#text") return node.textContent;
    const children = node.children.map((childNode, i) => {
      return (!!i ? 
        <OtherNode3 id={"8f509476-b586-49c9-b6a3-b6b6a61f2e1b"} />,
      :
      <OtherNode5 id={"bd5cb3a3-b7ac-456f-a68f-3afb2af78dd4"} />,
      )
    });

    return React.createElement(node.nodeName, null, [
      <OtherNode3 id={"8f509476-b586-49c9-b6a3-b6b6a61f2e1b"} />,
      <OtherNode5 id={"bd5cb3a3-b7ac-456f-a68f-3afb2af78dd4"} />,
    ]);
  };
  const OtherNode1 = ({ id }: { id: string }) => {
    const node = useRecoilValue(NodeAtom(id));
    console.log("node", node?.nodeName);
    if (!node) return null;
    if (node.nodeName === "#text") return node.textContent;
    return React.createElement(
      node.nodeName,
      null,
      <OtherNode2 id={"a0566331-ecac-47d2-9a9b-4d285a0a9bed"} />
    );
  };

  const Node = ({ id }: { id: string }) => {
    const node = useRecoilValue(NodeAtom(id));
    console.log("node", node?.nodeName);
    if (!node) return null;

    // if (node.nodeName === "#text") return node.textContent;
    // if (node.nodeName === "input") return <input />;
    // if (node.nodeName === "p")
    //   return (
    //     <p>
    //       {node.children.map((childNode) => (
    //         <Node id={childNode.id} />
    //       ))}
    //     </p>
    //   );
    // if (node.nodeName === "div")
    //   return (
    //     <div>
    //       {node.children.map((childNode) => (
    //         <Node id={childNode.id} />
    //       ))}
    //     </div>
    //   );
  };

  return (
    <main>
      <div className="container">
        <form>
          <OtherNode2 id={data.id} />
          {/* {data.children.map((childNode) => (
            <Node id={childNode.id} />
          ))} */}
          {/* <input type="submit" value="Submit" /> */}
        </form>
      </div>
    </main>
  );
}

export default App;
