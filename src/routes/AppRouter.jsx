// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// import DeliveryPage from '../features/delivery/pages/DeliveryPage';
// import { LoginForm } from '../features/auth/pages/LoginForm';

// import ProtectedRoute from './ProtectedRoute';

// export default function AppRouter() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Public */}
//         <Route path="/login" element={<LoginForm />} />

//         {/* Protected */}
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <DeliveryPage />
//             </ProtectedRoute>
//           }
//         />

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/" replace />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }