import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

function LandingMenu() {
  // 메뉴 창 상태 관리
  const [menuOpen, setMenuOpen] = useState(false);

  // 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그아웃 모달 상태 관리
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // useRouter : Next.js에서 페이지 이동을 위한 hook
  const router = useRouter();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // 로그인 상태에 따라 로그인 페이지로 이동하거나, 로그아웃 모달 창을 표시
  const handleLoginLogoutClick = () => {
    if (isLoggedIn) {
      setShowLogoutModal(true); // 로그아웃 모달을 표시
    } else {
      router.push('/login'); // 로그인 페이지로 이동
    }
  };

  // 실제 로그아웃 처리와 모달 창 닫음
  const handleLogoutConfirm = () => {
    setIsLoggedIn(false); // 로그인 상태를 로그아웃으로 변경
    setShowLogoutModal(false); // 모달을 닫음
    router.push('/'); // 로그아웃 후 root 페이지로 이동
  };

  // 모달에서 취소 선택했을 경우
  const handleLogoutCancel = () => {
    setShowLogoutModal(false); // 모달을 닫음
  };

  // 로그인 여부에 따라 마이페이지로 이동
  const goToMypage = () => {
    if (isLoggedIn) {
      router.push('/mypage');
    } else {
      router.push('/login');
    }
  };

  // 로그인 여부에 따라 공지사항 페이지로 이동
  const goToNotice = () => {
    if (isLoggedIn) {
      router.push('/notice');
    } else {
      router.push('/login');
    }
  };

  // 로그인 여부에 따라 FAQ 페이지로 이동
  const goToQnA = () => {
    if (isLoggedIn) {
      router.push('/qna');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="relative">
      {/* 햄버거 메뉴 */}
      <div className="absolute top-4 right-4 z-20">
        <button id="menuToggle" className="text-3xl focus:outline-none" onClick={toggleMenu}>
          &#9776; {/* 햄버거 메뉴 아이콘 */}
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div id="mainContent" className="flex flex-col justify-center items-start h-screen p-6">
        <h1 className="text-4xl font-bold">LEAN AI</h1>
        <h2 className="text-3xl font-bold mt-2">당신의 번거로움을 줄여주는 챗봇</h2>
        <p className="mt-4">AI 기술을 이용해 각종 이용객들의 질문을 더는 고민하지 않게 해드립니다.</p>
        <Link href="/login" passHref>
          <p className="mt-6 bg-red-500 text-white px-4 py-2 rounded cursor-pointer">체험하러가기</p>
        </Link>
      </div>

      {/* 풀스크린 오버레이 메뉴 */}
      <div className={`fixed inset-0 flex flex-col justify-center items-center text-center ${menuOpen ? 'flex' : 'hidden'} bg-white bg-opacity-80`}>
        <p className="mt-2 cursor-pointer" onClick={handleLoginLogoutClick}>Log in / Log out</p>
        <p className="mt-2 cursor-pointer" onClick={goToMypage}>마이 페이지</p>
        <p className="mt-2 cursor-pointer" onClick={goToNotice}>공지사항</p>
        <p className="mt-2 cursor-pointer" onClick={goToQnA}>자주 묻는 질문</p>
      </div>

      {/* 로그아웃 모달 창 */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4">로그아웃하시겠습니까?</p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              onClick={handleLogoutConfirm}
            >
              로그아웃
            </button>
            <button
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={handleLogoutCancel}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingMenu;