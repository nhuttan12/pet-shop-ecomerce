/**
 * @description: error message to return to user client when meeting error
 */
export const ErrorMessage = {
  USER_NOT_FOUND: 'Tài khoản không tồn tại',
  USER_ALREADY_EXISTS: 'Tài khoản đã tồn tại',
  INVALID_PASSWORD: 'Mật khẩu không hợp lệ',
  INVALID_EMAIL: 'Email không hợp lệ',
  EMAIL_IS_NOT_EMPTY: 'Email không được để trống',

  PASSWORD_IS_NOT_EMPTY: 'Mật khẩu không được để trống',
  PASSWORD_MISMATCH: 'Mật khẩu không khớp',

  USERNAME_IS_NOT_EMPTY: 'Tài khoản không được để trống',
  NAME_IS_NOT_EMPTY: 'Tên người dùng không được để trống',
  USER_NAME_HAVE_AT_LEAST_3_CHARACTERS:
    'Tên người dùng phải có ít nhất 3 ký tự',
  PASSWORD_HAVE_AT_LEAST_3_CHARACTERS: 'Mật khẩu phải có ít nhất 6 ký tự',
  USERNAME_OR_EMAIL_EXISTS: 'Tài khoản hoặc email đã tồn tại',

  USER_NOT_ACTIVE: 'Tài khoản chưa được kích hoạt',
  USER_BANNED: 'Tài khoản đã bị cấm',
  ROLE_NOT_FOUND: 'Vai trò hiện tại của người dùng không tồn tại',
  STATUS_NOT_FOUND: 'Trạng thái hiện tại của người dùng không tồn tại',
  INTERNAL_SERVER_ERROR: 'Có lỗi xảy ra, vui lòng thử lại sau',
  PARAM_NOT_VALID: 'Dữ liệu đầu vào không phù hợp, vui lòng thử lại sau',

  PAGE_SHOULD_NOT_A_NEGATIVE_NUMBER: 'Số trang không được là số âm',
  LIMIT_HAVE_AT_LEAST_10: 'Khoảng giá trị tối thiểu là 10',
  PAGE_MUST_BE_INTETER: 'Số trang phải là số nguyên',
  LIMIT_MUST_BE_INTETER: 'Khoảng giá trị phải là số nguyên',

  USER_ID_MUST_BE_INTEGER: 'Mã người dùng phải là số nguyên',
  ID_MUST_BE_INTEGER: 'Mã số phải là là số nguyên',
  USER_FULL_NAME_MUST_BE_STRING: 'Tên người dùng phải là một chuỗi',
  PARAM_MUST_NOT_BE_A_LINK: 'Đữ liệu đầu vào không phải là 1 đường dẫn',

  PUBLIC_ID_MUST_BE_A_STRING: 'publicId phải là một chuỗi.',
  FOLDER_NAME_MUST_BE_STRING: 'Tên thư mục (folder) phải là một chuỗi.',
  URL_MUST_BE_A_STRING: 'Đường dẫn hình ảnh phải là một chuỗi',
  TYPE_MUST_BE_A_STRING: 'loại ảnh phải là một chuỗi.',
  CREATE_AT_MUST_BE_A_STRING: 'Thời gian tạo phải là một chuỗi.',
  WIDTH_MUST_BE_A_INT: 'Chiều rộng phải là một số nguyên.',
  HEIGHT_MUST_BE_A_INT: 'Chiều cao phải là một số nguyên.',
  BYTES_MUST_BE_A_INT: 'Dung lượng phải là một số nguyên.',

  STATUS_IS_UNVALID: 'Trạng thái không hợp lệ',
  IMAGE_TYPE_IS_UNVALID: 'Loại hình ảnh không hợp lệ',
  RELATED_NUMBER_MUST_BE_INT: 'ID liên kết phải là số nguyên',
  RELATED_TYPE_IS_UNVALID: 'Loại liên kết không hợp lệ',

  CLOUINARY_NAME_NOT_FOUND: 'Không tìm thấy cloud name của cloudinary',
  CLOUINARY_API_KEY_NOT_FOUND: 'Không tìm thấy api key của cloudinary',

  EMAIL_IS_NOT_FOUND: 'Không tìm thấy Email dùng cho mật khẩu ứng dụng',
  APP_PASSWORD_IS_NOT_FOUND: 'Không tìm thấy mật khẩu ứng dụng',
  DOMAIN_CONFIG_NOT_FOUND: 'Không tìm thấy domain cần thiết',

  DB_CONFIG_NOT_FOUND: 'Không tìm thấy thông tin về db',

  USER_NOT_LOG_IN: 'Người dùng chưa đăng nhập',
  INVALID_LOGIN_INFO: 'Sai thông tin đăng nhập',

  USER_IS_FORBIDDEN_TO_APPROACH_THE_RESOURCE:
    'Bạn không có quyền để truy cập tài nguyên này',

  IMAGE_NOT_FOUND: 'Không tìm thấy hình ảnh',
  NAME_MUST_BE_STRING: 'Tên phải là kiểu chuỗi',

  /**
   * Throw error for input invalid
   */
  BRAND_ID_MUST_BE_INTEGER: 'Mã số thương hiệu phải là số nguyên',
  BRAND_FULL_NAME_MUST_BE_STRING: 'Tên thương hiệu phải là một chuỗi',
  BRAND_NOT_FOUND: 'Không tìm thấy thương hiệu',

  STATUS_MUST_BE_ENUM: 'Trạng thái không hợp lệ',
  INVALID_RESET_TOKEN: 'Token không hợp lệ',

  /**
   * Cart
   */
  CART_NOT_FOUND: 'Không tìm thấy giỏ hàng',
  CART_ITEM_NOT_FOUND: 'Không tìm thấy sản phẩm trong giỏ hàng',
} as const;
