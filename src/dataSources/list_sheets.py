import pandas as pd

xl = pd.ExcelFile('Datasets.xlsx')
print('Sheets:', xl.sheet_names)

for sheet in xl.sheet_names:
    df = pd.read_excel('Datasets.xlsx', sheet_name=sheet)
    print(f'\nSheet: {sheet}\nColumns:', df.columns.tolist())