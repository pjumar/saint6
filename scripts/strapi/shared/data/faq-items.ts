import type { FaqItem } from "../types";

export const faqItems: FaqItem[] = [
  {
    question: "What is the minimum rental time?",
    question_vi: "Thời gian thuê tối thiểu là bao lâu?",
    answer: "The minimum rental time is 2 hours for any of our studio spaces.",
    answer_vi:
      "Thời gian thuê tối thiểu là 2 giờ cho bất kỳ không gian studio nào của chúng tôi.",
    category: "studio-rental",
    order: 1,
  },
  {
    question: "Can I bring my own equipment?",
    question_vi: "Tôi có thể mang thiết bị của mình không?",
    answer:
      "Yes, you are welcome to bring your own equipment. We also provide professional lighting and equipment for rent.",
    answer_vi:
      "Có, bạn được hoan nghênh mang thiết bị của riêng mình. Chúng tôi cũng cung cấp thiết bị chiếu sáng và thiết bị chuyên nghiệp cho thuê.",
    category: "studio-rental",
    order: 2,
  },
  {
    question: "Is there parking available?",
    question_vi: "Có chỗ đậu xe không?",
    answer:
      "Yes, we have free parking available for all clients during their rental period.",
    answer_vi:
      "Có, chúng tôi có chỗ đậu xe miễn phí cho tất cả khách hàng trong thời gian thuê.",
    category: "studio-rental",
    order: 3,
  },
  {
    question: "Can I extend my booking?",
    question_vi: "Tôi có thể gia hạn đặt chỗ không?",
    answer:
      "Extensions are subject to availability. Please check with our team at least 30 minutes before your session ends.",
    answer_vi:
      "Việc gia hạn tùy thuộc vào tình trạng còn trống. Vui lòng liên hệ với đội ngũ của chúng tôi ít nhất 30 phút trước khi phiên của bạn kết thúc.",
    category: "studio-rental",
    order: 4,
  },
];
