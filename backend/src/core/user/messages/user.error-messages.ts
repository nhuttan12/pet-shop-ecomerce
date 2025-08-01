export enum UserErrorMessage {
  USER_NOT_FOUND_AFTER_CREATED = 'Không tìm thấy người dùng sau khi tạo tài khoản',
  USER_NOT_FOUND = 'Không tìm thấy người dùng',
  USER_EMAIL_EXIST = 'Email của người dùng đã tồn tại',
  USER_NOT_FOUND_AFTER_UDPATED = 'Không tìm thấy thông tin người dùng sau khi cập nhật',
  USER_NOT_ACTIVE = 'Tài khoản chưa được kích hoạt',
  USER_ID_MUST_BE_INTEGER = 'Mã số người dùng phải là số nguyên',
  USER_ID_MUST_BE_POSITIVE = 'Mã số người dùng phải lớn hơn 0',
  GENDER_IS_NOT_VALID = 'Giới tính không hợp lệ',
  USER_BIRTH_DATE_IS_NOT_VALID = 'Ngày sinh không hợp lệ',
  USER_UPDATED_FAILED = 'Cập nhật thông tin người dùng thất bại',
  EMAIL_IS_NOT_VALID = 'Email không hợp lệ',
}
