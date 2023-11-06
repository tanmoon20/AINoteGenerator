import FourEdgeNode from "./nodeType";

export const initialNodes = [
    { id: '1', type: FourEdgeNode, position: { x: 0, y: 0 }, data: { label: 'start' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];

export const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
