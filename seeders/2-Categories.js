'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const items = [
      { name: 'Fruits', description: 'Từ vựng liên quan đến các loại trái cây phổ biến.' },
      { name: 'Animals', description: 'Từ vựng về các loài động vật trong tự nhiên và đời sống.' },
      { name: 'Occupations', description: 'Tên gọi các nghề nghiệp và công việc trong xã hội.' },
      { name: 'Emotions', description: 'Từ chỉ cảm xúc, tâm trạng trong giao tiếp hằng ngày.' },
      { name: 'Colors', description: 'Tên gọi và cách miêu tả màu sắc bằng tiếng Anh.' },
      { name: 'Clothes', description: 'Từ vựng về quần áo và phụ kiện thời trang.' },
      { name: 'School Supplies', description: 'Từ liên quan đến dụng cụ học tập trong lớp học.' },
      { name: 'Transportation', description: 'Từ vựng về phương tiện giao thông và di chuyển.' },
      { name: 'Weather', description: 'Từ chỉ thời tiết, khí hậu và hiện tượng tự nhiên.' },
      { name: 'Daily Life', description: 'Từ vựng dùng trong các hoạt động và tình huống hàng ngày.' },
      { name: 'Science', description: 'Từ vựng liên quan đến các lĩnh vực khoa học cơ bản.' },
      { name: 'Technology', description: 'Từ chỉ công nghệ, thiết bị và ứng dụng hiện đại.' },
      { name: 'Food & Drink', description: 'Từ vựng về món ăn, đồ uống và ẩm thực.' },
      { name: 'Travel', description: 'Từ vựng phục vụ du lịch, đi lại và khám phá địa điểm.' },
      { name: 'Grammar Tips', description: 'Gợi ý ngữ pháp cơ bản đến nâng cao giúp cải thiện kỹ năng viết và nói.' },
      { name: 'Phrasal Verbs', description: 'Các cụm động từ thường dùng trong tiếng Anh giao tiếp.' }
    ];

    items.forEach(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
    });
    await queryInterface.bulkInsert('Categories', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
