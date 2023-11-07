import {Card, CardBody} from "reactstrap";
import {useEffect, useState} from 'react'
import React, { useCallback, useLayoutEffect } from 'react';
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

const initialNodes = [];
const initialEdges = [];

//elkjs tree
const ELK = require('elkjs')
const elk = new ELK()

const elkOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': '100',
    'elk.spacing.nodeNode': '80',
    "elk.layered.nodePlacement.bk.fixedAlignment":"BALANCED",
};

const getLayoutedElements = (nodes, edges, options = {}) => {
  const isHorizontal = options?.['elk.direction'] === 'RIGHT';
  const graph = {
    id: 'root',
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',

      // Hardcode a width and height for elk to use when layouting.
      width: 150,
      height: 50,
    })),
    edges: edges,
  };
  
  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
        position: { x: node.x, y: node.y },
      })),

      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};

function LayoutFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  const onLayout = useCallback(
    ({ direction, useInitialNodes = false }) => {
      const opts = { 'elk.direction': direction, ...elkOptions };
      const ns = useInitialNodes ? initialNodes : nodes;
      const es = useInitialNodes ? initialEdges : edges;

      getLayoutedElements(ns, es, opts).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);

        window.requestAnimationFrame(() => fitView());
      });
    },
    [nodes, edges]
  );

  // Calculate the initial layout on mount.
  useLayoutEffect(() => {
    onLayout({ direction: 'DOWN', useInitialNodes: true });
  }, []);

  const nodeOrigin=[0.5,0.5];

  return (
      <div style={{ width: '100%', height: '100vh', border: '1px solid #000' }}>
          <ReactFlow
              nodes={nodes}
              edges={edges}
              onConnect={onConnect}
              nodeOrigin={nodeOrigin}
              fitView
              >
              <Controls />
              <MiniMap />
              <Panel position="top-right">
                  <button onClick={() => onLayout({ direction: 'DOWN' })}>vertical layout</button>

                  <button onClick={() => onLayout({ direction: 'RIGHT' })}>horizontal layout</button>
              </Panel>
          </ReactFlow>
      </div>
  );
}

function getDarkColor() {
  var color = '#';
  for (var i = 0; i < 6; i++) {
      color += Math.floor(Math.random() * 10);
  }
  return color;
}

function AddNodes(tempId, tempLabel, nodeColor){
  const nextNode = [
    {
      id: tempId,
      data: { label: tempLabel },
      position: { x: 0, y: 0 },
      style: { backgroundColor: nodeColor, color: 'white' },
    },
  ]
  

  return(
    initialNodes.push(nextNode.at(0))
  )
}

function AddEdges(tempId, tempSource, tempTarget ){
    
  const nextEdge = [
      {
          id: tempId, source: tempSource, target: tempTarget, type: 'default' 
      }
  ]

  return(
    initialEdges.push(nextEdge.at(0))
  )
}

export default function () {

  function MindMap(){
    //store the node color of each hierarchy
    const [nodeColor,setNodeColor] = useState([]);
    // const input = "Hello\n- Jupiter\n  - Fifth planet from the Sun\n  - Largest planet in the Solar System\n  - Gas giant\n  - Mass is one-thousandth that of the Sun\n  - Mass is two-and-a-half times that of all other planets combined\n  - Brightest objects visible to the naked eye in the night sky\n  - Known to ancient civilizations since before recorded history\n  - Named after the Roman god Jupiter\n  - Can be bright enough to cast visible shadows when viewed from Earth\n  - On average, the third-brightest natural object in the night sky after the Moon and Venus";
    const input = "- World War II\n  - Causes\n    - Treaty of Versailles\n    - Expansionist Policies (Germany, Japan, Italy)\n    - Political Instability\n  - Major Allied Powers\n    - United States\n    - United Kingdom\n    - Soviet Union\n    - France\n  - Major Axis Powers\n    - Germany\n    - Japan\n    - Italy\n  - Key Events\n    - Invasion of Poland (1939)\n    - Battle of Stalingrad (1942-1943)\n    - D-Day (1944)\n    - Atomic Bombings of Hiroshima and Nagasaki (1945)\n  - Holocaust\n    - Nazi Genocide\n    - Concentration Camps\n    - Millions of Lives Lost\n  - Consequences\n    - Formation of the United Nations\n    - Division of Germany\n    - Beginning of the Cold War\n    - Global Impact\n  - End of War\n    - Surrender of Axis Powers (1945)\n    - Signing of Peace Treaties\n    - Nuremberg Trials";

    let bulletPos; 
    let text;

    console.log("nodeColor: ", nodeColor.at(0));

    const wordList = input.split("\n");
    wordList.forEach((word,index)=>{
      bulletPos = word.indexOf("- ")
      //only if word has bullet
      if(bulletPos !== -1){
        text = word.substring(bulletPos+2)
        let nodeId = bulletPos + "h" + index

        if(nodeColor.at(bulletPos/2) == null)
        {
          setNodeColor(nodeColor.push(getDarkColor()));
        }

        AddNodes(nodeId,text,nodeColor.at(bulletPos/2))

        //add edge according to hierarchy
        //only word that is not the highest in hierarchy, connect edge to its parent
        if(bulletPos !== 0)
        {
          let parentId;
          let parentIndex = index - 1;
          //get the parent
          for(let i = parentIndex; i >= 0; i--)
          {
            //only word contain bullet point
            if(wordList.at(i) != -1)
            {
              let parentBulletPos = wordList.at(i)
              if(bulletPos - parentBulletPos === 2)
              {
                parentId = (parentBulletPos + "h" + i)
                AddEdges(("e"+parentId+nodeId),parentId,nodeId)
                break;
              }
            }
          }
        }
        
        //bulletPos overwrite wordList
        wordList[index] = bulletPos
      }
    });
  }

  return (
    <Card>
        <CardBody>
            {initialNodes.length === 0 ? MindMap() : null}
            {console.log(initialNodes)}
            {console.log(initialEdges)}
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

