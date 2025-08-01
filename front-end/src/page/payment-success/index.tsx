import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePayment } from '../../hooks/product/usePayment';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderToken = searchParams.get('token');
  const { token: userToken } = useAuth();

  const { captureOrder, loading, error } = usePayment(userToken ?? '');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!orderToken) {
      setStatus('error');
      setMessage('Không tìm thấy token thanh toán.');
      return;
    }

    let isCalled = false;

    const confirmPayment = async () => {
      if (isCalled) return; // Prevent multiple calls
      isCalled = true;

      try {
        const result: string = await captureOrder({ token: orderToken });

        console.log('Capture order result:', result);
        console.log('Compare result:', result === 'COMPLETED');

        if (result === 'COMPLETED') {
          setStatus('success');
          setMessage(`Thanh toán thành công! Trạng thái: ${result}`);
        } else {
          setStatus('error');
          setMessage(`Thanh toán thất bại. Trạng thái: ${result}`);
        }
      } catch (err: unknown) {
        setStatus('error');
        setMessage('Thanh toán thất bại. Vui lòng thử lại.');
        console.error(err);
      }
    };

    confirmPayment();
  }, [orderToken]);

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <Loader2 className='mx-auto animate-spin text-blue-500' size={48}/>
          <h2 className='text-xl font-semibold mt-4'>
            Đang xác nhận thanh toán...
          </h2>
        </>
      );
    }

    if (status === 'success') {
      return (
        <>
          <CheckCircle className='mx-auto text-green-500' size={64}/>
          <h2 className='text-2xl font-bold mt-4 text-green-600'>
            Thanh toán thành công!
          </h2>
          <p className='text-gray-600 mt-2'>{message}</p>

          <div className='mt-6 flex flex-col gap-3'>
            <Link
              to='/orders'
              className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700'
            >
              Xem đơn hàng
            </Link>
            <Link to='/' className='text-green-700 hover:underline'>
              Quay về trang chủ
            </Link>
          </div>
        </>
      );
    }

    return (
      <>
        <XCircle className='mx-auto text-red-500' size={64}/>
        <h2 className='text-2xl font-bold mt-4 text-red-600'>
          Thanh toán thất bại
        </h2>
        <p className='text-gray-600 mt-2'>
          {message || error || 'Có lỗi xảy ra.'}
        </p>

        <div className='mt-6 flex flex-col gap-3'>
          <Link
            to='/checkout'
            className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700'
          >
            Thử lại
          </Link>
          <Link to='/' className='text-red-700 hover:underline'>
            Quay về trang chủ
          </Link>
        </div>
      </>
    );
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-4'>
      <div className='bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center'>
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentSuccess;
