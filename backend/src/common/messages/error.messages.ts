/**
 * @description= error message to return to user client when meeting error
 */
export enum ErrorMessage {
  INTERNAL_SERVER_ERROR = 'Có lỗi xảy ra, vui lòng thử lại sau',
  PARAM_NOT_VALID = 'Dữ liệu đầu vào không phù hợp, vui lòng thử lại sau',

  PAGE_SHOULD_NOT_A_NEGATIVE_NUMBER = 'Số trang không được là số âm',
  LIMIT_HAVE_AT_LEAST_10 = 'Khoảng giá trị tối thiểu là 10',
  PAGE_MUST_BE_INTETER = 'Số trang phải là số nguyên',
  LIMIT_MUST_BE_INTETER = 'Khoảng giá trị phải là số nguyên',

  USER_ID_MUST_BE_INTEGER = 'Mã người dùng phải là số nguyên',
  ID_MUST_BE_INTEGER = 'Mã số phải là là số nguyên',
  USER_FULL_NAME_MUST_BE_STRING = 'Tên người dùng phải là một chuỗi',
  PARAM_MUST_NOT_BE_A_LINK = 'Trường này không được chứa đường dẫn hoặc link',

  FOLDER_NAME_MUST_BE_STRING = 'Tên thư mục (folder) phải là một chuỗi.',
  URL_MUST_BE_A_STRING = 'Đường dẫn hình ảnh phải là một chuỗi',

  IMAGE_TYPE_IS_UNVALID = 'Loại hình ảnh không hợp lệ',
  DOMAIN_CONFIG_NOT_FOUND = 'Không tìm thấy domain cần thiết',

  NAME_MUST_BE_STRING = 'Tên phải là kiểu chuỗi',

  /**
   * Product
   */
  PARAM_SHOULD_NOT_BE_A_NEGATIVE_NUMBER = 'Giá trị không được phép là số âm',
  SUB_IMAGES_MUST_BE_ARRAY = 'Hình ảnh phụ sản phẩm không được để trống',

  /**
   * Property check
   */
  STATUS_MUST_BE_ENUM = 'Trạng thái phải hợp lệ',
}
