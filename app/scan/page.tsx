
// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import jsQR from 'jsqr';
// import { verifyQR } from '@/libs/api';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// interface VerifyResponse {
//   message: string;
//   lastScan?: string | null;
//   name?: string;
//   organization?: string;
// }

// export default function Scan() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [result, setResult] = useState<VerifyResponse | null>(null);

//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
//       .then(stream => {
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.play();
//           requestAnimationFrame(scan);
//         }
//       })
//       .catch(err => {
//         console.error('Camera error:', err);
//         toast.error('Failed to access camera', {
//           position: 'top-right',
//           autoClose: 3000,
//         });
//       });

//     const scan = () => {
//       if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
//         const canvas = canvasRef.current;
//         if (canvas) {
//           canvas.height = videoRef.current.videoHeight;
//           canvas.width = videoRef.current.videoWidth;
//           const ctx = canvas.getContext('2d');
//           if (ctx) {
//             ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//             const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//             const code = jsQR(imageData.data, imageData.width, imageData.height);

//             if (code) {
//               verifyQRCode(code.data);
//             }
//           }
//         }
//       }
//       requestAnimationFrame(scan);
//     };
//   }, []);

//   const verifyQRCode = async (qrData: string) => {
//     try {
//       const res = await verifyQR({ qrData });
//       setResult(res);
//       toast.success('QR code verified successfully', {
//         position: 'top-right',
//         autoClose: 3000,
//       });
//     } catch (err: any) {
//       console.log('Verify error:', err);
//       setResult(null);
//       toast.error(err.message || 'Error verifying QR code', {
//         position: 'top-right',
//         autoClose: 3000,
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
//       <div className="w-full max-w-md">
//         <h1 className="text-2xl font-bold text-center mb-4">Scan QR Code</h1>
//         <video ref={videoRef} className="w-full rounded-lg shadow-md" />
//         <canvas ref={canvasRef} className="hidden" />
//         {result && (
//           <div className="mt-6 p-6 bg-white rounded-lg shadow-xl border border-blue-200 animate-fade-in">
//             <h2 className="text-xl font-semibold text-blue-600 mb-2">{result.message}</h2>
//             <p className="text-gray-700">
//               <strong>Name:</strong> {result.name || 'N/A'}
//             </p>
//             <p className="text-gray-700">
//               <strong>Organization:</strong> {result.organization || 'N/A'}
//             </p>
//             <p className="text-gray-700">
//               <strong>Last Scan:</strong> {result.lastScan ? new Date(result.lastScan).toLocaleString() : 'N/A'}
//             </p>
//           </div>
//         )}
//       </div>
//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// }   




'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import jsQR from 'jsqr';
import { verifyQR } from '@/libs/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface VerifyResponse {
  message: string;
  lastScan?: string | null;
  name?: string;
  organization?: string;
}

export default function Scan() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'scanner') {
      toast.error('Unauthorized: Scanner access required');
      router.push('/login');
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          requestAnimationFrame(scan);
        }
      })
      .catch(err => {
        console.error('Camera error:', err);
        toast.error('Failed to access camera', {
          position: 'top-right',
          autoClose: 3000,
        });
      });

    const scan = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.height = videoRef.current.videoHeight;
          canvas.width = videoRef.current.videoWidth;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
              verifyQRCode(code.data);
            }
          }
        }
      }
      requestAnimationFrame(scan);
    };
  }, [router]);

  const verifyQRCode = async (qrData: string) => {
    try {
      const token = localStorage.getItem('token') || '';
      const res = await verifyQR({ qrData }, token);
      setResult(res);
      toast.success('QR code verified successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err: any) {
      console.log('Verify error:', err);
      setResult(null);
      toast.error(err.message || 'Error verifying QR code', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Scan QR Code</h1>
        <video ref={videoRef} className="w-full rounded-lg shadow-md" />
        <canvas ref={canvasRef} className="hidden" />
        {result && (
          <div className="mt-6 p-6 bg-white rounded-lg shadow-xl border border-blue-200 animate-fade-in">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">{result.message}</h2>
            <p className="text-gray-700">
              <strong>Name:</strong> {result.name || 'N/A'}
            </p>
            <p className="text-gray-700">
              <strong>Organization:</strong> {result.organization || 'N/A'}
            </p>
            <p className="text-gray-700">
              <strong>Last Scan:</strong> {result.lastScan ? new Date(result.lastScan).toLocaleString() : 'N/A'}
            </p>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}