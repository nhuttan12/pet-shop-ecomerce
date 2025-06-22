import React from 'react';
import { ShippingAddress } from '../../types/ChechOut';
import InputField from '../../components/ui/InputField';

interface ShippingAddressFormProps {
  shippingAddress: ShippingAddress;
  onShippingAddressChange: (field: keyof ShippingAddress, value: string) => void;
}

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  shippingAddress,
  onShippingAddressChange
}) => {
  return (
    <div className="mb-6">
      {/* Khung chứa các input địa chỉ */}
      <div className="p-6 border border-gray-300 rounded-lg space-y-1 bg-white shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Địa chỉ giao hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
          placeholder="Nhập địa chỉ"
          value={shippingAddress.address}
          onChange={(e) => onShippingAddressChange('address', e.target.value)}
        />
        <InputField
            placeholder="Nhập mã bưu điện"
            value={shippingAddress.postalCode}
            onChange={(e) => onShippingAddressChange('postalCode', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            placeholder="Nhập thành phố"
            value={shippingAddress.city}
            onChange={(e) => onShippingAddressChange('city', e.target.value)}
          />
           <InputField
          placeholder="Nhập quốc gia"
          value={shippingAddress.country}
          onChange={(e) => onShippingAddressChange('country', e.target.value)}
        />
        </div>
      </div>
    </div>
  );
};

export default ShippingAddressForm;
