import json
import re

def normalize(name):
    name = name.strip().lower()
    name = re.sub(r'[^\w\s]', '', name)
    name = re.sub(r'\s+', ' ', name)
    return name

products_data = json.load(open('handmadebestseller/frontend/src/data/products.json', 'r', encoding='utf-8'))
faire_data = json.load(open('faire_products_with_prices.json', 'r', encoding='utf-8'))

print("Products from products.json:")
for p in products_data[:5]:
    name = p.get('title') or p.get('name', '')
    print(f"Original: {name}")
    print(f"Norm    : {normalize(name)}")
    
print("\nProducts from faire:")
for fp in faire_data[:5]:
    name = fp.get('name', '')
    print(f"Original: {name}")
    print(f"Norm    : {normalize(name)}")

