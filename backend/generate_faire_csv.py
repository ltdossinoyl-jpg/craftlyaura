import json
import pandas as pd
import numpy as np

json_path = r"C:\Users\Administrator\Desktop\atlasurbancraft\handmadebestseller_project\craftlyaura_project\backend\products.json"
template_path = r"C:\Users\Administrator\Desktop\faire-products-template.xlsx"
out_csv = r"C:\Users\Administrator\Desktop\craftlyaura-faire-products.csv"

# Load JSON
with open(json_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

# Load template for columns
template_df = pd.read_excel(template_path, sheet_name='Products', header=0, nrows=1)
target_cols = template_df.columns.tolist()
description_row = template_df.iloc[0:1].copy()

rows = []

for prod in products:
    title = prod.get('title', '')
    desc = prod.get('description', '')
    category = prod.get('category', 'Leather Bag')
    
    variations = prod.get('variations', [])
    if not variations:
        # If no variations, just add one row
        row = {col: '' for col in target_cols}
        row['Product Name (English)'] = title
        row['Product Status'] = 'Published'
        row['Product Type'] = category
        row['Description (English)'] = desc
        row['Item Weight Unit'] = 'kg'
        row['USD Unit Retail Price'] = prod.get('price', '')
        # Set a wholesale price as half of retail if we have price
        if prod.get('price'):
            try:
                row['USD Unit Wholesale Price'] = float(prod.get('price')) / 2.0
            except:
                pass
        # Add main image to Product Images if exists
        images = prod.get('images', [])
        if images:
            # We assume images are full URLs or we just use what's there
            row['Product Images'] = ', '.join(images)
            
        rows.append(row)
    else:
        for var in variations:
            row = {col: '' for col in target_cols}
            row['Product Name (English)'] = title
            row['Product Status'] = 'Published'
            row['Product Type'] = category
            row['Description (English)'] = desc
            row['Item Weight Unit'] = 'kg'
            
            # Map variation size to Option 1
            if 'Size' in var:
                row['Option 1 Name'] = 'Size'
                row['Option 1 Value'] = var['Size']
            
            # Additional options if any
            opt_idx = 2
            for k, v in var.items():
                if k not in ['price', 'Size'] and opt_idx <= 3:
                    row[f'Option {opt_idx} Name'] = k
                    row[f'Option {opt_idx} Value'] = v
                    opt_idx += 1
            
            price = var.get('price', prod.get('price', ''))
            row['USD Unit Retail Price'] = price
            if price:
                try:
                    row['USD Unit Wholesale Price'] = float(price) / 2.0
                except:
                    pass
            
            # Images
            images = prod.get('images', [])
            if images:
                row['Product Images'] = ', '.join(images)
                
            rows.append(row)

# Create DataFrame for products
products_df = pd.DataFrame(rows, columns=target_cols)

# Concat description row
final_df = pd.concat([description_row, products_df], ignore_index=True)

# Save to CSV
final_df.to_csv(out_csv, index=False)
print(f"Generated CSV at {out_csv} with {len(rows)} product variations.")
