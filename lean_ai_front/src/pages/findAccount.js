import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft } from 'lucide-react';
import ModalMSG from '../components/modalMSG';
import ModalErrorMSG from '../components/modalErrorMSG';
import ModalResetPassword from '../components/resetPasswordModal';
import config from '../../config';

function FindAccount() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('id'); // 'id' 또는 'password'
  const [formData, setFormData] = useState({ id: '', phone: '', verificationCode: '' });
  const [codeSent, setCodeSent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // 제한 시간 초기값 0
  const [timerActive, setTimerActive] = useState(false); // 타이머 활성화 상태

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSendCode = async () => {
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMessage('- 제외 숫자만 입력하세요');
      setShowErrorMessageModal(true);
      return;
    }

    try {
      const response = await fetch(`${config.apiDomain}/api/send-code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: formData.id || undefined,
          phone: formData.phone,
          type: activeTab === 'id' ? 'findID' : 'findPW',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCodeSent(true);
        setModalMessage('인증번호가 발송되었습니다!');
        setIsModalOpen(true);
        setTimeLeft(180); // 제한 시간 3분으로 설정
        setTimerActive(true); // 타이머 활성화
      } else {
        setErrorMessage(data.message);
        setShowErrorMessageModal(true);
      }
    } catch (error) {
      setErrorMessage('인증 번호 요청 중 오류가 발생했습니다.');
      setShowErrorMessageModal(true);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await fetch(`${config.apiDomain}/api/verify-code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: formData.id || undefined,
          phone: formData.phone,
          code: formData.verificationCode,
          type: activeTab === 'id' ? 'findID' : 'findPW',
        }),
      });

      const data = await response.json();
      if (data.success) {
        if (activeTab === 'id') {
          sessionStorage.setItem('userId', data.user_id);
          sessionStorage.setItem('dateJoined', data.date_joined);
          router.push('/findAccountResult');
        } else {
          setShowResetPasswordModal(true);
        }
      } else {
        setErrorMessage(data.message);
        setShowErrorMessageModal(true);
      }
    } catch (error) {
      setErrorMessage('인증 확인 중 오류가 발생했습니다.');
      setShowErrorMessageModal(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
    setErrorMessage('');
  };

  const handleCloseResetPasswordModal = () => {
    setShowResetPasswordModal(false);
  };

  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      // 타이머가 활성화된 경우 매 초마다 감소
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer); // 타이머 종료
            setTimerActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    // 타이머를 정리
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && codeSent) {
      // 시간이 다 되었을 때 실행할 작업
      setErrorMessage('인증 시간이 초과되었습니다.');
      setShowErrorMessageModal(true);
      setCodeSent(false); // 코드 전송 상태 초기화
    }
  }, [timeLeft, codeSent]);

  // 분과 초를 계산
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-violet-50 flex items-center justify-center h-screen">
      <div className="bg-white w-full max-w-md mx-auto p-4 rounded-md shadow-md space-y-4">
        <div className="flex items-center">
          <ChevronLeft
            className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
            onClick={() => router.push('/login')}
          />
          <h1 className="text-2xl font-bold text-center text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>아이디/비밀번호 찾기</h1>
        </div>

        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab('id')}
            className={`w-1/2 py-2 text-center ${activeTab === 'id' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' : 'text-gray-500 '
              }`}
          >
            아이디 찾기
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`w-1/2 py-2 text-center ${activeTab === 'password' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' : 'text-gray-500 '
              }`}
          >
            비밀번호 찾기
          </button>
        </div>

        <div className="mt-4">
          {activeTab === 'password' && (
            <div className="flex items-center mb-4">
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className="flex-grow border-b border-gray-300 p-2 focus:outline-none"
                placeholder="아이디 입력"
              />
            </div>
          )}

          <div className="flex items-center mb-4">
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="flex-grow border-b border-gray-300 p-2 focus:outline-none"
              placeholder="휴대폰 번호 입력('-' 제외)"
            />
            <button
              onClick={handleSendCode}
              className="text-indigo-500 rounded-md px-4 py-2 hover:font-semibold whitespace-nowrap"
            >
              인증번호 전송
            </button>
          </div>

          <div className="flex flex-row space-x-5 items-center">
            <input
              type="text"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleInputChange}
              className="flex-grow border-b border-gray-300 p-2 focus:outline-none"
              placeholder="인증번호 입력"
            />
            {/* 유효시간 */}
            <p className="text-red-500 font-semibold text-lg px-3">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>

            <button
              onClick={handleVerifyCode}
              className="text-indigo-500 rounded-md px-4 py-2 hover:font-semibold whitespace-nowrap"
            >
              확인
            </button>
          </div>
        </div>
      </div>

      <ModalMSG title="Messege" show={isModalOpen} onClose={handleCloseModal}>
        {modalMessage}
      </ModalMSG>

      <ModalErrorMSG show={showErrorMessageModal} onClose={handleErrorMessageModalClose}>
        <p>{errorMessage}</p>
      </ModalErrorMSG>

      <ModalResetPassword show={showResetPasswordModal} onClose={handleCloseResetPasswordModal} phone={formData.phone} />
    </div>
  );
}

export default FindAccount;