import pandas as pd
import json
import pprint
# activity = pd.read_csv("./newones/activity.txt")
consult = pd.read_csv("./newones/consult.txt")
dc = pd.read_csv("./newones/dctemps.txt")
diet = pd.read_csv("./newones/diet.txt")
habit = pd.read_csv("./newones/habits.txt")
rx = pd.read_csv("./newones/rx.txt")
returns = pd.read_csv("./newones/returns.txt")
wc = pd.read_csv("./newones/woundcare.txt")
print(consult.shape)
print(dc.shape)
print(diet.shape)

jeffarray = [consult, diet, habit, rx, returns, wc]
names = ['consult', 'diet', 'habit', 'rx', 'returns', 'wc']

all_data = {}
for i in range(len(jeffarray)):
    df = jeffarray[i]
    category = names[i]
    data = []
    for idx, row in df.iterrows():
                entry = {'id': f'{category}_{idx}'}
                for col in df.columns:
                    entry[col.strip().lower()] = row[col]
                data.append(entry)
    all_data[category] = data
pprint.pprint(all_data)
with open('out.json', 'w', encoding='utf-8') as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)