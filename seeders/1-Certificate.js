'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const items = [
      { name: 'A1', description: 'Trình độ tiếng Anh sơ cấp dành cho người mới bắt đầu học.' },
      { name: 'A2', description: 'Trình độ căn bản, có thể giao tiếp đơn giản trong tình huống quen thuộc.' },
      { name: 'B1', description: 'Trình độ trung cấp, có thể xử lý giao tiếp hàng ngày và viết đoạn văn đơn giản.' },
      { name: 'B2', description: 'Trình độ khá, có thể hiểu văn bản phức tạp và giao tiếp tốt trong môi trường học tập hoặc làm việc.' },
      { name: 'C1', description: 'Trình độ nâng cao, có thể sử dụng tiếng Anh linh hoạt và hiệu quả trong nhiều mục đích.' },
      { name: 'C2', description: 'Trình độ thành thạo, gần như như người bản xứ trong cả nói và viết.' },
      { name: 'Ielts4', description: 'Trình độ tương đương IELTS 4.0 – mức cơ bản, phù hợp người mới bắt đầu luyện thi.' },
      { name: 'Ielts5', description: 'Trình độ tương đương IELTS 5.0 – có thể giao tiếp đơn giản và viết các đoạn văn ngắn.' },
      { name: 'Ielts6', description: 'Trình độ tương đương IELTS 6.0 – có thể sử dụng tiếng Anh độc lập với một số hạn chế.' },
      { name: 'Ielts7', description: 'Trình độ tương đương IELTS 7.0 – sử dụng tiếng Anh tốt trong học tập và công việc.' },
      { name: 'Toeic500', description: 'Trình độ tương đương TOEIC 500 – có thể hiểu và giao tiếp trong tình huống công việc đơn giản.' },
      { name: 'Toeic700', description: 'Trình độ tương đương TOEIC 700 – sử dụng tiếng Anh tốt trong môi trường chuyên nghiệp.' }
    ];

    items.forEach(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
    });
    await queryInterface.bulkInsert('Certificates', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Certificates', null, {});
  }
};
