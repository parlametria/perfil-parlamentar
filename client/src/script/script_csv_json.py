#coding: utf-8
import csv
import json

output_csv = open('../data/output.csv', 'w')
fieldnames = ['idCandidato','respostas','primeira modificacao','ultima modificacao']
writer = csv.DictWriter(output_csv,fieldnames = fieldnames)

with open('../data/respostas.csv') as csvfile:
    data = csv.reader(csvfile, delimiter=',')
    for row in data:
        respostas = []
        #nome = row[7] + row[8]
        for i in xrange(10,len(row)):
            if row[i] == '1':
                respostas.append(1)
            elif row[i] == '3':
                respostas.append(-1)
            elif row[i] == '2':
                respostas.append(0)
            elif row[i] in (None, ""):
                respostas.append(None)
        writer.writerow({'idCandidato': row[0],'respostas':respostas, 
        'primeira modificacao':row[3], 'ultima modificacao': row[4]})  


jsonfile = open('../data/data.json', 'w')
csvfile = open('../data/output.csv', 'r')
reader = csv.DictReader( csvfile, fieldnames)
for row in reader:
        json.dump(row,jsonfile)
        jsonfile.write('\n')



   
