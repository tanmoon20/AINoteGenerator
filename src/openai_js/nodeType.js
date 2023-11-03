// import { useCallback } from "react";
// import { Handle, Position } from "reactflow";

// function FourEdgeNode({ data, isConnectable }) {
//   const onChange = useCallback((evt) => {
//     console.log(evt.target.value);
//   }, []);

//   return (
//     <div>
//       <Handle
//         type="target"
//         position={Position.Top}
//         isConnectable={isConnectable}
//       />
//       <div style={{border: '1px solid #000', padding: '5px', borderRadius:'5px'}}>
//         <label htmlFor="text">start</label>
//         {/* <input id="text" name="text" onChange={onChange} className="nodrag" /> */}
//       </div>
//       <Handle
//         type="source"
//         position={Position.Bottom}
//         id="a"
//         isConnectable={isConnectable}
//       />
//       <Handle
//         type="source"
//         position={Position.Left}
//         id="b"
//         isConnectable={isConnectable}
//       />
//       <Handle
//         type="source"
//         position={Position.Right}
//         id="b"
//         isConnectable={isConnectable}
//       />
//     </div>
//   );
// }

// export default FourEdgeNode;
