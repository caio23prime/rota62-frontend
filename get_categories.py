import requests
import json

def get_categories():
    url = "https://admin.rota62go.com.br/wp-json/wp/v2/categories?per_page=100"
    try:
        res = requests.get(url, verify=False)
        data = res.json()
        print(f"{'ID':<5} | {'Slug':<30} | {'Name'}")
        print("-" * 60)
        for cat in data:
            print(f"{cat['id']:<5} | {cat['slug']:<30} | {cat['name']}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_categories()
