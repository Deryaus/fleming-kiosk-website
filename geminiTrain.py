import google.generativeai as genai
import os
import time
import pandas as pd
import seaborn as sns
import matplotlib
import matplotlib.pyplot as plt
from modelTools import increment_version,get_lastest_model

os.environ["GRPC_VERBOSITY"] = "ERROR"
os.environ["GLOG_minloglevel"] = "2"
 
API_KEY = "AIzaSyD84E4GHYIZCHhrMscz3X_l14wSdakY-CM"
BASE_MODEL = "gemini-1.5-flash"

#Configure the API key and base model
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel(BASE_MODEL)
generation_config = genai.GenerationConfig(
        max_output_tokens=500,
        temperature=0.1,
    )

#List Tuned Models
lastest_model_version = get_lastest_model()

#Automatically increments the version number of the model
new_id = increment_version(lastest_model_version)

#Train model using training data from csv file
base_model = "models/gemini-1.5-flash-001-tuning"
tuned_model = "tunedModels/flemingkiosk-v3"
training_data = r"C:\Users\Justi\Documents\School\Final Project\Fleming-Kiosk\Training Q&A - Sheet1.csv"
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

#status bar
for status in operation.wait_bar():
    time.sleep(10)

result = operation.result()
print(result)
# # You can plot the loss curve with:
snapshots = pd.DataFrame(result.tuning_task.snapshots)
sns_plot = sns.lineplot(data=snapshots, x='epoch', y='mean_loss')
sns_plot.figure.savefig("loss_curve.png")

result = model.generate_content("Is the college public or private?")
print(result.text)

result = model.generate_content("Who is the college's mascot?")
print(result.text)

result = model.generate_content("How do I access the bookstore?")
print(result.text)

