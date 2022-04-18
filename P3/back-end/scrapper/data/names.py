
f = open("restaurants.csv", "r")
f_out = open("restaurants_cleaned.csv", "w")
reading_next = True 
for line in f:
    if reading_next:
        reading_next = False
        line = line.split(",")[0]
        print("got line", line)
        f_out.write(line + "\n")
    if '"' in line:
        reading_next = True  