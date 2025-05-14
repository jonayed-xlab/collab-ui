// import React from "react";
// import { WorkPackage, WorkPackageResponseWrapper } from "../../types";
// import WorkPackageCard from "./WorkPackageCard";

// interface WorkPackageDetailsProps {
//   workPackageData: WorkPackageResponseWrapper;
// }

// const WorkPackageDetails: React.FC<WorkPackageDetailsProps> = ({ workPackageData }) => {
//   const { workPackage, relatedWorkPackages, childWorkPackages } = workPackageData;

//   return (
//     <div className="space-y-6">
//       {/* Main work package details */}
//       <div className="bg-white border border-border rounded-lg p-6">
//         <h2 className="text-xl font-bold mb-4">{workPackage.title}</h2>
//         <p className="mb-4">{workPackage.description}</p>
        
//         {/* Additional work package details can be added here */}
//       </div>

//       {/* Child work packages section */}
//       {childWorkPackages && childWorkPackages.length > 0 && (
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold mb-3">Child Work Packages</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {childWorkPackages.map((childWp) => (
//               <WorkPackageCard 
//                 key={childWp.id} 
//                 workPackage={childWp} 
//                 showProject={true} 
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Related work packages section */}
//       {relatedWorkPackages && relatedWorkPackages.length > 0 && (
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold mb-3">Related Work Packages</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {relatedWorkPackages.map((relatedWp) => (
//               <WorkPackageCard 
//                 key={relatedWp.id} 
//                 workPackage={relatedWp} 
//                 showProject={true} 
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WorkPackageDetails;