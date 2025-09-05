// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import jsQR from 'jsqr';
// import axios, { AxiosResponse } from 'axios';

// interface VerifyResponse {
//   message: string;
//   scans: number;
// }

// export default function Scan() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [result, setResult] = useState<string>('');

//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
//       .then(stream => {
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.play();
//           requestAnimationFrame(scan);
//         }
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
//               verifyQR(code.data);
//             }
//           }
//         }
//       }
//       requestAnimationFrame(scan);
//     };
//   }, []);

//   const verifyQR = async (qrData: string) => {
//     try {
//       const res: AxiosResponse<VerifyResponse> = await axios.post('http://localhost:5000/api/users/verify', { qrData });
//       setResult(res.data.message);
//     } catch (err: any) {
//       setResult('Error verifying');
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center">
//       <video ref={videoRef} className="w-full max-w-md" />
//       <canvas ref={canvasRef} className="hidden" />
//       {result && <p className="mt-4 text-xl">{result}</p>}
//     </div>
//   );
// }


'use client';

import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { verifyQR } from '@/libs/api';
import { toast } from 'react-toastify';

interface VerifyResponse {
  message: string;
  scans: number;
  name?: string;
  organization?: string;
}

export default function Scan() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState<VerifyResponse | null>(null);

  useEffect(() => {
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
  }, []);

  const verifyQRCode = async (qrData: string) => {
    try {
      const res = await verifyQR({ qrData });
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
              <strong>Scan Count:</strong> {result.scans}
            </p>
            <div className="mt-4 text-center">
              <span className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                {result.scans > 1 ? 'Returning Guest' : 'First-Time Guest'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}