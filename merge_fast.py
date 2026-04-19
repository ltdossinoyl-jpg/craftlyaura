import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("Loading data...")
faire_data = json.load(open('faire_products_with_prices.json', 'r', encoding='utf-8'))
products_data = json.load(open('handmadebestseller/frontend/src/data/products.json', 'r', encoding='utf-8'))
print(f"Loaded {len(faire_data)} faire rows and {len(products_data)} products.")

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
    # Jaccard over words
    intersection = len(set_a & set_b)
    union = len(set_a | set_b)
    return intersection / union if union > 0 else 0

GBP_TO_USD = 1.27

print("Grouping faire products...")
faire_products = {}
for fp in faire_data:
    name = fp.get('name', '')
    if name not in faire_products:
        faire_products[name] = {
            'name': name,
            'gbr_retail': fp.get('gbr_retail'),
            'usd_retail': fp.get('usd_retail'),
            'variations': []
        }
    for v in fp.get('variations', []):
        faire_products[name]['variations'].append(v)

faire_merged = list(faire_products.values())
print(f"Grouped into {len(faire_merged)} unique products.")

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
            
    # Print the closest match for the first 5 products to debug threshold
    if len(updated_products) < 5:
        print(f"[{best_score:.2f}] {prod_name[:40]}  =>  {(best_match['name'][:40] if best_match else '')}")

    if best_match and best_score >= 0.3:  # Lowered threshold to 0.3
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
                        try:
                            var_entry['price'] = round(float(v) * GBP_TO_USD, 2)
                        except (ValueError, TypeError):
                            pass
                    elif k == 'gbr_wholesale' and v is not None:
                        try:
                            var_entry['wholesalePrice'] = round(float(v) * GBP_TO_USD, 2)
                        except (ValueError, TypeError):
                            pass
                    elif k == 'usd_retail' and v is not None:
                        try:
                            var_entry['price'] = round(float(v), 2)
                        except (ValueError, TypeError):
                            pass
                    elif k == 'usd_wholesale' and v is not None:
                        try:
                            var_entry['wholesalePrice'] = round(float(v), 2)
                        except (ValueError, TypeError):
                            pass
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

with open('handmadebestseller/frontend/src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(updated_products, f, indent=2, ensure_ascii=False)
print("Finished saving updated_products.")
