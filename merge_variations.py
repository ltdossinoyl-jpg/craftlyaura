import json
from difflib import SequenceMatcher

# Load both datasets
faire_data = json.load(open('faire_products_with_prices.json', 'r', encoding='utf-8'))
products_data = json.load(open('handmadebestseller/frontend/src/data/products.json', 'r', encoding='utf-8'))

# Remove old variation data first
for prod in products_data:
    if 'variationTypes' in prod:
        del prod['variationTypes']
    if 'variations' in prod:
        del prod['variations']

def normalize(name):
    import re
    name = name.strip().lower()
    name = re.sub(r'[–—\u2013\u2014\u2018\u2019\u201c\u201d]', '', name)
    name = re.sub(r'[^\w\s]', '', name)
    name = re.sub(r'\s+', ' ', name)
    return name

import sys
sys.stdout.reconfigure(encoding='utf-8')

def similarity(a, b):
    if not a or not b: return 0
    return SequenceMatcher(None, a[:100], b[:100]).ratio()

# GBP to USD conversion rate (approximate)
GBP_TO_USD = 1.27

# Build faire lookup - need to merge rows with same product name
faire_products = {}
for fp in faire_data:
    name = fp['name']
    if name not in faire_products:
        faire_products[name] = {
            'name': name,
            'gbr_retail': fp['gbr_retail'],
            'usd_retail': fp['usd_retail'],
            'variations': []
        }
    # Add variations from this entry
    for v in fp['variations']:
        faire_products[name]['variations'].append(v)

faire_merged = list(faire_products.values())

# Build lookup by normalized name
faire_lookup = {}
for fp in faire_merged:
    norm = normalize(fp['name'])
    faire_lookup[norm] = fp

# Match products
matched = 0
matched_with_vars = 0
updated_products = []

for prod in products_data:
    prod_norm = normalize(prod.get('title') or prod.get('name', ''))
    
    best_match = None
    best_score = 0
    
    for faire_norm, faire_prod in faire_lookup.items():
        score = similarity(prod_norm, faire_norm)
        if score > best_score:
            best_score = score
            best_match = faire_prod
    
    if best_match and best_score > 0.6:
        matched += 1
        
        if best_match['variations']:
            matched_with_vars += 1
            option_types = {}
            variations = []
            
            for var in best_match['variations']:
                if var.get('status') == 'Unpublished':
                    continue
                
                var_entry = {}
                for k, v in var.items():
                    if k in ('sku', 'status'):
                        continue
                    if k == 'option_image' and v:
                        var_entry['image'] = v
                    elif k == 'gbr_retail' and v is not None:
                        # Convert GBP to USD
                        var_entry['price'] = round(float(v) * GBP_TO_USD, 2)
                    elif k == 'gbr_wholesale' and v is not None:
                        var_entry['wholesalePrice'] = round(float(v) * GBP_TO_USD, 2)
                    elif k == 'usd_retail' and v is not None:
                        var_entry['price'] = round(float(v), 2)
                    elif k == 'usd_wholesale' and v is not None:
                        var_entry['wholesalePrice'] = round(float(v), 2)
                    elif k not in ('gbr_wholesale', 'gbr_retail', 'usd_wholesale', 'usd_retail', 'option_image'):
                        if v:
                            var_entry[k] = v
                            if k not in option_types:
                                option_types[k] = []
                            if v not in option_types[k]:
                                option_types[k].append(v)
                
                if var_entry and any(k not in ('image', 'price', 'wholesalePrice') for k in var_entry):
                    variations.append(var_entry)
            
            if option_types and variations:
                prod['variationTypes'] = option_types
                prod['variations'] = variations
    
    updated_products.append(prod)

print(f"Total products: {len(products_data)}")
print(f"Matched: {matched}")
print(f"Matched with variations: {matched_with_vars}")

# Show examples with prices
print("\n=== EXAMPLES WITH PRICES ===")
count = 0
for prod in updated_products:
    if 'variations' in prod and prod['variations']:
        has_price = any(v.get('price') for v in prod['variations'])
        if has_price:
            count += 1
            if count <= 8:
                print(f"\n{count}. {prod['title'][:60]}")
                print(f"   Base price: ${prod['price']}")
                for v in prod['variations'][:4]:
                    opts = {k: v for k, v in v.items() if k != 'image'}
                    print(f"   Var: {opts}")
                if len(prod['variations']) > 4:
                    print(f"   ... and {len(prod['variations']) - 4} more")


with open('handmadebestseller/frontend/src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(updated_products, f, indent=2, ensure_ascii=False)
print(f"\n✅ Saved updated products with variation prices!")
