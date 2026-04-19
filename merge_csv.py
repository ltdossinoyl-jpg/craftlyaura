import json
import csv
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("Loading data...")
products_data = json.load(open('handmadebestseller_project/frontend/src/data/products.json', 'r', encoding='utf-8'))

for prod in products_data:
    if 'variationTypes' in prod:
        del prod['variationTypes']
    if 'variations' in prod:
        del prod['variations']

def normalize(name):
    if not name: return ""
    name = str(name).strip().lower()
    name = re.sub(r'[^\w\s]', '', name)
    name = re.sub(r'\s+', ' ', name)
    return name

def similarity(a, b):
    set_a = set(a.split())
    set_b = set(b.split())
    if not set_a or not set_b: return 0
    intersection = len(set_a & set_b)
    union = len(set_a | set_b)
    return intersection / union if union > 0 else 0

faire_products = {}
GBP_TO_USD = 1.27

print("Reading CSV...")
with open('faire-products0 (1) - Products.csv', encoding='utf-8') as f:
    reader = csv.reader(f)
    headers = next(reader)
    
    # Track previous options for continuation rows
    prev_opts = []
    
    for row in reader:
        name = row[0].strip() if len(row) > 0 else ''
        if not name: continue
        
        if name not in faire_products:
            faire_products[name] = {
                'name': name,
                'variations': []
            }
            
        opt1_name = row[25].strip() if len(row) > 25 else ''
        opt1_val = row[26].strip() if len(row) > 26 else ''
        opt2_name = row[27].strip() if len(row) > 27 else ''
        opt2_val = row[28].strip() if len(row) > 28 else ''
        opt3_name = row[29].strip() if len(row) > 29 else ''
        opt3_val = row[30].strip() if len(row) > 30 else ''
        
        usd_retail = row[34].strip() if len(row) > 34 else ''
        usd_wholesale = row[33].strip() if len(row) > 33 else ''
        gbr_retail = row[32].strip() if len(row) > 32 else ''
        gbr_wholesale = row[31].strip() if len(row) > 31 else ''
        option_image = row[41].strip() if len(row) > 41 else ''
        status = row[22].strip() if len(row) > 22 else 'Published'
        
        variation = {}
        
        # Mapping row variations
        # In Faire CSV continuation rows might omit the name of the option if it matches previous row.
        # But wait, looking at Faire CSVs, continuation rows usually have Option * Value but Option * Name might be empty.
        
        if opt1_name and opt1_val:
            variation[opt1_name] = opt1_val
        elif opt1_val and faire_products[name]['variations']:
            # Assume option name matches the first one defined for this product
            prev_keys = [k for k in faire_products[name]['variations'][0].keys() if k not in ('price', 'wholesalePrice', 'image', 'status')]
            if len(prev_keys) > 0: variation[prev_keys[0]] = opt1_val
            
        if opt2_name and opt2_val:
            variation[opt2_name] = opt2_val
        elif opt2_val and faire_products[name]['variations']:
            prev_keys = [k for k in faire_products[name]['variations'][0].keys() if k not in ('price', 'wholesalePrice', 'image', 'status')]
            if len(prev_keys) > 1: variation[prev_keys[1]] = opt2_val
            
        if opt3_name and opt3_val:
            variation[opt3_name] = opt3_val
        elif opt3_val and faire_products[name]['variations']:
            prev_keys = [k for k in faire_products[name]['variations'][0].keys() if k not in ('price', 'wholesalePrice', 'image', 'status')]
            if len(prev_keys) > 2: variation[prev_keys[2]] = opt3_val

        if not variation:
            continue
            
        if status: variation['status'] = status
        
        if option_image:
            variation['image'] = option_image
            
        if usd_retail:
            try: variation['price'] = round(float(usd_retail), 2)
            except: pass
        elif gbr_retail:
            try: variation['price'] = round(float(gbr_retail) * GBP_TO_USD, 2)
            except: pass
            
        if usd_wholesale:
            try: variation['wholesalePrice'] = round(float(usd_wholesale), 2)
            except: pass
        elif gbr_wholesale:
            try: variation['wholesalePrice'] = round(float(gbr_wholesale) * GBP_TO_USD, 2)
            except: pass
            
        faire_products[name]['variations'].append(variation)

faire_merged = list(faire_products.values())
print(f"Grouped into {len(faire_merged)} unique products from CSV.")

faire_lookup = {}
for fp in faire_merged:
    norm = normalize(fp['name'])
    faire_lookup[norm] = fp

matched = 0
matched_with_vars = 0

print("Matching products...")
updated_products = []

for prod in products_data:
    prod_name = prod.get('title') or prod.get('name', '')
    prod_norm = normalize(prod_name)
    best_match = None
    best_score = 0
    
    for faire_norm, faire_prod in faire_lookup.items():
        score = similarity(prod_norm, faire_norm)
        if score > best_score:
            best_score = score
            best_match = faire_prod
            
    if best_match and best_score >= 0.3:
        matched += 1
        
        valid_variations = [v for v in best_match['variations'] if v.get('status') != 'Unpublished']
        if valid_variations:
            matched_with_vars += 1
            option_types = {}
            cleanup_vars = []
            
            for var in valid_variations:
                clean_var = {}
                for k, v in var.items():
                    if k == 'status': continue
                    clean_var[k] = v
                    if k not in ('image', 'price', 'wholesalePrice'):
                        if k not in option_types: option_types[k] = []
                        if v not in option_types[k]: option_types[k].append(v)
                
                # Only keep variation if it has options
                if any(k not in ('image', 'price', 'wholesalePrice') for k in clean_var):
                    cleanup_vars.append(clean_var)
            
            if option_types and cleanup_vars:
                prod['variationTypes'] = option_types
                prod['variations'] = cleanup_vars
    
    updated_products.append(prod)

print(f"Matched: {matched}")
print(f"Matched with variations: {matched_with_vars}")

with open('handmadebestseller_project/frontend/src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(updated_products, f, indent=2, ensure_ascii=False)
print("Finished saving updated_products.")
