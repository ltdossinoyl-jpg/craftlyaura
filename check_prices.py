import json

data = json.load(open('faire_products_parsed.json', 'r', encoding='utf-8'))

# Show a few products with variations and their prices
count = 0
for p in data:
    if p['variations']:
        count += 1
        if count <= 10:
            print(f"\n=== {p['name'][:60]} ===")
            print(f"  Main price: {p.get('price', 'N/A')}")
            for i, v in enumerate(p['variations'][:5]):
                print(f"  Var {i+1}: {v}")
            if len(p['variations']) > 5:
                print(f"  ... and {len(p['variations']) - 5} more")
