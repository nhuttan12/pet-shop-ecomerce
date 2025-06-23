import csv

INPUT_FILE = 'products.csv'
OUTPUT_FILE = 'output_cleaned.csv'

def clean_main_image_url(row):
    main_img = row['main_image_url'].strip()
    if not main_img:
        all_imgs = row['all_images'].split(';')
        if all_imgs:
            first_valid_img = all_imgs[0].strip()
            if first_valid_img:
                row['main_image_url'] = first_valid_img
    return row

def process_csv(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8-sig') as infile, \
         open(output_path, 'w', encoding='utf-8-sig', newline='') as outfile:

        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()

        for row in reader:
            cleaned = clean_main_image_url(row)
            writer.writerow(cleaned)

    print(f"[✅] Done. Cleaned data saved to {output_path}")

if __name__ == "__main__":
    process_csv(INPUT_FILE, OUTPUT_FILE)
