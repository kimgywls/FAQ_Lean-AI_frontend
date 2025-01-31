import React, { useState } from "react";
import { X, Check } from "lucide-react";
import axios from "axios";
import ModalMSG from "./modalMSG";
import ModalErrorMSG from "./modalErrorMSG";
import config from "../../../config";

const CardRegistrationModal = ({ userData, token, isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const plans = [
    {
      id: 1,
      name: "BASIC",
      price: 9900,
      description: "기본 구독",
      features: ["기본 FAQ 챗봇", "기본 분석 기능"],
    },
    {
      id: 2,
      name: "ENTERPRISE",
      price: 500000,
      description: "기업용 구독",
      features: ["CS 응대 챗봇", "사내 챗봇", "고급 분석 기능"],
    },
  ];

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessage("");
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const handleSuccessConfirm = () => {
    closeMessageModal();
    onClose();
    window.location.reload(); // 페이지 리로드
  };

  
  const handleRegisterClick = async () => {
    if (!selectedPlan) {
      setShowErrorModal(true);
      setErrorMessage("구독 플랜을 선택해주세요.");
      return;
    }
  
    try {
      const customer_uid = `customer_${userData.user_id}_${new Date().getTime()}`;
      let paymentResponse;
  
      // 1. 결제 요청 (PG를 통해 최초 결제)
      try {
        paymentResponse = await new Promise((resolve, reject) => {
          window.IMP.request_pay(
            {
              pg: config.pgCode,
              pay_method: "card",
              merchant_uid: `mid_${new Date().getTime()}`,
              customer_uid: customer_uid,
              name: `${selectedPlan.name} 구독 결제`,
              amount: selectedPlan.price,
              buyer_email: userData.email,
              buyer_name: userData.name || "테스트 유저",
              buyer_tel: userData.phone_number || "010-0000-0000",
            },
            function (rsp) {
              if (rsp.success) {
                resolve(rsp);
              } else {
                reject(new Error(rsp.error_msg || "결제 요청 실패"));
              }
            }
          );
        });
      } catch (err) {
        console.error("결제 요청 실패:", err.message);
        setShowErrorModal(true);
        setErrorMessage(`결제 요청 실패: ${err.message}`);
        return;
      }
  
      // 2. Billing Key 및 구독 플랜 등록
      try {
        await axios.post(
          `${config.apiDomain}/api/billing-key-register/`,
          {
            customer_uid: customer_uid,
            payment_id: paymentResponse.imp_uid,
            subscription_plan: selectedPlan.name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error("빌링 키 등록 실패:", err.response?.data || err.message);
        setShowErrorModal(true);
        setErrorMessage(
          `빌링 키 등록 실패: ${
            err.response?.data?.error || "서버와의 통신 중 오류가 발생했습니다."
          }`
        );
        return;
      }
  
      // 3. Payment Process API 호출 (정기 결제 예약 또는 즉시 결제)
      try {
        await axios.post(
          `${config.apiDomain}/api/payment-process/`,
          { merchant_uid: paymentResponse.merchant_uid },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error("결제 처리 실패:", err.response?.data || err.message);
        setShowErrorModal(true);
        setErrorMessage(
          `결제 처리 실패: ${
            err.response?.data?.error || "서버와의 통신 중 오류가 발생했습니다."
          }`
        );
        return;
      }
  
      // 성공 메시지 표시
      setShowMessageModal(true);
      setMessage(`${selectedPlan.name} 플랜 구독이 성공적으로 등록 및 결제되었습니다!`);
    } catch (error) {
      console.error("알 수 없는 오류 발생:", error.message);
      setShowErrorModal(true);
      setErrorMessage("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[600px] relative animate-in fade-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-gray-100 rounded-full p-2 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">구독 플랜 선택</h2>
          <p className="text-gray-500 mt-2">
            원하시는 구독 플랜을 선택하고 결제를 진행하세요
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                selectedPlan?.id === plan.id
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-300"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                {selectedPlan?.id === plan.id && (
                  <span className="bg-indigo-600 text-white p-1 rounded-full">
                    <Check size={16} />
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-indigo-600 mt-2">
                {plan.price.toLocaleString()}원
                <span className="text-sm text-gray-500 font-normal">/월</span>
              </p>
              <p className="text-gray-600 mt-2">{plan.description}</p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <Check size={16} className="text-indigo-600 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleRegisterClick}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
          >
            {selectedPlan
              ? `${selectedPlan.price.toLocaleString()}원 결제하기`
              : "플랜 선택하기"}
          </button>
        </div>
      </div>

      <ModalMSG show={showMessageModal} onClose={handleSuccessConfirm} title="Success">
        {message}
      </ModalMSG>

      <ModalErrorMSG show={showErrorModal} onClose={closeErrorModal}>
        {errorMessage}
      </ModalErrorMSG>
    </div>
  );
};

export default CardRegistrationModal;
