import requests
import random 
valid_phones = open("data/phones.csv", "r").readlines()

def scrape_restaurants():
    response = requests.get(
        "https://raw.githubusercontent.com/DataScienceSpecialization/courses/master/03_GettingData/03_02_summarizingData/data/restaurants.csv")
    # print(response.text)
    lines = response.text
    # print(lines)
    ch = ''
    all_data = []
    for index, line in enumerate(lines):
        if line == '"' and lines[index + 1] == '\n':
            data = ch.strip().split(",")
            name = data[0].replace('"', "").strip()
            addr = data[5].replace('"', "").replace("\n", " ") + "," + data[6]
            addr.replace("\n", " ")
            email = f"{name.strip()}@gmail.com".replace(" ", "")
            postal_code = data[1][:5]
            if postal_code.isnumeric():
                all_data.append({"name": name,
                                 "address": addr,
                                 "email": email,
                                 "phone_num": random.choice(valid_phones).strip(),
                                 "postal_code": postal_code})
            ch = ''
        ch += line

    # Move all data back to a file
    f = open("data/restaurants.csv", "w")
    for data in all_data:
        f.write(f"{data['name']}$${data['address']}$${data['email']}$${data['phone_num']}$${data['postal_code']}\n")
    f.close()
    return all_data



def scrape_menus():
    all_menus = []
    f = open("data/menu.csv", "r")
    lines = f.readlines()
    for line in lines:
        all_menus.append(line.strip())
    
    return all_menus 


# scrape_restaurants()
