export enum PaymentErrorMessages {
  PAYMENT_NOT_FOUND = 'Không tìm thấy dịch vụ thanh toán nào hết',
  TOKEN_MUST_BE_STRING = 'Chữ ký số phải là một chuỗi',
  TOKEN_IS_REQUIRED = 'Chữ ký số là bắt buộc',
  AMOUNT_MUST_BE_NUMBER = 'Số tiền phải là một số',
  CURRENCY_MUST_BE_STRING = 'Đơn vị tiền tệ phải là một chuỗi',
  CURRENCY_IS_REQUIRED = 'Đơn vị tiền tệ là bắt buộc',
  PARAM_IS_NOT_VALID = 'Dữ liệu không hợp lệ',
  URL_IS_REQUIRED = 'Dữ liệu bắt buộc',
  CAPTURE_ORDER_FAILED = 'Thanh toán đơn hàng thất bại',
}
