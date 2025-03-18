# AI Functionality and Training Guide

## The AI Model

This kiosk's AI backend operates off a custom trained AI based on the gemini-1.5-flash model. This model is selected as it's the best price/efficiency rating model under the Google suite that supports fine-tuning customization. The model is fine-tuned using custom curated Fleming College Q&A training dataset to instruct the AI on the best method to respond to student questions.

## Google AI Studio

[Google AI Studio](https://aistudio.google.com/) is Google's tool for using API based AI services. This is an online portal for working with Google AI models. This portal includes features such as; chatting with models, tuning models, making apps, and more. The documentation can be found [here](https://ai.google.dev/gemini-api/docs) for more information on working with Google API and AI Studio. The [Google Gemini Cookbook](https://github.com/google-gemini/cookbook) hosted on GitHub is an excellent resource that covers in-depth the various methods and options possible with Google Gemini.

## Python AI Tools

### geminiTrain.py

[geminiTrain.py](../geminiTrain.py) is a Python script file that contains Python functions used for training the AI. By providing the API key and information about your dataset and base model, you can train a custom fine-tuned AI to suit your needs. The base model and API key can be provided at the top of the file. The base model can be either a regular model, like models/gemini-1.5-flash-001-tuning, or a previously tuned model (ex. tunedModels/flemingkiosk-v3). The file automatically increments the version ID every time you train a new model.

**When creating a tuned model**, you can configure the training through a list of options in the genai object.

```Python
operation = genai.create_tuned_model(
    display_name="FlemingKiosk",
    id=new_id,
    temperature=0.1,
    source_model=base_model,
    epoch_count=20,
    batch_size=4,
    learning_rate=0.001,
    training_data=training_data,
)
```

The **source_model** option contains the base model you are fine tuning and the **training_data** option contains your dataset. Besides that, the **learning_rate** should remain as is for best outcomes. The **epoch_count** can be modified to increase the training repetitions. However, this increasing in training time has diminishing returns. The **temperature** option refers to the 'creativity' of the model, causing more vairance in the replys.

Upon running the operation, the model will begin to train. The file provides a progress bar in the console to show the length of, and remaining time, until the training is finished. Upon completion, the script will; print out the name of the new model, plot the training loss curve and save it as an image, and run some test questions. These questions can be modified or by changing the text contained within the functions or appending the question to the file in the format shown below.

**Ex.**

```Python
result = model.generate_content("Is the college public or private?")
print(result.text)
```

**to**

```Python
result = model.generate_content("Who founded Fleming College in Canada?")
print(result.text)
```

### modelTools.py

[modelTools.py](../modelTools.py) is a Python script file that is used to help in training new models. It first requires a Google AI Studio API key.

**increment_version()** This function takes in the name of the version of the previous tuned model as a string in the format 'tunedModels/name-vX', where 'X' is the version number. It then increments that version number and returns it.

**list_tunable_models()** This function returns a list of tunable models that can be used for fine-tuning.

**list_tuned_models()** Returns a list of already fine-tuned models created and hosted by the user in Google AI Studio.

**get_latest_model()** Returns the most recently created model hosted in Google AI studio.

**delete_model()** Takes in a model name as a parameter in the format 'tunedModels/name-vX', where 'X' is the version number. It then deletes that model from AI Studio.

### Querying the model

All queries sent to the Google API are made using the **generate_content()** method on the model object. The **result** returned by the Google API is a complex datastructure containing various pieces on information on the query run on the model. The **result.text** option is used to access the text reply. In the case the question asked violates the safety protections in place on the AI, it will return the violation as an error message.

```Python
result = model.generate_content("Is the college public or private?")
print(result)
```

**Example full result**

```
response:
GenerateContentResponse(
    done=True,
    iterator=None,
    result=protos.GenerateContentResponse({
      "candidates": [
        {
          "content": {
            "parts": [
              {
                "text": "Fleming College was established through an Act of Ontario Parliament, making it a public college."
              }
            ],
            "role": "model"
          },
          "finish_reason": "STOP",
          "index": 0,
          "safety_ratings": [
            {
              "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              "probability": "NEGLIGIBLE"
            },
            {
              "category": "HARM_CATEGORY_HATE_SPEECH",
              "probability": "NEGLIGIBLE"
            },
            {
              "category": "HARM_CATEGORY_HARASSMENT",
              "probability": "NEGLIGIBLE"
            },
            {
              "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
              "probability": "NEGLIGIBLE"
            }
          ]
        }
      ],
      "usage_metadata": {
        "prompt_token_count": 7,
        "candidates_token_count": 18,
        "total_token_count": 25
      }
    }),
)
```

## Adding to the dataset

The dataset is a .csv file seperated into two columns. The header column must be **text_input,output**. Every other subsequent line in the .csv file comes in the format **question,answer**. New questions can be added by appending them to the end of the file. You can do this in any text editor, or by opening the .csv file in a spreadsheet editor.

**Example added question**

```
What is the campus size?,"200 acres in the City of Peterborough"
```
