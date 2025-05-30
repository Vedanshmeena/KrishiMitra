import joblib
from flask import Flask, render_template, request, redirect
from flask_cors import CORS
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def home():
    return render_template('Home_1.html')

@app.route('/Predict')
def prediction():
    return render_template('Index.html')

@app.route('/form', methods=["POST"])
def brain():
    print(request.form)
    Nitrogen=float(request.form['Nitrogen'])
    Phosphorus=float(request.form['Phosphorus'])
    Potassium=float(request.form['Potassium'])
    Temperature=float(request.form['Temperature'])
    Humidity=float(request.form['Humidity'])
    Ph=float(request.form['ph'])
    Rainfall=float(request.form['Rainfall'])
     
    values=[Nitrogen,Phosphorus,Potassium,Temperature,Humidity,Ph,Rainfall]

    
    if Ph>0 and Ph<=14 and Temperature<100 and Humidity>0:
        model = joblib.load('Pickle_RL_Model.pkl')
        arr = [values]
        acc = model.predict(arr)
        print(acc)
        return render_template('prediction.html', prediction=str(acc[0]))
    else:
        return "Sorry...  Error in entered values in the form Please check the values and fill it again"

if __name__ == '__main__':
    app.run(debug=True)