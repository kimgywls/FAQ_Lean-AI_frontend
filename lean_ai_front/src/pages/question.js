import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, MessageCircle, CreditCard, Settings, HelpCircle, ArrowLeft } from 'lucide-react';

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('모든 질문');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const categories = [
    { name: '모든 질문', icon: HelpCircle },
    { name: '계정', icon: MessageCircle },
    { name: '결제', icon: CreditCard },
    { name: '서비스', icon: Settings },
  ];

  const faqs = [
    { id: 1, category: '계정', question: 'AI 챗봇 서비스를 어떻게 시작하나요?', answer: 'AI 챗봇 서비스는 회원가입 후 대시보드에서 간단한 설정으로 시작할 수 있습니다. 상세한 가이드는 설정 페이지에서 확인하실 수 있습니다.' },
    { id: 2, category: '결제', question: '요금제는 어떻게 되나요?', answer: '기본, 프로, 엔터프라이즈 등 다양한 요금제를 제공하고 있습니다. 각 요금제의 상세 내용은 요금제 페이지에서 확인하실 수 있습니다.' },
    { id: 3, category: '서비스', question: '데이터 백업은 어떻게 하나요?', answer: '데이터 백업은 대시보드의 \'백업 및 복원\' 메뉴에서 수동으로 할 수 있으며, 자동 백업 설정도 가능합니다. 백업 파일은 안전한 클라우드 스토리지에 저장됩니다.' },
    { id: 4, category: '계정', question: '계정 설정을 변경하고 싶어요.', answer: '계정 설정 변경은 로그인 후 우측 상단의 프로필 아이콘을 클릭하여 \'계정 설정\'에서 할 수 있습니다. 비밀번호, 알림 설정 등을 변경할 수 있습니다.' },
  ];

  const filteredFaqs = faqs.filter(faq => 
    (activeCategory === '모든 질문' || faq.category === activeCategory) &&
    (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
     faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-12">
          <ArrowLeft className="h-6 w-6 text-purple-600 cursor-pointer" onClick={() => window.location.href = '/'} /> {/* 뒤로가기 아이콘 */}
          <h1 className="text-4xl font-bold text-purple-800 text-center flex-1">자주 묻는 질문</h1>
        </div>
        
        {/* 검색 바 */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="질문 검색하기"
            className="w-full py-3 pl-12 pr-4 text-gray-900 border-2 border-purple-300 rounded-full focus:outline-none focus:border-purple-500 transition-all duration-300"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 h-6 w-6 text-purple-400" />
        </div>

        {/* 카테고리 선택 */}
        <div className="flex justify-center space-x-4 mb-8">
          {categories.map((category) => (
            <motion.button
              key={category.name}
              className={`flex items-center px-4 py-2 rounded-full ${
                activeCategory === category.name ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.name)}
            >
              <category.icon className="mr-2 h-5 w-5" />
              {category.name}
            </motion.button>
          ))}
        </div>

        {/* FAQ 리스트 */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                className="w-full text-left px-6 py-4 flex justify-between items-center"
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {expandedId === faq.id ? <ChevronUp className="h-5 w-5 text-purple-500" /> : <ChevronDown className="h-5 w-5 text-purple-500" />}
              </button>
              {expandedId === faq.id && (
                <div className="px-6 py-4 bg-purple-50">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;