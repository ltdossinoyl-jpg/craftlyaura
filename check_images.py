import csv

with open('faire-products0 (1) - Products.csv', encoding='utf-8') as f:
    reader = csv.reader(f)
    headers = next(reader)
    count = 0
    option_image_count = 0
    for row in reader:
        if len(row) <= 41: continue
        
        c25 = row[25] if len(row) > 25 else ''
        c27 = row[27] if len(row) > 27 else ''
        c29 = row[29] if len(row) > 29 else ''
        
        has_color = 'Color' in str(c25) or 'Color' in str(c27) or 'Color' in str(c29)
        if has_color:
            count += 1
            if row[41] and str(row[41]).strip():
                option_image_count += 1

print(f"Rows with Color: {count}")
print(f"Option images found in those rows: {option_image_count}")
