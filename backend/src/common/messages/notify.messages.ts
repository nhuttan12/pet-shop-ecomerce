export enum NotifyMessage {
  /**
   * Cart
   * */
  GET_CART_SUCCESSFUL = 'Lấy ra thông tin giỏ hàng thành công',
  CREATE_CART_DETAIL_SUCCESSFUL = 'Tạo chi tiết giỏ hàng thành công',
  GET_CART_DETAIL_SUCCESSFUL = 'Lấy ra chi tiết giỏ hàng thành công',
  REMOVE_CART_DETAIL_SUCCESSFUL = 'Xoa chi tiết giỏ hàng thành công',

  /**
   * Product
   * */
  GET_PRODUCT_SUCCESSFUL = 'Lấy ra thông tin sản phẩm thành công',
  UPDATE_PRODUCT_SUCCESSFUL = 'Thay đổi thông tin sản phẩm thành công',
  DELETE_PRODUCT_SUCCESSFUL = 'Xoa sản phẩm thành công',
  CREATE_PRODUCT_SUCCESSFUL = 'Thêm sản phẩm thành công',
  RATING_PRODUCT_SUCCESSFUL = 'Đánh giá sản phẩm thành công',
  REMOVE_RATING_PRODUCT_SUCCESSFUL = 'Huỷ đánh giá sản phẩm thành công',

  /**
   * Order paypal
   * */
  CREATE_ORDER_PAYPAL_SUCCESSFUL = 'Tạo hoá đơn paypal thành công',
  CAPTURE_ORDER_PAYPAL_SUCCESSFUL = 'Thanh toán hoá đơn paypal thành công',

  /**
   * Order
   */
  GET_ORDER_SUCCESSFUL = 'Lấy ra thông tin đơn hàng thành công',
  CANCEL_ORDER_SUCCESSFUL = 'Huy đơn hàng thành công',
  CREATE_ORDER_SUCCESSFUL = 'Tạo đơn hàng thành công',

  /**
   * Voucher
   */
  GET_VOUCHER_SUCCESSFUL = 'Lấy ra thông tin voucher thành công',
  CREATE_VOUCHER_SUCCESSFUL = 'Tạo voucher thành công',
  UPDATE_VOUCHER_SUCCESSFUL = 'Cập nhật thông tin voucher thành công',
  DELETE_VOUCHER_SUCCESSFUL = 'Xoá voucher thành công',

  /**
   * Contact
   */
  CREATE_CONTACT_SUCCESSFUL = 'Tạo thống tin liên hệ thành công',
  GET_ALL_CONTACT_SUCCESSFUL = 'Lấy ra toàn bộ thống tin liên hệ thành công',

  /**
   * Wishlist
   */
  CREATE_WISHLIST_SUCCESSFUL = 'Thêm sản phẩm vào mục yêu thích thành công',
  REMOVE_WISHLIST_SUCCESSFUL = 'Xoá sản phẩm trong mục yêu thích thành công',
}
