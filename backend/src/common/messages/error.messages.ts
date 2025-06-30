/**
 * @description= error message to return to user client when meeting error
 */
export enum ErrorMessage {
  STATUS_NOT_FOUND = 'Trạng thái hiện tại của người dùng không tồn tại',
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

  PUBLIC_ID_MUST_BE_A_STRING = 'publicId phải là một chuỗi.',
  FOLDER_NAME_MUST_BE_STRING = 'Tên thư mục (folder) phải là một chuỗi.',
  URL_MUST_BE_A_STRING = 'Đường dẫn hình ảnh phải là một chuỗi',
  TYPE_MUST_BE_A_STRING = 'loại ảnh phải là một chuỗi.',
  CREATE_AT_MUST_BE_A_STRING = 'Thời gian tạo phải là một chuỗi.',
  WIDTH_MUST_BE_A_INT = 'Chiều rộng phải là một số nguyên.',
  HEIGHT_MUST_BE_A_INT = 'Chiều cao phải là một số nguyên.',
  BYTES_MUST_BE_A_INT = 'Dung lượng phải là một số nguyên.',

  STATUS_IS_UNVALID = 'Trạng thái không hợp lệ',
  IMAGE_TYPE_IS_UNVALID = 'Loại hình ảnh không hợp lệ',
  RELATED_NUMBER_MUST_BE_INT = 'ID liên kết phải là số nguyên',
  RELATED_TYPE_IS_UNVALID = 'Loại liên kết không hợp lệ',

  CLOUINARY_NAME_NOT_FOUND = 'Không tìm thấy cloud name của cloudinary',
  CLOUINARY_API_KEY_NOT_FOUND = 'Không tìm thấy api key của cloudinary',

  EMAIL_IS_NOT_FOUND = 'Không tìm thấy Email dùng cho mật khẩu ứng dụng',
  APP_PASSWORD_IS_NOT_FOUND = 'Không tìm thấy mật khẩu ứng dụng',
  DOMAIN_CONFIG_NOT_FOUND = 'Không tìm thấy domain cần thiết',

  DB_CONFIG_NOT_FOUND = 'Không tìm thấy thông tin về db',

  IMAGE_NOT_FOUND = 'Không tìm thấy hình ảnh',
  NAME_MUST_BE_STRING = 'Tên phải là kiểu chuỗi',

  INVALID_RESET_TOKEN = 'Token không hợp lệ',

  /**
   * Cart
   */
  CART_NOT_FOUND = 'Không tìm thấy giỏ hàng',
  CART_ITEM_NOT_FOUND = 'Không tìm thấy sản phẩm trong giỏ hàng',

  /**
   * Category
   */
  CATEGORY_MUST_BE_STRING = 'Tên danh phải là một chuỗi',

  /**
   * Product
   */
  PRICE_MUST_BE_INTEGER = 'Giá tiền phải là số nguyên',
  QUANTITY_MUST_BE_INTEGER = 'Số lượng tiền phải là số nguyên',
  PARAM_SHOULD_NOT_BE_A_NEGATIVE_NUMBER = 'Giá trị không được phép là số âm',
  PRODUCT_NOT_FOUND = 'Không tìm thấy sản phẩm',
  SUB_IMAGES_MUST_BE_ARRAY = 'Hình ảnh phụ sản phẩm không được để trống',

  /**
   * Property check
   */
  SHOULD_NOT_BE_A_NEGATIVE_NUMBER = 'không được phép là số âm',
  MUST_BE_INTEGER = 'phải là số nguyên',
  MUST_BE_STRING = 'phải là một chuỗi',
  IS_NOT_EMPTY = 'không được phép để trống',
  NOT_EXIST = 'không tồn tại',
  ID_SHOULD_NOT_BE_A_NEGATIVE_NUMBER = 'ID không được phép là số âm',
  STATUS_MUST_BE_ENUM = 'Trạng thái phải hợp lệ',
}
