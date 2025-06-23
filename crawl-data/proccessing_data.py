import csv

def clean_multiline(text):
    if text:
        return ' '.join(text.replace('\n', ' ').replace('\r', ' ').split())
    return ''

input_file = 'products_paddy_full_details.csv'
output_file = 'cleaned.csv'

with open(input_file, 'r', encoding='utf-8-sig') as f_in, open(output_file, 'w', encoding='utf-8-sig', newline='') as f_out:
    reader = csv.DictReader(f_in)
    writer = csv.DictWriter(f_out, fieldnames=reader.fieldnames)
    writer.writeheader()
    print("Fieldnames CSV:", reader.fieldnames)

    for row in reader:
        # Xử lý description: loại bỏ \n, \r, và khoảng trắng dư
        row['description'] = clean_multiline(row['description'])

        # Bạn có thể làm sạch các trường khác nếu muốn:
        row['product_name'] = clean_multiline(row['product_name'])
        row['variant_title'] = clean_multiline(row['variant_title'])

        writer.writerow(row)

print(f"✅ File đã được xử lý và lưu vào '{output_file}'")
