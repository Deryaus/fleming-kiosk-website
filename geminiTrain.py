import google.generativeai as genai
import os
import time
import pandas as pd
import seaborn as sns
import matplotlib
import matplotlib.pyplot as plt
from modelTools import increment_version,get_lastest_model
#from dotenv import load_dotenv

os.environ["GRPC_VERBOSITY"] = "ERROR"
os.environ["GLOG_minloglevel"] = "2"
 
#Load the environment variables
#load_dotenv()

API_KEY = os.getenv('API_KEY')
BASE_MODEL = "gemini-1.5-flash"
google_sheets_id = "198kz2K3n8Hpa3mrwZKFL8pcDid0F_6xW23Qxhvu61Tc"
google_sheets =  f"https://docs.google.com/spreadsheets/d/{google_sheets_id}/gviz/tq?tqx=out:csv"
df = pd.read_csv(google_sheets)
training_data = []
for _, row in df.iterrows():
    first_col = df.columns[0]  
    second_col = df.columns[1]
    training_data.append({
        "text_input": row[first_col],  
        "output": row[second_col]
    })


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
operation = genai.create_tuned_model(
    display_name="FlemingKiosk",
    id=new_id,
    temperature=0.1,
    source_model=base_model,
    epoch_count=30,
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
