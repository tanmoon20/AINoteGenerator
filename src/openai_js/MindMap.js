import { Col, Row } from "reactstrap";
import {Card, CardBody, Button} from "reactstrap";
import {useState} from 'react'
import React, { useCallback, useLayoutEffect } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    useNodesState,
    useEdgesState,
    addEdge,
    NodeOrigin,
    Panel,
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
              onNodesChange={onNodesChange}
              onConnect={onConnect}
              nodeOrigin={nodeOrigin}
              fitView
              >
              <Controls />
              <MiniMap />
              <Panel position="top-right">
                <div style={{ width: '100%', height: '100vh', border: '1px solid #000' }}>
                  <Button className="btn" color="primary" size="lg" onClick={() => onLayout({ direction: 'DOWN' })}>vertical layout</Button>
                  
                  <Button className="btn" color="primary" size="lg" onClick={() => onLayout({ direction: 'RIGHT' })}>horizontal layout</Button>
                </div>
              </Panel>
          </ReactFlow>
      </div>
  );
}

// const LayoutFlow = () => {
//   const [nodes, , onNodesChange] = useNodesState(initialNodes);
//   const [edges, , onEdgesChange] = useEdgesState(initialEdges);
//   const { getLayoutedElements } = useLayoutedElements();

//   return (
//       <div style={{ width: '100%', height: '100vh', border: '1px solid #000' }}>
//           <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           fitView
//           >
//           <Panel position="top-right">
//               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '3vh' }}>
//                   <Button className="btn" color="primary" size="lg"
//                   onClick={() =>
//                       getLayoutedElements({ 'elk.algorithm': 'layered', 'elk.direction': 'DOWN' })
//                   }
//                   >
//                   vertical layout
//                   </Button>
//                   <div style={{ margin: '10px' }}></div>
//                   <Button className="btn" color="primary" size="lg"
//                   onClick={() =>
//                       getLayoutedElements({ 'elk.algorithm': 'layered', 'elk.direction': 'RIGHT' })
//                   }
//                   >
//                   horizontal layout
//                   </Button>
//                   <div style={{ margin: '10px' }}></div>
//                   <Button className="btn" color="primary" size="lg"
//                   onClick={() =>
//                       getLayoutedElements({
//                       'elk.algorithm': 'org.eclipse.elk.radial',
//                       })
//                   }
//                   >
//                   radial layout
//                   </Button>
//                   <div style={{ margin: '10px' }}></div>
//                   <Button className="btn" color="primary" size="lg"
//                   onClick={() =>
//                       getLayoutedElements({
//                       'elk.algorithm': 'org.eclipse.elk.force',
//                       })
//                   }
//                   >
//                   force layout
//                   </Button>
//               </div>
//           </Panel>
//           </ReactFlow>
//       </div>
//     );
// }

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

const MindMap = (fileText) => {

  console.log("mindmap")
  console.log(fileText.fileText)
  function GenerateMindMap(){
    //store the node color of each hierarchy
    const [nodeColor,setNodeColor] = useState([]);
    
    const input = fileText.fileText

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
    <Row>
      <Col lg="12">
        <Card>
          <CardBody>
              {initialNodes.length === 0 ? GenerateMindMap() : null}
              <ReactFlowProvider>
                  <LayoutFlow />
              </ReactFlowProvider>
          </CardBody>
        </Card>
      </Col>
    </Row>   
  );
}

export default MindMap;