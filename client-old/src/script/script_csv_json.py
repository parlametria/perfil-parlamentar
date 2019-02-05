#coding: utf-8
import csv
import json


output_csv = open('../data/output.csv', 'w')
fieldnames = ['idCandidato','respostas','primeira modificacao','ultima modificacao']
writer = csv.writer(output_csv)
writer.writerow(fieldnames)

with open('../data/respostas.csv') as csvfile:
    data = csv.reader(csvfile, delimiter=',')
    for row in data:
        respostas = []
        for i in xrange(10,len(row)):
            if row[i] == '1':
                respostas.append(1)
            elif row[i] == '3':
                respostas.append(-1)
            elif row[i] == '2':
                respostas.append(0)
            elif row[i] in (None, ""):
                respostas.append(None)
        export = [row[0],respostas,row[3],row[4]]
        writer.writerow(export)  

with open('../data/output.csv') as f:
    reader = csv.DictReader(f)
    rows = list(reader)
with open('../data/data.json', 'w') as f:
    json.dump(rows, f)


   
