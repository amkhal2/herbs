from openpyxl import load_workbook

def get_data():
    filepath = r"C:\Users\user\Documents\Herbs App\Plants Benefits.xlsx"

    wb = load_workbook(filepath)
    ws = wb["Sheet1"]
    rows = iter(list(ws.rows))
    a = next(rows)

    l = []
    for row in rows:
    ##    print(row[0].value)
    ##    print(row[1].value)
    ##    print(row[2].value.split('\n'))
    ##    print(row[3].value)
        l.append([row[0].value, row[1].value,
                  row[2].value, row[3].value])
    ##    print()
        
        
##    print(len(l))
    return l

