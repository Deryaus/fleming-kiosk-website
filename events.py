import os
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import time

def init_parser():
    """
    Sets the URL to the Fleming SAC events page.
    Returns:
        str: The URL of the Fleming SAC events page.
    """    
    url = "https://www.flemingsac.ca/events"
    image_folder = "./static/images"
    templates_folder = "./templates"

    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

    return soup, image_folder, templates_folder

def save_file(filetype, name, content, image_folder):
    """
    Saves content to a file in the specified folder with the given name and file type.

    Parameters:
    filetype (str): The type of file to save ("div" for text files, "img" for binary image files).
    name (str): The name of the file to be saved.
    content (str or bytes): The content to be written to the file.
    image_folder (str): The folder where the file will be saved.

    Returns:
    str: The path to the saved file.
    """
    output_file = os.path.join(image_folder, name)
    if filetype == "div":       
        write_type = "w"
        encoding_t = "utf-8"
    elif filetype == "img":
        write_type = "wb"
        encoding_t = None
    with open(output_file, write_type, encoding=encoding_t) as f:
        f.write(content)
    return output_file

def download_calendar(soup, image_folder):
    """
    Downloads an image from a specified URL and saves it to a local directory with a filename
    that includes the current date.
    The function performs the following steps:
    1. Sends a GET request to the specified URL to retrieve the HTML content.
    2. Parses the HTML content using BeautifulSoup to find the specific <img> tag with the class "hs-image-widget".
    3. Extracts the image URL from the <img> tag's "src" attribute.
    4. Constructs a filename using the current date in the format "calender_YYYY-MM-DD.jpg".
    5. Downloads the image from the extracted URL and saves it to the specified local directory.
    If the <img> tag or the "src" attribute is not found, appropriate messages are printed.
    Raises:
        requests.exceptions.RequestException: If there is an issue with the HTTP request.
        IOError: If there is an issue saving the image to the local directory.
    """

    # Find the specific div containing the image
    div = soup.find("img", {"class": "hs-image-widget"})
    if div:
        image_url = div["src"]
        if image_url:
            print(f"Image tag found: {image_url}")

            # Construct the filename with the current date
            image_name = f"calendar.jpg"

            # Download and save the image
            
            image_response = requests.get(image_url)
            image_path = save_file("img", image_name, image_response.content, image_folder)
            print(f"Image saved to {image_path}")
        else:
            print("Image tag not found inside the div.")
    else:
        print("Div containing the image not found.")

def download_event_div(soup, templates_folder):
    super_div = soup.find("section", {"id": "blog__filter"})
    if super_div:

        target_div = super_div.find("div", {"class": "columns is-gapless is-multiline is-mobile"})
        if target_div:
            div_name = "event_div.html"
            div_path = save_file("div", div_name, str(target_div), templates_folder)
            print(f"Event div saved to {div_path}")
        else:
            print("Event div not found inside the super div.")
    else:
        print("Event div not found.")
    return

def get_SAC_events():
    soup, image_folder, templates_folder = init_parser()
    download_calendar(soup, image_folder)
    download_event_div(soup, templates_folder)
    return

def get_all_events():
    get_SAC_events()

    return  

if __name__ == "__main__":
    while True:
        get_all_events()
        time.sleep(86400)  # Wait for 24 hours