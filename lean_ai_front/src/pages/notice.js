import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Calendar, Bell, ChevronLeft } from 'lucide-react';

// 공지사항 데이터를 외부에서 사용할 수 있도록 내보내기
export const announcements = [
  { 
    id: 1, 
    title: "린에이아이 서비스 런칭 및 POC 진행 안내", 
    date: "2024-09-20",
    content: `저희는 AI 기반 소상공인 고객 응대 솔루션을 공식적으로 런칭했습니다!
    현재 POC(Proof of Concept) 단계로, 초기 도입 기업들을 대상으로 서비스의 효율성과 가치를 입증하고 있습니다.`,
    icon: Bell
  },
  { 
    id: 2, 
    title: "9월 시스템 점검 안내", 
    date: "2024-09-10",
    content: `9월 15일 새벽 2시부터 4시까지 시스템 점검이 예정되어 있습니다. 
    해당 시간 동안 서비스 이용이 제한될 수 있습니다.`,
    icon: Calendar
  },
];

const AnnouncementPage = () => {
  const [selectedId, setSelectedId] = useState(null); // 선택된 공지사항 ID를 저장하는 상태
  const router = useRouter(); // 페이지 이동 및 뒤로 가기 기능을 위한 라우터

  return (
    <div className="min-h-screen py-12 px-4 font-sans bg-violet-50" >
      <div className="max-w-4xl mx-auto py-12 px-6 shadow-md rounded-lg" style={{ backgroundColor: '#fff', borderRadius: '50px 0 50px 0' }}>
        <div className="flex items-center mb-12"> 
          <ChevronLeft 
            className="h-8 w-8 text-indigo-700 cursor-pointer mr-2" 
            onClick={() => router.back()} // 뒤로가기 버튼
          /> 
          <h1 className="text-3xl font-bold text-center text-indigo-600" style={{fontFamily:'NanumSquareExtraBold'}}>공지사항</h1>
        </div>
        
        <div className="relative">
          {/* 공지사항 목록 렌더링 */}
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id} // 각 공지사항의 고유 ID
              className="mb-8 flex"
              initial={{ opacity: 0, y: 50 }} // 초기 애니메이션 상태
              animate={{ opacity: 1, y: 0 }} // 애니메이션 완료 상태
              transition={{ duration: 0.5, delay: index * 0.1 }} // 순차 애니메이션 적용
            >
              {/* 아이콘 영역 */}
              <div className="flex flex-col items-center mr-4">
                <div className={`rounded-full p-3 ${selectedId === announcement.id ? 'bg-indigo-600' : 'bg-white'} shadow-lg`}>
                  <announcement.icon className={`h-6 w-6 ${selectedId === announcement.id ? 'text-white' : 'text-indigo-600'}`} />
                </div>
                <div className="h-full w-0.5 bg-indigo-500 mt-3"></div>
              </div>

              {/* 공지사항 제목 및 내용 영역 */}
              <div className="bg-indigo-100 rounded-lg shadow-md p-6 flex-grow cursor-pointer hover:shadow-lg transition-shadow duration-200"
                   onClick={() => setSelectedId(selectedId === announcement.id ? null : announcement.id)}>
                <h2 className="text-xl font-semibold mb-2">{announcement.title}</h2>
                <p className="text-sm text-gray-600 mb-4">{announcement.date}</p>

                {/* 공지사항 세부 내용 */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }} // 세부 내용 초기 애니메이션 상태
                  animate={{ 
                    height: selectedId === announcement.id ? 'auto' : 0,
                    opacity: selectedId === announcement.id ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="whitespace-pre-line">{announcement.content}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementPage;
