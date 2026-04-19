import json
import re
import os

# ----------------------------
# LOAD DATA
# ----------------------------
RAW_PATH = r'c:\Users\Administrator\Desktop\atlasurbancraft\handmade_products.json'
OUTPUT_PATH = r'c:\Users\Administrator\Desktop\atlasurbancraft\handmadebestseller_project\frontend\src\data\products.json'

with open(RAW_PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

products = data.get('products', [])

# ----------------------------
# SLUG MAPPING (from constants.ts)
# ----------------------------
RAW_CATEGORIES = [
    { 'name': 'Leather Bags', 'slug': 'leather-bag', 'matches': ['Leather Bag'] },
    { 'name': 'Leather Backpacks', 'slug': 'leather-backpack-kilim', 'matches': ['Leather Backpack'] },
    { 'name': 'Handwoven Baskets', 'slug': 'handwoven-stitch-baskets', 'matches': ['Basket', 'Stitch Basket'] },
    { 'name': 'Moroccan Ceramics', 'slug': 'ceramic-collection', 'matches': ['Ceramic'] },
    { 'name': 'Footwear', 'slug': 'footwear-collection', 'matches': ['Footwear', 'Sandals'] },
    { 'name': 'Easter Baskets', 'slug': 'easter-basket', 'matches': ['Easter'] },
    { 'name': 'Straw Bags', 'slug': 'christmas-straw-bags', 'matches': ['Straw Bag'] },
    { 'name': 'Best Sellers', 'slug': 'best-sellers', 'matches': ['Best Seller'] }
]

def get_slug_for_category(category_name):
    for cat in RAW_CATEGORIES:
        for match in cat['matches']:
            if match.lower() in category_name.lower():
                return cat['slug']
    return 'catalog' # Default

# ----------------------------
# HELPERS
# ----------------------------

def detect_category(p):
    title = p.get('title', '').lower()
    p_type = p.get('product_type', '').lower()
    desc = p.get('body_html', '').lower()
    text = f"{title} {p_type} {desc}"

    if 'backpack' in text and 'leather' in text:
        return "Leather Backpack"
    elif 'backpack' in text:
        return "Backpack"
    elif 'leather' in text and ('bag' in text or 'tote' in text or 'crossbody' in text or 'messenger' in text):
        return "Leather Bag"
    elif 'sandal' in text or 'babouche' in text or 'shoe' in text or 'footwear' in text or 'mule' in text:
        return "Footwear"
    elif 'ceramic' in text or 'vase' in text or 'pottery' in text:
        return "Ceramic"
    elif 'easter' in text:
        return "Easter Basket"
    elif 'straw' in text and 'hat' in text:
        return "Straw Hat"
    elif 'straw' in text and ('bag' in text or 'tote' in text):
        return "Straw Bag"
    elif 'stitch' in text and 'basket' in text:
        return "Stitch Basket"
    elif 'basket' in text:
        return "Basket"
    else:
        return "Accessories"

def get_product_images(p):
    images = p.get('images', [])
    return [img.get('src', '') for img in images if img.get('src')]

# ----------------------------
# PROCESS PRODUCTS
# ----------------------------

processed_products = []

for p in products:
    title = p.get("title", "")
    handle = p.get("handle", "")
    description = p.get("body_html", "")
    
    price_str = p.get("variants", [{}])[0].get("price", "0")
    try:
        price = float(price_str)
    except:
        price = 0.0

    category = detect_category(p)
    images = get_product_images(p)
    image = images[0] if images else ""
    
    # Simple score for best sellers
    tags = [t.lower() for t in p.get('tags', [])]
    text = f"{title.lower()} {' '.join(tags)} {description.lower()}"
    score = len(tags) * 2 + (10 if "leather" in text else 0) + (5 if "straw" in text else 0)

    # Convert ID to string to avoid type mismatches in TS
    product = {
        "id": str(p.get("id", "")),
        "title": title,
        "handle": handle,
        "description": description,
        "price": price,
        "category": category,
        "image": image,
        "images": images,
        "score": score
    }

    processed_products.append(product)

# ----------------------------
# BEST SELLERS 
# ----------------------------
processed_products.sort(key=lambda x: x.get("score", 0), reverse=True)

for i in range(min(50, len(processed_products))):
    p = processed_products[i]
    cat = str(p.get("category", "Accessories"))
    p["category"] = cat + " Best Seller"

# ----------------------------
# FINAL OUTPUT
# ----------------------------

for p in processed_products:
    p["slug"] = get_slug_for_category(p["category"])
    if "score" in p:
        p.pop("score")

with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(processed_products, f, indent=2)

print(f"✅ Processed {len(processed_products)} products.")
print(f"📂 Output saved to {OUTPUT_PATH}")