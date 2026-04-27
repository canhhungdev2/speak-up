/**
 * Chuyển đổi một chuỗi sang slug thân thiện (SEO friendly)
 * Hỗ trợ tiếng Việt và các ký tự đặc biệt
 */
export function slugify(text: string): string {
  if (!text) return '';

  let slug = text.toLowerCase();

  // Chuyển đổi ký tự tiếng Việt
  slug = slug.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a');
  slug = slug.replace(/[éèẻẽẹêếềểễệ]/g, 'e');
  slug = slug.replace(/[íìỉĩị]/g, 'i');
  slug = slug.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o');
  slug = slug.replace(/[úùủũụưứừửữự]/g, 'u');
  slug = slug.replace(/[ýỳỷỹỵ]/g, 'y');
  slug = slug.replace(/đ/g, 'd');

  // Loại bỏ ký tự đặc biệt, chỉ giữ lại chữ cái, số và khoảng trắng
  slug = slug.replace(/[^a-z0-9\s]/g, '');

  // Thay thế khoảng trắng bằng dấu gạch ngang
  slug = slug.replace(/\s+/g, '-');

  // Loại bỏ các dấu gạch ngang dư thừa
  slug = slug.trim().replace(/-+/g, '-');

  return slug;
}
