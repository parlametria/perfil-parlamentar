import csv
import json

with open('data.csv') as csvfile:
    data = csv.reader(csvfile, delimiter=',')
    for row in data:
        respostas = ''
        for i in xrange(1,len(row)):
            respostas += row[i]
        with open('output.csv','w') as output_csv:
            fieldnames = ['idCandidato','respostas']
            writer = csv.DictWriter(output_csv,fieldnames = fieldnames)
            writer.writeheader()
            writer.writerow({'idCandidato': row[0],'respostas':respostas})  


jsonfile = open('data.json', 'w')
csvfile = open('output.csv', 'r')
fieldnames = ['idCandidato','respostas']
reader = csv.DictReader( csvfile, fieldnames)
for row in reader:
        json.dump(row,jsonfile)
        jsonfile.write('\n')



   
