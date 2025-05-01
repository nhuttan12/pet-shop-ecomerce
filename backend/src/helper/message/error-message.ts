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
} as const;
