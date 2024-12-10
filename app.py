from flask import Flask, render_template, jsonify, request
from xel import get_data
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))

##### Development database:
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "data.sqlite3")

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# Create database table using SQLAlchemy
class Herbs(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plant_name = db.Column(db.String)
    binomial_name = db.Column(db.String)
    benefits = db.Column(db.String)
    toxicity = db.Column(db.String)
    

## 1) CREATE THE DATABASE: Run Python shell with "python" command --->
##    import db with "from app import db" ---> creat db with "db.create_all()"

## 2) FILL IN THE DATABASE TABLE (from Python shell):

# rows = get_data() # Parse "Mon Dictionnaire.xlsx" Excel file rows
# errors = ''
# for row in rows:
    # entry = Herbs(plant_name=row[0], binomial_name=row[1], benefits=row[2], toxicity=row[3])
    # db.session.add(entry)

## db.session.commit() --> saving items after they were added to database

# try:
    # db.session.commit()
# except Exception as e:
    # errors = errors + f"<p>{e}<p>" + "<br>"


@app.route("/")
def index():
    # Home page
    return render_template('index.html')


@app.route("/manage")
def manage_record():
    # Manage Record page
    return render_template('manage.html')
    

@app.route("/add_record", methods=['POST'])
def add_record():
    # when the user clicks the "add" button
    data = request.get_json()
    entry = Mawada(ch_no=data['ch_no'], ch_title=data['ch_title'], speaker=data['speaker'], content=data['content'])
    db.session.add(entry)
    
    try:
        db.session.commit()
        db.session.refresh(entry)
        return jsonify({ 'res': 'Record successfully added to database :-)',
                        'id': entry.id
        })
        
    except Exception as e:
        return jsonify({ 'res': f'Error while writing record to db: {e}' })


@app.route("/search_db", methods=['POST'])
def search_db():
    # the "search as you type" bar
    data = request.get_json()
    userInput = data['input']
    
    if userInput.strip() and len(userInput.strip()) > 1:
        results = Herbs.query.filter(Herbs.benefits.like(f'%{userInput}%') | Herbs.plant_name.like(f'%{userInput}%') |Herbs.toxicity.like(f'%{userInput}%') |Herbs.binomial_name.like(f'%{userInput}%') ).all()
        # the pipe operator | is used in the query instead of OR
        to_client =  [[i.id, i.plant_name, i.binomial_name, i.benefits.split('\n'), i.toxicity] for i in results]
        
        if to_client:
            return jsonify({
                'res': to_client,
                'status': 'success'
                })
        else:
            return jsonify({
                 'res': 'No Results found',
                 'status': 'fail'
            })
   
    return jsonify({
     'res': 'Can\'t look up a space/one character!',
     'status': 'fail'
    })


@app.route('/show_more', methods=['POST'])
def show_more():
    # when user clicks the hyperlink more details will be shown
    data = request.get_json()
    db_id = int(data["id"])
    page = data["page"]
    
    result = Herbs.query.filter_by(id=db_id).first()
    if page == "home":
        to_client = [result.plant_name, result.binomial_name, result.benefits.split('\n'), result.toxicity, result.id] 
    else:
        to_client = [result.plant_name, result.binomial_name, result.benefits, result.toxicity, result.id] 
        
    return jsonify({'res': to_client})


@app.route('/navigate', methods=['POST'])
def navigate(): # when the user clicks the << >> buttons to navigate records
    data = request.get_json()
    db_id = int(data["id"])
    direction = data["direction"]
    
    # to add/subtract 1 from the current "id" value 
    if direction == "previous":
            db_id = db_id - 1
    else:
        db_id = db_id + 1
    
    try:
        result = Mawada.query.filter_by(id=db_id).first()
        to_client = [result.ch_no, result.ch_title, result.speaker, result.content.replace('\n', '<br/><br/>'), result.id] 
        
        return jsonify({'res': to_client})
    except Exception:
        return 


@app.route('/selectBox') 
def selectBox():
    # when page loads, get items for Herb Name selectboxes
    herbs = db.engine.execute('select plant_name, count(*) from Herbs group by plant_name order by count(*)')
    herbs = [i[0] for i in herbs]
    
    return jsonify({
            'herbs': herbs,
            })

@app.route('/search_selectbox', methods=['POST'])
def search_selectbox():  # this will fire when clicking either of "See more" button

    data = request.get_json()
    
    if data['herb']:
        results = Herbs.query.filter_by(plant_name = data['herb']).all()
        
        res = [[i.id, i.plant_name, i.binomial_name, i.benefits.split('\n'), i.toxicity] for i in results]
        
        return jsonify({
                'res': res
                })


@app.route('/update_speaker', methods=['POST'])
def update_speaker():
    # when clicking "Update Speaker" button
    data = request.get_json()
    oldValue = data['oldValue']
    newValue = data['newValue']
    
    db.engine.execute('update Mawada set speaker = ? where speaker = ?', (newValue, oldValue))
     
    return jsonify({
            'res': 'Speaker Updated Successfully!'
            })

@app.route('/update_record', methods = ['POST'])
def update_record():
    # when clicking "update" button
    data = request.get_json()
    
    id = data['id']
    ch_no = data['ch_no']
    ch_title = data['ch_title']
    content = data['content']
    speaker = data['speaker']
    
    db.engine.execute('update Mawada set ch_no = ?, ch_title = ?, content = ?, speaker = ? where id = ?',
                            (ch_no, ch_title, content, speaker, id))
    
    return jsonify({
        'res': 'Record updated Successfully!'
         })

if __name__== "__main__":
    app.run(debug=True)
