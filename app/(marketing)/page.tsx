import Link from "next/link";
import { Check, Shield, Users, Sparkles, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#22C55E] flex items-center justify-center">
              <span className="text-white font-bold text-sm">집</span>
            </div>
            <span className="font-bold text-xl text-[#111827]">집사</span>
          </div>
          <Link
            href="/requests"
            className="px-4 py-2 rounded-xl bg-[#22C55E] text-white font-medium hover:bg-[#16A34A] transition-colors"
          >
            시작하기
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#111827] mb-6 text-balance">
            믿을 수 있는 가사도우미를
            <br />
            <span className="text-[#22C55E]">쉽고 빠르게</span>
          </h1>
          <p className="text-lg text-[#6B7280] mb-8 max-w-2xl mx-auto text-pretty">
            청소, 요리, 빨래부터 정리정돈까지.
            검증된 도우미와 안전한 에스크로 결제로 걱정 없이 이용하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/requests"
              className="px-8 py-4 rounded-2xl bg-[#22C55E] text-white font-medium text-lg hover:bg-[#16A34A] transition-colors flex items-center justify-center gap-2"
            >
              지금 요청하기
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/helper/dashboard"
              className="px-8 py-4 rounded-2xl border border-[#E5E7EB] text-[#374151] font-medium text-lg hover:bg-[#F8FAFC] transition-colors"
            >
              도우미로 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#111827] mb-12">
            왜 집사인가요?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB]">
              <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-[#22C55E]" />
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-2">
                안전한 에스크로 결제
              </h3>
              <p className="text-[#6B7280]">
                서비스 완료 전까지 결제금이 안전하게 보관됩니다.
                문제 발생 시 분쟁 접수로 보호받으세요.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB]">
              <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#22C55E]" />
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-2">
                검증된 도우미
              </h3>
              <p className="text-[#6B7280]">
                매칭점수와 배지로 도우미의 신뢰도를 한눈에 확인하세요.
                실제 활동 기반 데이터입니다.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB]">
              <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-[#22C55E]" />
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-2">
                공정한 매칭 시스템
              </h3>
              <p className="text-[#6B7280]">
                내부 알고리즘으로 모든 도우미에게 공정한 기회를 제공합니다.
                지역 기반 자동 매칭.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#111827] mb-12">
            이용 방법
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "요청 작성",
                description: "필요한 서비스, 날짜, 주소를 입력하세요",
              },
              {
                step: "2",
                title: "도우미 선택",
                description: "지원한 도우미 중 마음에 드는 분을 선택하세요",
              },
              {
                step: "3",
                title: "에스크로 결제",
                description: "안전하게 결제하면 도우미에게 일정이 확정됩니다",
              },
              {
                step: "4",
                title: "서비스 이용",
                description: "완료 후 확인하면 도우미에게 정산됩니다",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAFC]"
              >
                <div className="w-10 h-10 rounded-full bg-[#22C55E] text-white font-bold flex items-center justify-center flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-[#111827] text-lg">
                    {item.title}
                  </h3>
                  <p className="text-[#6B7280]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 px-4 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#111827] mb-8">
            신뢰할 수 있는 서비스
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              "안전 결제",
              "24시간 지원",
              "분쟁 중재",
              "실명 인증",
              "배상 책임",
            ].map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5E7EB]"
              >
                <Check className="w-4 h-4 text-[#22C55E]" />
                <span className="text-[#374151] font-medium">{badge}</span>
              </div>
            ))}
          </div>
          <Link
            href="/requests"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#22C55E] text-white font-medium text-lg hover:bg-[#16A34A] transition-colors"
          >
            무료로 시작하기
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#22C55E] flex items-center justify-center">
                <span className="text-white font-bold text-sm">집</span>
              </div>
              <span className="font-bold text-xl text-[#111827]">집사</span>
            </div>
            <p className="text-sm text-[#6B7280]">
              © 2024 집사. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
