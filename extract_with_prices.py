import openpyxl
import json

wb = openpyxl.load_workbook('faire-products0.xlsx', read_only=True)
ws = wb['Products']

# Get headers
headers = None
products = []
current_product = None

for row_num, row in enumerate(ws.iter_rows(values_only=True)):
    if row_num == 0:
        headers = list(row)
        continue
    if row_num <= 2:  # Skip instruction rows
        continue
    
    values = list(row)
    product_name = values[0]  # Col 0
    
    # Price columns
    gbr_wholesale = values[31] if len(values) > 31 else None
    gbr_retail = values[32] if len(values) > 32 else None
    usd_wholesale = values[33] if len(values) > 33 else None
    usd_retail = values[34] if len(values) > 34 else None
    
    # Option columns
    opt1_name = values[25] if len(values) > 25 else None
    opt1_val = values[26] if len(values) > 26 else None
    opt2_name = values[27] if len(values) > 27 else None
    opt2_val = values[28] if len(values) > 28 else None
    opt3_name = values[29] if len(values) > 29 else None
    opt3_val = values[30] if len(values) > 30 else None
    
    option_status = values[22] if len(values) > 22 else None
    sku = values[23] if len(values) > 23 else None
    option_image = values[41] if len(values) > 41 else None
    
    if product_name and str(product_name).strip():
        # New product
        if current_product:
            products.append(current_product)
        
        current_product = {
            'name': str(product_name).strip(),
            'gbr_wholesale': gbr_wholesale,
            'gbr_retail': gbr_retail,
            'usd_wholesale': usd_wholesale,
            'usd_retail': usd_retail,
            'variations': []
        }
        
        # This row might also be a variation
        variation = {}
        if opt1_name and opt1_val:
            variation[str(opt1_name)] = str(opt1_val)
        if opt2_name and opt2_val:
            variation[str(opt2_name)] = str(opt2_val)
        if opt3_name and opt3_val:
            variation[str(opt3_name)] = str(opt3_val)
        
        if variation:
            variation['sku'] = str(sku) if sku else ''
            variation['status'] = str(option_status) if option_status else 'Published'
            variation['gbr_wholesale'] = gbr_wholesale
            variation['gbr_retail'] = gbr_retail
            variation['usd_wholesale'] = usd_wholesale
            variation['usd_retail'] = usd_retail
            variation['option_image'] = str(option_image) if option_image else ''
            current_product['variations'].append(variation)
    else:
        # Continuation row (variation of current product)
        if current_product:
            variation = {}
            if opt1_name and opt1_val:
                variation[str(opt1_name)] = str(opt1_val)
            elif opt1_val:
                # Use prev opt1_name
                prev_vars = current_product['variations']
                if prev_vars:
                    for k in prev_vars[0]:
                        if k not in ('sku', 'status', 'gbr_wholesale', 'gbr_retail', 'usd_wholesale', 'usd_retail', 'option_image'):
                            variation[k] = str(opt1_val)
                            break
            
            if opt2_name and opt2_val:
                variation[str(opt2_name)] = str(opt2_val)
            elif opt2_val and current_product['variations']:
                # Find 2nd key from first variation
                keys = [k for k in current_product['variations'][0] if k not in ('sku', 'status', 'gbr_wholesale', 'gbr_retail', 'usd_wholesale', 'usd_retail', 'option_image')]
                if len(keys) > 1:
                    variation[keys[1]] = str(opt2_val)
            
            if opt3_name and opt3_val:
                variation[str(opt3_name)] = str(opt3_val)
            elif opt3_val and current_product['variations']:
                keys = [k for k in current_product['variations'][0] if k not in ('sku', 'status', 'gbr_wholesale', 'gbr_retail', 'usd_wholesale', 'usd_retail', 'option_image')]
                if len(keys) > 2:
                    variation[keys[2]] = str(opt3_val)
            
            if variation:
                variation['sku'] = str(sku) if sku else ''
                variation['status'] = str(option_status) if option_status else 'Published'
                variation['gbr_wholesale'] = gbr_wholesale
                variation['gbr_retail'] = gbr_retail
                variation['usd_wholesale'] = usd_wholesale
                variation['usd_retail'] = usd_retail
                variation['option_image'] = str(option_image) if option_image else ''
                current_product['variations'].append(variation)

if current_product:
    products.append(current_product)

wb.close()

# Save
with open('faire_products_with_prices.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False, default=str)

# Show stats
print(f"Total products: {len(products)}")
with_vars = sum(1 for p in products if p['variations'])
print(f"Products with variations: {with_vars}")

# Show some with prices
print("\n=== Products with variation prices ===")
count = 0
for p in products:
    if p['variations']:
        has_price = any(v.get('gbr_retail') or v.get('usd_retail') for v in p['variations'])
        if has_price:
            count += 1
            if count <= 10:
                print(f"\n{count}. {p['name'][:60]}")
                print(f"   Product GBR retail: {p['gbr_retail']}")
                for v in p['variations'][:5]:
                    opts = {k: v for k, v in v.items() if k not in ('sku', 'status', 'option_image')}
                    print(f"   Var: {opts}")

# Also show products where ALL prices are None
no_price = 0
for p in products:
    if p['variations']:
        all_none = all(v.get('gbr_retail') is None and v.get('usd_retail') is None for v in p['variations'])
        if all_none:
            no_price += 1

print(f"\nTotal with variation prices: {count}")
print(f"Total with NO variation prices: {no_price}")
