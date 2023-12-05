import { createElement } from "react";
import "./App.css";
import data from "./data/nestedTask.json";

type Element = {
  type: string;
  value?: string | number;
  children?: Element[];
};

const elements: { [key: string]: Function } = {
  form: (e: Element, index: number) => (
    <form key={index}>{Nodes(e.children!)}</form>
  ),
  h3: (e: Element, index: number) => <h3 key={index}>{e.value}</h3>,
  div: (e: Element, index: number) => (
    <div key={index}>{Nodes(e.children!)}</div>
  ),
  p: (e: Element, index: number) => <p key={index}>{e.value}</p>,
  ul: (e: Element, index: number) => <ul key={index}>{Nodes(e.children!)}</ul>,
  li: (e: Element, index: number) => <li key={index}>{e.value}</li>,
  label: (e: Element, index: number) => <label key={index}>{e.value}</label>,
  text_input: (e: Element, index: number) => (
    <input type="text" value={e.value} key={index} />
  ),
};

const Node = ({ element }: { element: Element }) => {
  const children = element.children ? <Nodes nodes={element.children} /> : null;

  return createElement(element.type, { value: element.value }, children);
};

const Nodes = ({ nodes }: { nodes: Element[] }) => {
  return nodes.map((child, i) => {
    return <Node key={i} element={child} />;
  });
};

function App() {
  return (
    <main className="w-full h-screen flex justify-center items-center">
      <form>
        {data.map((e: Element, i) => elements[e.element](e, i))}
        <input type="submit" />
      </form>
    </main>
  );
}

export default App;
