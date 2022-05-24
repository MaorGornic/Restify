# Restify

<p align="center">
    <img src="./readme-images/restifylogo.png">
</p>

A restaurant social media platform web application that allows restaurant owners to advertise their restaurant, create blog posts, communicate with other restaurant owners, grow their audience and much more.
Users can use this social media to explore new restaurants and foods.


# Installation/Usage


Begin by cloning this repository onto your computer by **git** and `cd` into it.
```bash
$ git clone https://github.com/MaorGornic/Restify.git my-app
$ cd my-app

```

# Automatic Setup 
  - First run the startup.sh script by running `source startup.sh`. This will make a virtual environment for you, install the required dependencies for the project, and apply all the neccessary migrations.
    -    After this step, you will need to run `source run.sh` to start the back-end as well as the front-end.

# Manual Setup 
  - Alternatively, you can follow the steps below and do the installation manually. If you follow the manual setup, it is advised to create a virtual environment for this project.
    - To create the enviornment, run `python -m virtualenv -p python3 venv` or `python3 -m virtualenv -p python3 venv`. To activate this environment, you will then run `source "venv/bin/activate"` if you are using Linux, or `source "venv/Scripts/activate"` if you are using Windows.

## Front-end 

   - First `cd` into the front-end directory and then run `npm install` to install all of the front-end's dependencies.
    
        - After doing that, here is a list of useful commands:

          - `npm start` 
            - Starts the development server which is listening for connections [here](http://localhost:3000/)

          - `npm run build`
            - Bundles the app into static files for production

          - `npm test`
            - Starts the test runner

  
           
## Back-end 

### Installation
```bash
$ cd back-end
$ pip install -r requirements.txt #install all required packages
$ python manage.py migrate
```

### Running the back-end

```bash
$ python manage.py runserver
```
