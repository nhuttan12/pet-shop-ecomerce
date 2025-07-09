export enum AuthErrorMessages {
  USER_ALREADY_EXISTS = 'Tài khoản đã tồn tại',
  INVALID_PASSWORD = 'Mật khẩu không hợp lệ',
  INVALID_EMAIL = 'Email không hợp lệ',
  EMAIL_IS_NOT_EMPTY = 'Email không được để trống',

  PASSWORD_IS_NOT_EMPTY = 'Mật khẩu không được để trống',
  PASSWORD_MISMATCH = 'Mật khẩu không khớp',

  USERNAME_IS_NOT_EMPTY = 'Tài khoản không được để trống',
  NAME_IS_NOT_EMPTY = 'Tên người dùng không được để trống',
  USER_NAME_HAVE_AT_LEAST_3_CHARACTERS = 'Tên người dùng phải có ít nhất 3 ký tự',
  PASSWORD_HAVE_AT_LEAST_3_CHARACTERS = 'Mật khẩu phải có ít nhất 6 ký tự',
  USERNAME_OR_EMAIL_EXISTS = 'Tài khoản hoặc email đã tồn tại',

  USER_NOT_ACTIVE = 'Tài khoản chưa được kích hoạt',
  USER_BANNED = 'Tài khoản đã bị cấm',

  INFOR_UNVALID = 'Thông tin đăng nhập không hợp lệ',

  USER_NOT_LOG_IN = 'Người dùng chưa đăng nhập',
  INVALID_LOGIN_INFO = 'Sai thông tin đăng nhập',

  USER_IS_FORBIDDEN_TO_APPROACH_THE_RESOURCE = 'Bạn không có quyền để truy cập tài nguyên này',
  USER_NOT_EXISTS = 'Tài khoản không tồn tại',
}
