import {Card, CardBody} from "reactstrap";
import {useState} from 'react'
import React, { useCallback } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    NodeOrigin,
    Panel,
    Handle,
    NodeProps,
    Position,
    ReactFlowProvider,
    useReactFlow
} from 'reactflow';
 
import 'reactflow/dist/style.css';

import { initialNodes, initialEdges } from "./Nodes_Edges";


const ELK = require('elkjs')
const elk = new ELK()

const useLayoutedElements = () => {
    const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
    const defaultOptions = {
      'elk.algorithm': 'layered',
      'elk.layered.spacing.nodeNodeBetweenLayers': 100,
      'elk.spacing.nodeNode': 80,
    };
  
    const getLayoutedElements = useCallback((options) => {
      const layoutOptions = { ...defaultOptions, ...options };
      const graph = {
        id: 'root',
        layoutOptions: layoutOptions,
        children: getNodes(),
        edges: getEdges(),
      };
  
      elk.layout(graph).then(({ children }) => {
        // By mutating the children in-place we saves ourselves from creating a
        // needless copy of the nodes array.
        children.forEach((node) => {
          node.position = { x: node.x, y: node.y };
        });
  
        setNodes(children);
        window.requestAnimationFrame(() => {
          fitView();
        });
      });
    }, []);
  
    return { getLayoutedElements };
};

const defaultEdgeOptions = {
    type:'step'
};

const nodeOrigin=[0.5,0.5];

const LayoutFlow = () => {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);
    const { getLayoutedElements } = useLayoutedElements();

    return (
        <div style={{ width: '100%', height: '100vh', border: '1px solid #000' }}>
            <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            >
            <Panel position="top-right">
                <button
                onClick={() =>
                    getLayoutedElements({ 'elk.algorithm': 'layered', 'elk.direction': 'DOWN' })
                }
                >
                vertical layout
                </button>
                <button
                onClick={() =>
                    getLayoutedElements({ 'elk.algorithm': 'layered', 'elk.direction': 'RIGHT' })
                }
                >
                horizontal layout
                </button>
                <button
                onClick={() =>
                    getLayoutedElements({
                    'elk.algorithm': 'org.eclipse.elk.radial',
                    })
                }
                >
                radial layout
                </button>
                <button
                onClick={() =>
                    getLayoutedElements({
                    'elk.algorithm': 'org.eclipse.elk.force',
                    })
                }
                >
                force layout
                </button>
            </Panel>
            </ReactFlow>
        </div>
      );
}

export default function () {
    return (
        <Card>
            <CardBody>
                <ReactFlowProvider>
                    <LayoutFlow />
                </ReactFlowProvider>
            </CardBody>
        </Card>
    );
}

// const MindMap = (text) =>{
//     const[mindMap, setMindMap] = useState("");

//     // const input = text;
//     const input = "- Jupiter\n  - Fifth pWlanet from the Sun\n  - Largest planet in the Solar System\n  - Gas giant\n  - Mass is one-thousandth that of the Sun\n  - Mass is two-and-a-half times that of all other planets combined\n  - Brightest objects visible to the naked eye in the night sky\n  - Known to ancient civilizations since before recorded history\n  - Named after the Roman god Jupiter\n  - Can be bright enough to cast visible shadows when viewed from Earth\n  - On average, the third-brightest natural object in the night sky after the Moon and Venus";

//     function generateMindMap(){
//         console.log(input);
        
//         let startPos = input.indexOf("-"); //first occurence of "-"
//         let newlinePos = 0; //first occurence of "\n"
        
//         while(startPos !== -1)
//         {
//             newlinePos = input.indexOf("\n", newlinePos + 1)
//             startPos = input.indexOf("- ", startPos + 1)
//             console.log("newline " + newlinePos)
//             console.log("hierarchy " + (startPos - (newlinePos + 1)))
//             console.log(startPos);
//         }
//     }

//     const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//     const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

//     const onConnect = useCallback(
//         (params) => setEdges((eds) => addEdge(params, eds)),
//         [setEdges],
//     );

//     return (
//         <Card>
//             <CardBody className="d-grid gap-3">
//                 <div>
//                     <button onClick={generateMindMap}>Get MindMap From OpenAI API</button>
//                     {/* {mindMap !== "" ?
//                         <h3>mindMap: {mindMap}</h3>    
//                         :
//                         null
//                     } */}
//                 </div>
//                 <div style={{ width: '100%', height: '100vh', border: '1px solid #000' }}>
//                     <ReactFlow
//                         nodes={nodes}
//                         edges={edges}
//                         onNodesChange={onNodesChange}
//                         onEdgesChange={onEdgesChange}
//                         onConnect={onConnect}
//                         nodeOrigin={nodeOrigin}
//                         defaultEdgeOptions={defaultEdgeOptions}
//                         fitView
//                         >
//                         <Controls />
//                         <MiniMap />
//                         <Panel position="top-left">Mind Map</Panel>
//                     </ReactFlow>
//                 </div>
//             </CardBody>
//         </Card>
//     )
// };

// export default MindMap

