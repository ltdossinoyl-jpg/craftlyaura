import json

data = json.load(open('faire_products_parsed.json', 'r', encoding='utf-8'))

print("Products WITH variations:")
count = 0
for p in data:
    if p['variations']:
        count += 1
        var_types = set()
        for v in p['variations']:
            for k in v:
                if k not in ('sku', 'status', 'usd_retail', 'option_image'):
                    var_types.add(k)
        print(f"  {count}. {p['name'][:70]} -> {len(p['variations'])} vars ({', '.join(var_types)})")

total = len(data)
print(f"\nTotal with variations: {count}/{total}")
print(f"Products WITHOUT variations: {total - count}")
