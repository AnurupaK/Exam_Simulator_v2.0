from flask import Flask,render_template,request,jsonify
import os
import sys
import re
app = Flask(__name__, template_folder='../Frontend/templates',static_folder='../Frontend/static')
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'modules')))
from Extraction import extract_question_details
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'AI_Service')))
from llama import generate_response

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/student.html')
def student_area():
    return render_template('student.html')

@app.route('/application.html')
def application_area():
    return render_template('application.html')




@app.route('/api/questions_making',methods = ['POST'])
def QuestionMaker():
    data = request.get_json()
    
    # Check if 'details_collection' exists in the data
    if 'details_collection' in data:
        global nested_details
        nested_details = data['details_collection']

        # Check if all required keys exist in the nested_details dictionary
        required_keys = ['name', 'topic', 'grade', 'subject', 'mcq', 'level']
        if all(key in nested_details for key in required_keys):
            global name
            name = nested_details['name']
            global topic
            topic = nested_details['topic']
            global grade
            grade = nested_details['grade']
            global subject
            subject = nested_details['subject']
            global mcq
            mcq = nested_details['mcq']
            global level
            level = nested_details['level']

            # Print the values
            print("Name:", name)
            print("Topic:", topic)
            print("Grade:", grade)
            print("Subject:", subject)
            print("MCQ:", mcq)
            print("Level:", level)

            prompt = f"Generate {mcq} {subject} questions on the topic {topic} for class {grade} kid named {name} and questions level is {level}"
            print(prompt)
            response = generate_response(1, prompt)
            print("Question made")
            print(response)

            extracted_details = extract_question_details(response)
            print("Details----",extracted_details)
            print(type(extracted_details))
            global Question_list
            global OptionA_list
            global OptionB_list
            global OptionC_list
            global OptionD_list
            global Answer_list
            Question_list = []
            OptionA_list, OptionB_list, OptionC_list, OptionD_list = [], [], [], []
            Answer_list = []
            
            for details in extracted_details:
                for key,value in details.items():
                    print(key,':',value)
                    if key =='Question':
                        Question_list.append(details[key])
                    if key =='Answer':
                        Answer_list.append(details[key])
                    if key == 'Options':
                        for sub_key, sub_value in value.items():
                            print(sub_key)
                            if sub_key == 'OptionA':
                                OptionA_list.append(value[sub_key])
                            if sub_key == 'OptionB':
                                OptionB_list.append(value[sub_key])
                            if sub_key == 'OptionC':
                                OptionC_list.append(value[sub_key])
                            if sub_key == 'OptionD':
                                OptionD_list.append(value[sub_key])

            print(OptionA_list, OptionB_list, OptionC_list, OptionD_list)
            return jsonify({'questions': Question_list, 'OptionsA': OptionA_list, 'OptionsB': OptionB_list, 'OptionsC': OptionC_list, 'OptionsD': OptionD_list, 'msg': 'All details found'})
        else:
            return jsonify({'msg': 'All details not found'})
    else:
        return jsonify({'msg': 'Details collection not found'})


@app.route('/api/bot_checking_answers',methods=['POST'])
def checkanswers():
    score = 0
    data = request.get_json()
    useranswer = data['userResponses']

    print('OptionA',OptionA_list)
    print('OptionB',OptionB_list)
    print('OptionC',OptionC_list)
    print('OptionD',OptionD_list)
    options_combined = [
    {
        'OptionA': a,
        'OptionB': b,
        'OptionC': c,
        'OptionD': d
    }
    for a, b, c, d in zip(OptionA_list, OptionB_list, OptionC_list, OptionD_list)
    ]
    # print(useranswer)
    user_answer_list = []
    for key,value in useranswer.items():
        user_answer_list.append(value)
    # print(Answer_list)
    for userAns,actualAns in zip(user_answer_list,Answer_list):
        if(userAns==actualAns):
             score+=1 
    
    
    print("Questions",Question_list)
    print("Option List", options_combined)
    print("Actual Answer", Answer_list)
    print("User answer",user_answer_list)
    
    prompt2 = f'A student named {name} has given an exam today for {subject} subject on the topic {topic}. {name} studies in class {grade}. These are the set of questions {Question_list}. These are options for the questions {options_combined}. These are actual answers {Answer_list}. These are the answers that the student has written {user_answer_list}. The student has scored {score}/{mcq}. You have to give a brief report about student\'s performance in 210 words only.'

    
    bot_response = generate_response(1,prompt2)
    print(bot_response)

    
    return jsonify({'score':score,'mcq':mcq,'bot_response':bot_response})


@app.route('/api/chat',methods=['POST'])
def chatBot():
    data = request.get_json()
    userTxt = data['user_text']
    
    response = generate_response(1,userTxt)
    print(response)
    return jsonify({'chatRes':response})


if __name__ =="__main__":
    app.run(debug=True)