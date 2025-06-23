import csv

input_file = 'cleaned.csv'
output_file = 'output.csv'

with open(input_file, mode='r', encoding='utf-8-sig') as infile:
    reader = csv.DictReader(infile)
    rows = list(reader)

# Cập nhật main_image_url nếu cần
for row in rows:
    main_image = row.get('main_image_url', '').strip()
    all_images = row.get('all_images', '').strip()

    if not main_image and all_images:
        first_image = all_images.split(';')[0].strip()
        row['main_image_url'] = first_image

# Ghi ra file mới
with open(output_file, mode='w', newline='', encoding='utf-8-sig') as outfile:
    writer = csv.DictWriter(outfile, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print("✅ Đã xử lý xong. Kết quả lưu tại:", output_file)
