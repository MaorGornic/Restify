from restaurant_scrapper import scrape_restaurants
from os import listdir
from os.path import isfile, join
import random
import requests

# True indicates that the db is empty. Recreates users and restaurants 
# False means you want to add more records
FRESH = True      

valid_items = ["tea", "eggs and bacon", "cheese", "hot dog", "chicken", "pizza", "burger", "steak", "salad", "pasta", "soup", "dessert", "drink", "cake", "ice cream", "cake", "coffee", "tea", "eggs and bacon", "cheese", "hot dog"]
valid_descriptions = ["tea", "eggs and bacon", "cheese", "chicken", "pizza", "burger", "steak", "salad", "pasta", "soup", "dessert", "drink", "cake", "ice cream", "cake", "coffee", "tea", "eggs and bacon", "cheese", "hot dog"]
all_words = ["this", "account", "restaurant", "is", "great", "sucks", "terrible", "hate", "love", "burger", "want", "cheese"]
blog_words = ["ever wondered", "how to make", "my", "experience", "with", "baking", "cooking", "nice", "beautiful", "chairs", "ketchup", "hotdog", "bacon", "eggs", "cheese", "tea", "bun", "burger", "want", "love","great", "this", "account", "restaurant", "is", "great", "sucks", "terrible", "hate", "love", "burger", "want", "cheese"]

def main():
    number_of_blogs = 0
    restaurants = scrape_restaurants()

    for i in range(1, len(restaurants) + 1):
        URL = "http://127.0.0.1:8000/accounts/register/"
        username = f"naruto{i}"
        password = "Cp98WbZYVmJM7Cj"
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

        # sending get request and saving the response as response object
        if FRESH:
            r = requests.post(url=URL, data=PARAMS)

        # logging in
        URL = "http://127.0.0.1:8000/accounts/api/token/"
        PARAMS = {
            "username": username,
            "password": password
        }
        r = requests.post(url=URL, data=PARAMS)

        # extracting data in json format
        data = r.json()
        token = data['access']

        # create restaurant
        URL = "http://127.0.0.1:8000/restaurants/new/"
        dir_name = "res_logos"
        logo = {'logo': open(f'{dir_name}/{pick_random_image(dir_name)}', 'rb')}
        # print(restaurant_data)
        if FRESH:
            r = requests.post(url=URL, data=restaurants[i], files=logo, headers={'Authorization': f'Bearer {token}'})

        # Add menu items to restaurant 
        URL = "http://127.0.0.1:8000/restaurants/{}/menu/new/".format(i)
        
        # Each restaurant has between 0-9 menu items
        for j in range(1, random.randint(1, 10)):   
            menu_item_dic = {
                "name": random.choice(valid_items),
                "description": random.choice(valid_descriptions),
                "price": random.randint(1, 50)
            }        
            dir_name = "menu_images"
            picture = {'picture': open(f'{dir_name}/{pick_random_image(dir_name)}', 'rb')}
            r = requests.post(url=URL, data=menu_item_dic, files=picture, headers={'Authorization': f'Bearer {token}'})

        # Each restaurant has between 0-5 pictures
        URL = "http://127.0.0.1:8000/restaurants/{}/images/upload/".format(i)
        for j in range(1, random.randint(1, 5)):
            dir_name = "res_images"
            picture = {'ref_img': open(f'{dir_name}/{pick_random_image(dir_name)}', 'rb')}
            r = requests.post(url=URL, data={},files=picture, headers={'Authorization': f'Bearer {token}'})
            print(r.json())
        
        # Each restaurant has between 0-5 blog posts
        URL = "http://127.0.0.1:8000/restaurants/{}/blog/new/".format(i)
        for j in range(1, random.randint(1, 5)):
            blog_post_dic = {
                "title": random.choice(blog_words),
                "contents": generate_random_blog()
            }
            dir_name = "blog_banners"
            banner = {'banner': open(f'{dir_name}/{pick_random_image(dir_name)}', 'rb')}
            r = requests.post(url=URL, data=blog_post_dic, files=banner, headers={'Authorization': f'Bearer {token}'})
            number_of_blogs += 1 

        # Each user follows and likes a few restaurants 

        for j in range(1, i):
            if random.randint(1, 10) == 1:   # 1/10 probability to follow a restaurant 
                URL = "http://127.0.0.1:8000/restaurants/{}/follow/".format(j)
                r = requests.patch(url=URL, headers={'Authorization': f'Bearer {token}'})
            if random.randint(1, 10) == 1:
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

def pick_random_image(dir_name):
    images = [f for f in listdir(dir_name) if isfile(join(dir_name, f))]
    return random.choice(images)

def generate_random_blog():
    words = random.randint(30, 200)
    blog = ""
    for _ in range(words):
        blog += random.choice(blog_words) + " "
    return blog.strip()

def generate_random_comment():
    words = random.randint(1, 30)
    comment = ""
    for _ in range(words):
        comment += random.choice(all_words) + " "
    return comment.strip()

if __name__ == '__main__':
    main()
