import requests
from bs4 import BeautifulSoup


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
            # if not postal_code.isnumeric():
            #     continue
            if postal_code.isnumeric():
                all_data.append({"name": name,
                                 "address": addr,
                                 "email": email,
                                 "phone_num": "+1-605-555-0166 ",
                                 "postal_code": postal_code})
            ch = ''
        ch += line
    return all_data


# scrape_restaurants()
# print(scrape_restaurants())
