import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { useStore } from '../contexts/storeContext';
import { X, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { fetchPublicDepartment } from '../fetch/fetchPublicDepart';
import TransferDepartmentModal from './transferDepartModal';
import ModalMSG from '../components/modalMSG';
import ModalErrorMSG from '../components/modalErrorMSG';


const ComplaintDetailModal = ({ show, onClose, complaint, newStatus, setNewStatus, handleStatusChange }) => {
  const { token } = useAuth();
  const { storeID } = useStore();
  const [department, setDepartment] = useState('');
  const [transferDepartModal, setTransferDepartModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (storeID && token) {
      fetchPublicDepartment({storeID}, token, setDepartment); // 피드 가져오기
    }
  }, [storeID, token]);

  useEffect(() => {
    if (department) {
      console.log("department : ",department)
    }
  }, [department]);


  const handleMessageModalClose = () => {
    setShowMessageModal(false);
    setMessage('');
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  const handleTransferModal = () => {
    setTransferDepartModal(true);
  };

  const handleTransferClose = () => {
    setTransferDepartModal(false);
  };

  const handleTransfer = () => {
    console.log(`Transferring complaint ID: ${complaint.complaint_id}`);
    // 전달 로직 추가 필요
    setTransferDepartModal(false); // 성공 시 모달 닫기
  };

  if (!show || !complaint) return null;

  const formatAuthorName = (fullName) => {
    if (!fullName || fullName.length === 0) {
      return '';
    }
    const firstCharacter = fullName[0];
    const remainingCharacters = 'O'.repeat(fullName.length - 1);
    return firstCharacter + remainingCharacters;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-10/12 max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col space-y-1">
            <h2 className="text-2xl font-bold" style={{ fontFamily: "NanumSquareExtraBold" }}>{complaint.title}</h2>
            <p className="text-sm text-gray-600 px-2" style={{ fontFamily: "NanumSquareBold" }}>
              접수 번호 : {complaint.complaint_number}
            </p>
          </div>
          <X
            className="absolute top-4 right-4 h-6 w-6 bg-indigo-500 rounded-full text-white p-1 cursor-pointer"
            onClick={onClose}
          />
        </div>
        <div className="space-y-4" style={{ fontFamily: "NanumSquareBold" }}>
          <div className="grid gap-3 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">작성자:</span>
              <span className="col-span-3" style={{ fontFamily: "NanumSquare" }}>{formatAuthorName(complaint.name)}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">접수일:</span>
              <span className="whitespace-nowrap" style={{ fontFamily: "NanumSquare" }}>
                {new Date(complaint.created_at).toISOString().replace('T', ' ').substring(0, 16)}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">상태:</span>
              <div className="col-span-3 flex items-center space-x-4" style={{ fontFamily: "NanumSquare" }}>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="bg-gray-100 p-2 rounded text-center"
                >
                  <option value="">변경 상태 선택</option>
                  <option value="접수">접수</option>
                  <option value="처리 중">처리 중</option>
                  <option value="완료">완료</option>
                </select>
                <Button
                  className="px-3"
                  size="sm"
                  onClick={() => handleStatusChange(complaint.complaint_id, newStatus)}
                  style={{ fontFamily: "NanumSquareBold" }}
                >
                  변경
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">내용:</span>
              <span className="col-span-3" style={{ fontFamily: "NanumSquare" }}>{complaint.content}</span>
            </div>

            {/* 새로운 부서 이동 디자인 */}
            <div className="mt-6 relative">
              <div className="absolute -left-6 top-0 bottom-0 w-2 bg-indigo-400"></div>
              <div className="bg-indigo-50 p-4 rounded-r-lg border-y border-r border-indigo-200">
                <div className="flex items-center justify-start">
                  <AlertCircle className="h-5 w-5 text-indigo-600 mr-3" />
                  <span className="text-gray-700 cursor-pointer mr-6" style={{ fontFamily: "NanumSquareBold" }}>
                    해당 민원을 담당하는 부서가 아니라면?
                  </span>
                  <button
                    className="text-indigo-500 hover:text-indigo-600 transition-colors"
                    style={{ fontFamily: "NanumSquareExtraBold", fontSize: "17.5px" }}
                    onClick={handleTransferModal}
                  >
                    민원 전달하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 부서 이관 모달 */}
      <TransferDepartmentModal
        show={transferDepartModal}
        onClose={handleTransferClose}
        depart={department}
        onTransfer={handleTransfer}
        complaintId={complaint.complaint_id}
      />

      <ModalMSG
        show={showMessageModal}
        onClose={handleMessageModalClose}
        title="Success"
      >
        <p style={{ whiteSpace: 'pre-line' }}>
          {message}
        </p>
      </ModalMSG>

      <ModalErrorMSG show={showErrorModal} onClose={handleErrorModalClose} title="Error">
        <p style={{ whiteSpace: 'pre-line' }}>{errorMessage}</p>
      </ModalErrorMSG>


    </div>
  );
};

export default ComplaintDetailModal;