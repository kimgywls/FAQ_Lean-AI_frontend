import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/contexts/authContext";
import { useStore } from "@/contexts/storeContext";
import { usePublic } from "@/contexts/publicContext";
import ConvertSwitch from "@/components/component/ui/convertSwitch1";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

const Login = () => {  
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null); // 사용자 데이터 상태 추가
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { saveToken, token } = useAuth();
  const { storeID, setStoreID } = useStore();
  const { executeRecaptcha } = useGoogleReCaptcha(); // reCAPTCHA 실행 함수
  const { isPublicOn, togglePublicOn } = usePublic();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState("");

  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
  };

  // 로그인 요청 함수
  const handleLoginClick = async () => {
    if (!executeRecaptcha) {
      console.error("reCAPTCHA가 로드되지 않았습니다.");
      return;
    }

    try {
      const captchaToken = await executeRecaptcha("login"); // 'login' 액션에 대한 reCAPTCHA 실행
      console.log(captchaToken);

      const url = isPublicOn
        ? `${API_DOMAIN}/public/login/`
        : `${API_DOMAIN}/api/login/`;

      const response = await axios.post(url, {
        username,
        password,
        captcha: captchaToken,
      });

      const { access, public_id, store_id, user_data } = response.data;

      console.log("서버 응답:", response.data);

      // 토큰 저장
      await saveToken(access);

      // 사용자 데이터 및 storeID 설정
      setUserData(user_data);
      const id = isPublicOn ? public_id : store_id;
      setStoreID(id);
    } catch (error) {
      console.error("로그인 요청 중 오류 발생:", error);
      const errorMsg = error.response?.data?.error || "로그인에 실패했습니다";
      setErrorMessage(errorMsg);
      setShowErrorMessageModal(true);
    }
  };

  // token, storeID, userData 변경 감지
  /*
  useEffect(() => {
    if (token && storeID && userData) {
      console.log("userData.subscription : ", userData.subscription);
      const hasSubscription = userData.subscription
        ? userData.subscription.is_active
        : false;

        console.log("hasSubscription : ", hasSubscription);

      // 구독 여부에 따라 페이지 이동
      if (hasSubscription) {
        if (isPublicOn) {
          router.push("/mainPageForPublic");
        } else {
          router.push("/mainPage");
        }
      } else {
        router.push("/subscriptionPlans");
      }
    }
  }, [token, storeID, userData, isPublicOn]);
  */

  useEffect(() => {
    if (token && storeID) {
      // 구독 여부에 따라 페이지 이동

      if (isPublicOn) {
        router.push("/mainPageForPublic");
      } else {
        router.push("/mainPage");
      }
    }
  }, [token, storeID, isPublicOn]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLoginClick();
    }
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setLoadingProvider(provider);

    let authUrl = "";

    if (provider === "kakao") {
      if (provider === "kakao") {
        authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
      }
    } else if (provider === "naver") {
      authUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI}&response_type=code`;
    }

    //console.log("handleSocialLogin - 이동할 URL:", authUrl); // ✅ 로그 추가 (URL 확인)

    // 짧은 지연 후 리다이렉트 (로딩 상태를 보여줄 시간 확보)
    setTimeout(() => {
      window.location.href = authUrl;
    }, 500);
  };

  return (
    <div className="bg-violet-50 flex justify-center items-center h-screen font-sans">
      <div
        className="bg-white rounded-lg shadow-lg p-8 max-w-md m-10"
        style={{ width: "400px" }}
      >
        <h1
          className="text-3xl font-bold text-indigo-600 text-center mb-8 cursor-pointer"
          style={{ fontFamily: "NanumSquareExtraBold" }}
          onClick={() => router.push("/")}
        >
          MUMUL
        </h1>
        <div className="space-y-4">
          <ConvertSwitch
            isPublicOn={isPublicOn}
            togglePublicOn={togglePublicOn} // toggle 함수 전달
          />
          <div className="flex items-center border rounded-md px-4 py-2">
            <FontAwesomeIcon icon={faUser} />
            <input
              type="text"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="ml-2 w-full border-none focus:ring-0"
            />
          </div>

          <div className="flex items-center border rounded-md px-4 py-2">
            <FontAwesomeIcon icon={faLock} />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ml-2 w-full border-none focus:ring-0"
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="w-full flex flex-col items-center text-center justify-center">
            {/* SNS 로그인 텍스트 & 구분선 */}
            <div className="w-full flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-4 text-gray-600 whitespace-nowrap">
                SNS 로그인
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* SNS 버튼 */}
            <div className="flex space-x-4">
              <button
                className="text-sm text-gray-600 hover:text-gray-800 relative"
                onClick={() => handleSocialLogin("kakao")}
                disabled={isLoading}
              >
                {isLoading && loadingProvider === "kakao" ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-yellow-100 rounded-full opacity-80">
                    <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : null}
                <img
                  src="/images/kakaotalk_btn_icon.png"
                  className={`w-10 h-10 p-1 rounded-full ${
                    isLoading && loadingProvider !== "kakao" ? "opacity-50" : ""
                  }`}
                  style={{ backgroundColor: "#FEE500" }}
                />
              </button>

              <button
                className="text-sm text-gray-600 hover:text-gray-800 relative"
                onClick={() => handleSocialLogin("naver")}
                disabled={isLoading}
              >
                {isLoading && loadingProvider === "naver" ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-100 rounded-full opacity-80">
                    <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : null}
                <img
                  src="/images/naver_btn_icon.png"
                  className={`w-10 h-10 p-1 rounded-full ${
                    isLoading && loadingProvider !== "naver" ? "opacity-50" : ""
                  }`}
                  style={{ backgroundColor: "#03C75A" }}
                />
              </button>
            </div>
          </div>

          <button
            className="bg-indigo-500 text-white text-lg font-semibold py-2 px-4 rounded-full w-full"
            onClick={handleLoginClick}
          >
            로그인
          </button>
        </div>

        <div className="mt-4 text-center text-gray-500">
          <p>
            <Link
              href="/signupType"
              className="hover:underline text-blue-500 m-1"
            >
              회원가입
            </Link>
            {" | "}
            <Link
              href="/findAccount"
              className="hover:underline text-blue-500 m-1"
            >
              계정찾기
            </Link>
          </p>
        </div>

        <ModalErrorMSG
          show={showErrorMessageModal}
          onClose={handleErrorMessageModalClose}
        >
          <p style={{ whiteSpace: "pre-line" }}>
            {typeof errorMessage === "object"
              ? Object.entries(errorMessage).map(([key, value]) => (
                  <span key={key}>
                    {key}:{" "}
                    {Array.isArray(value) ? value.join(", ") : value.toString()}
                    <br />
                  </span>
                ))
              : errorMessage}
          </p>
        </ModalErrorMSG>
      </div>
    </div>
  );
};

export default Login;
