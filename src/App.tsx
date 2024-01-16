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

function App() {
  const init = useRef(false);

  const setAtom = useRecoilCallback(
    ({ set }) =>
      (node: NestedNodeInterface) => {
        console.log("setAtom", node.nodeName);
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

  const nestChildNodes = (children: BaseInterface[]) => {
    return children?.map((child) => {
      console.log("child", child.nodeName);
      return <Node key={child.id} id={child.id} />;
    });
  };
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
    if (node.nodeName === "#text") return node.textContent;
    return React.createElement(
      node.nodeName,
      null,
      <OtherNode4 id={"56b0b5a9-9b9a-4b9e-9b9a-9b9a9b9a9b9c"} />
    );
  };
  const OtherNode2 = ({ id }: { id: string }) => {
    const node = useRecoilValue(NodeAtom(id));
    console.log("node", node?.nodeName);
    if (!node) return null;
    if (node.nodeName === "#text") return node.textContent;
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

    return React.createElement(
      "button",
      null,
      <OtherNode1 id={"c578c99d-db6b-4193-9e18-cc44536e3aa6"} />
    );
    // return React.createElement(
    //   node.nodeName,
    //   null,
    //   nestChildNodes(node.children)
    // );
  };

  return (
    <main>
      <div className="container">
        <form>
          <Node id="form" />
          {/* <input type="submit" value="Submit" /> */}
        </form>
      </div>
    </main>
  );
}

export default App;
