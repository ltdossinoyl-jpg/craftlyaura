import json
d = json.load(open('handmadebestseller_project/frontend/src/data/products.json', 'r', encoding='utf-8'))
count = 0
for p in d:
    if p.get('variations'):
        count += 1
        if count <= 5:
            prices = [v.get('price') for v in p['variations'][:4]]
            print(f"{p['name'][:50]}: {len(p['variations'])} vars")
            print(f"  Prices: {prices}")
print(f"\nTotal with variations: {count}")
