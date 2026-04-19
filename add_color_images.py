import json

filepath = 'handmadebestseller_project/frontend/src/data/products.json'
with open(filepath, 'r', encoding='utf-8') as f:
    products = json.load(f)

for p in products:
    variations = p.get('variations', [])
    variation_types = p.get('variationTypes', {})
    
    # If the product has Color variations
    if 'Color' in variation_types:
        images = p.get('images', [])
        if not images and p.get('image'):
            images = [p['image']]
            
        color_image_map = {}
        idx = 0
        
        for v in variations:
            if 'Color' in v:
                color = v['Color']
                if v.get('image'):
                    color_image_map[color] = v['image']
                elif color not in color_image_map and images:
                    color_image_map[color] = images[idx % len(images)]
                    idx += 1
                    
                if color in color_image_map:
                    v['image'] = color_image_map[color]

with open(filepath, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)
print("Updated products with color images!")
