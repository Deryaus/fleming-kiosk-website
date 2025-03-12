import google.generativeai as genai
import re
import matplotlib.style
import pandas as pd
import seaborn as sns
import matplotlib
import matplotlib.pyplot as plt

API_KEY = "AIzaSyD84E4GHYIZCHhrMscz3X_l14wSdakY-CM"

genai.configure(api_key=API_KEY)

#Used to increment the version # of the model. 
#Needs a model name in the format of tunedModels/name-vX where X is the version number

def increment_version(model_name):
    """
    Increment the version number in the given model name.
    Args:
        model_name (str): The model name in the format 'tunedModels/name-vX', 
                          where 'X' is the version number.
    Returns:
        str: The model name with the incremented version number.
    Raises:
        ValueError: If the model name does not match the expected format.
    """
    
    _, id_portion = model_name.split('/')

    match = re.search(r'(.*-v)(\d+)$', id_portion)
    if match:
        base = match.group(1)
        version = int(match.group(2)) + 1
        return f"{base}{version}"
    else:
        raise ValueError("ID does not match the expected format (tunedModels/name-vX).")


#Get a list of tunable models
def list_tunable_models():
    """
    Lists all tunable models available in the genai library.

    This function retrieves a list of models from the genai library and filters
    them to include only those that support the "createTunedModel" generation method.

    Returns:
        list: A list of tunable models that support the "createTunedModel" generation method.
    """
    tunable_models = [
        m for m in genai.list_models()
        if "createTunedModel" in m.supported_generation_methods]
    return tunable_models

#Get a list of tuned models
def list_tuned_models():
    """
    Retrieves a list of tuned model names from the genai library.
    This function calls the `genai.list_tuned_models()` method to get information
    about all tuned models and extracts their names. The names are then printed
    and returned as a list.
    Returns:
        list: A list of strings, where each string is the name of a tuned model.
    """
    model_names = []
    for model_info in genai.list_tuned_models():
        model_names.append(model_info.name)

    print(model_names)
    return model_names

def get_lastest_model():
    """
    Retrieves the latest model from a list of tuned models.

    This function calls `list_tuned_models()` to get a list of model names.
    If the list is not empty, it prints and returns the name of the latest model.
    If the list is empty, it prints a message indicating that no models are available.

    Returns:
        str: The name of the latest model if available, otherwise None.
    """
    model_names = list_tuned_models()
    if model_names:
        last_model = model_names[-1]
        print(f"Newest model: {last_model}")
    else:
        print("No models available to increment.")
    return last_model

#deletes a tuned model
def delete_model(model_name):
    try:
        genai.delete_tuned_model(model_name)
    except Exception as e: 
        print(e)
    return

if __name__ == "__main__":

    lastest = get_lastest_model()
    print(increment_version(lastest))
    print(list_tunable_models())
    print(list_tuned_models())
    
