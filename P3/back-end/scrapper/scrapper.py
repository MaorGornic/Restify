from restaurant_scrapper import scrape_menus
from os import listdir
from os.path import isfile, join
import random
import requests

# True indicates that the db is empty. Recreates users and restaurants 
# False means you want to add more records
FRESH = True        

f = open("data/restaurants.csv", "r")
restaurants = f.readlines()
valid_descriptions = valid_items = scrape_menus()
valid_comments = open("data/comments.csv", "r").readlines()
all_words = ["this", "account", "restaurant", "is", "great", "sucks", "terrible", "hate", "love", "burger", "want", "cheese"]
blog_words = ["ever wondered", "how to make", "my", "experience", "with", "baking", "cooking", "nice", "beautiful", "chairs", "ketchup", "hotdog", "bacon", "eggs", "cheese", "tea", "bun", "burger", "want", "love","great", "this", "account", "restaurant", "is", "great", "sucks", "terrible", "hate", "love", "burger", "want", "cheese"]
number_of_blogs = 0

def main():
    global number_of_blogs, restaurants

    restaurants = restaurants[:50]    # Only taking the first 50 restaurants

    for i in range(1, len(restaurants) + 1):
        username = f"naruto{i}"
        password = "Cp98WbZYVmJM7Cj"
        if FRESH:
            register(i, username, password)

        # logging in
        token = login(username, password)

        if FRESH:
            create_restaurant(token, i - 1)
        
        add_menu_items(i, token)
        upload_pictures(i, token)
        add_blog_posts(i, token)

        # Each user follows and likes a few restaurants 

        for j in range(1, i):
            if random.randint(1, 2) == 1:   # 1/2 probability to follow a restaurant 
                URL = "http://127.0.0.1:8000/restaurants/{}/follow/".format(j)
                r = requests.patch(url=URL, headers={'Authorization': f'Bearer {token}'})
            if random.randint(1, 15) == 1:
                URL = "http://127.0.0.1:8000/restaurants/{}/like/".format(j)
                r = requests.patch(url=URL, headers={'Authorization': f'Bearer {token}'})
            if random.randint(1, 10) == 1:
                URL = "http://127.0.0.1:8000/restaurants/{}/comments/new/".format(j)
                new_comment = generate_random_comment()
                comment_data = {"contents": new_comment}
                r = requests.post(url=URL, data=comment_data, headers={'Authorization': f'Bearer {token}'})

        # Each user likes some blog posts below it 
        for blog in range(number_of_blogs):
            if random.randint(1, 10) == 1:
                URL = "http://127.0.0.1:8000/restaurants/blog/{}/like/".format(blog)
                r = requests.patch(url=URL, headers={'Authorization': f'Bearer {token}'})
    
    # Go over the first 10 restaurants and add blog posts/menu items to them
    # This creatres additional notificiations for the current followers 
    for i in range(1, 11):
        username = f"naruto{i}"
        password = "Cp98WbZYVmJM7Cj"
        token = login(username, password)

        add_blog_posts(i, token)
        add_menu_items(i, token)

def add_blog_posts(res_id, token, min_blogs=1, max_blogs=3):
    global number_of_blogs
    # Each restaurant has between 0-3 blog posts
    URL = "http://127.0.0.1:8000/restaurants/{}/blog/new/".format(res_id)
    for j in range(1, random.randint(min_blogs, max_blogs)):
        blog_post_dic = {
            "title": random.choice(blog_words),
            "contents": generate_random_blog()
        }
        dir_name = "blog_banners"
        banner = {'banner': open(f'{dir_name}/{pick_random_image(dir_name)}', 'rb')}
        r = requests.post(url=URL, data=blog_post_dic, files=banner, headers={'Authorization': f'Bearer {token}'})
        number_of_blogs += 1 

def login(username, password):
    """Login a user and return a corresponding token"""
    URL = "http://127.0.0.1:8000/accounts/api/token/"
    PARAMS = {
        "username": username,
        "password": password
    }
    r = requests.post(url=URL, data=PARAMS)

    # extracting data in json format
    data = r.json()
    token = data['access']
    return token

def create_restaurant(token, i):
    global restaurants 

    URL = "http://127.0.0.1:8000/restaurants/new/"
    res = restaurants[i].split("$$")
    
    res_data = {
        "name": res[0],
        "address": res[1],
        "email": res[2],
        "phone_num": res[3],
        "postal_code": res[4].strip()
    }

    if len(res) == 6:
        logo = {'logo': open(f'res_logos/{res[5].strip()}', 'rb')}
    else:
        dir_name = "res_logos"
        logo = {'logo': open(f'{dir_name}/{pick_random_image(dir_name)}', 'rb')}
    
    print("sending data", res_data, logo)    
    r = requests.post(url=URL, data=res_data, files=logo, headers={'Authorization': f'Bearer {token}'})

def add_menu_items(res_id, token, min_items=0, max_items=5):
    global restaurants

    URL = "http://127.0.0.1:8000/restaurants/{}/menu/new/".format(res_id)
    for j in range(1, random.randint(min_items+1, max_items+1)):   
        menu_item_dic = {
            "name": random.choice(valid_items),
            "description": random.choice(valid_descriptions),
            "price": random.randint(1, 50)
        }        
        if "sushi" in restaurants[res_id - 1]:
            print("has sushi... going to add a sushi picture")
            dir_name = "sushi_images"
        else:
            dir_name = "menu_images"
        picture = {'picture': open(f'{dir_name}/{pick_random_image(dir_name)}', 'rb')}
        r = requests.post(url=URL, data=menu_item_dic, files=picture, headers={'Authorization': f'Bearer {token}'})


def upload_pictures(res_id, token, min_pictures=0, max_pictures=3):
    URL = "http://127.0.0.1:8000/restaurants/{}/images/upload/".format(res_id)
    for _ in range(random.randint(min_pictures, max_pictures)):
        dir_name = "res_images"
        picture = {'ref_img': open(f'{dir_name}/{pick_random_image(dir_name)}', 'rb')}
        r = requests.post(url=URL, data={},files=picture, headers={'Authorization': f'Bearer {token}'})


def pick_random_image(dir_name):
    images = [f for f in listdir(dir_name) if isfile(join(dir_name, f))]
    return random.choice(images)

def generate_random_blog():
    words = random.randint(30, 150)
    blog = ""
    for _ in range(words):
        blog += random.choice(blog_words) + " "
    return blog.strip()

def generate_random_comment():
    return random.choice(valid_comments).strip()

def register(i, username, password):
    URL = "http://127.0.0.1:8000/accounts/register/"
    email = f"naruto{i}.uzumaki@gmail.com"
    first_name = f"Naruto{i}"
    last_name = f"Uzumaki{i}"

    PARAMS = {
        "username": username,
        "password": password,
        "password2": password,
        "email": email,
        "first_name": first_name,
        "last_name": last_name
    }

    r = requests.post(url=URL, data=PARAMS)


if __name__ == '__main__':
    main()
