from restaurant_scrapper import scrape_restaurants
from os import listdir
from os.path import isfile, join
import random
import requests

valid_items = ["tea", "eggs and bacon", "cheese", "hot dog"]
valid_descriptions = ["tea", "eggs and bacon", "cheese", "hot dog"]

def main():
    restaurants = scrape_restaurants()

    for i in range(1, len(restaurants) + 1):
    # for i in range(1):
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
        # print(token)

        # create restaurant
        URL = "http://127.0.0.1:8000/restaurants/new/"
        # restaurant_data = restaurants[i]
        logo = {'logo': open(f'images/{pick_random_image()}', 'rb')}
        # print(restaurant_data)
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
            print(r.json())
            r = requests.post(url=URL, data=menu_item_dic,  headers={'Authorization': f'Bearer {token}'})

def pick_random_image():
    images = [f for f in listdir("images") if isfile(join("images", f))]
    return random.choice(images)


if __name__ == '__main__':
    main()
