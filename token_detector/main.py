
import numpy
import cv2
import math
import socketio
from ultralytics import YOLO
from statistics import mean

sio = socketio.SimpleClient()
sio.connect('ws://localhost:5000', transports=['websocket'])

model = YOLO('best-sea-tokens.pt')
model.to('cuda')

model_classes = model.names
print(model.names)

video_stream = cv2.VideoCapture(0)

rolling_averages = {"crab": [], "lobster": [], "octopus": [], "seahorse" : [], "turtle": []}

def append_to_cached_predictions(class_name, prediction):
    max_cached_items = 15
    rolling_averages[class_name].append(prediction)
    if(len(rolling_averages[class_name]) > max_cached_items):
        # Maybe more efficient to use a dequeue
        rolling_averages[class_name].pop(0)


def calculate_rolling_average(box_object):
    current_predictions = {"crab" : 0, "lobster": 0, "octopus": 0, "seahorse" : 0, "turtle": 0}

    class_indices_to_name = [model_classes[int(cls)] for cls in box_object.cls]
    predictions = [prediction.item() for prediction in box_object.conf]
    class_prediction_tuple = [(class_indices_to_name[index], predictions[index]) for index in range(len(class_indices_to_name))]

    # May detect multiple of the same shape. Just take the
    # object with the highest confidence
    for cls, prediction in class_prediction_tuple:
        current_predictions[cls] = max(current_predictions[cls], prediction)

    for cls, prediction in current_predictions.items():
        append_to_cached_predictions(cls, prediction)

    predictions_average = {} 
    for cls, predictions in rolling_averages.items():
        if len(predictions) == 0:
            break
        predictions_average[cls] = mean(predictions)
    
    return predictions_average

def filter_predictions(predictions, min_conf_level):
    predictions = [p for p in predictions if predictions[p] > min_conf_level]
    return predictions


def send_detections_over_websockets(predictions):
    # For now, best to be running it all the time, so comment out
    # the following code
    # if len(predictions) == 0:
    #     return
    sio.emit("tokens_detected:app", predictions)

def render_boxes(frame, boxes):
    for box in boxes:
        x1, y1, x2, y2 = box.xyxy[0]
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
        w, h = x2-x1, y2 - y1
        center = (int(x1 + (w / 2)), int(y1 + (h/2)))
        
        conf = math.ceil((box.conf[0]*100))/100

        cls = box.cls[0]
        name = model_classes[int(cls)]

        cv2.rectangle(frame, (x1, y1), (x2,y2), (0,255,0), 2)
        cv2.circle(frame, center, 5, (0, 255, 0), -1)
        font = cv2.FONT_HERSHEY_SIMPLEX
        cv2.putText(frame, f"{name}, {conf}",(x1 + 10,y1 + 30), font, 1, (0,255,0),2,cv2.LINE_AA)


while True:
    success, frame = video_stream.read()
    frame = cv2.resize(frame, (600, 600))

    results = model(frame, stream=True, verbose=False)
    
    if not success:
        continue

    averages = {}

    for r in results:
        boxes = r.boxes
        averages = calculate_rolling_average(boxes)
        render_boxes(frame, boxes)
    
    send_detections_over_websockets(filter_predictions(averages, 0.6))
    cv2.imshow("Image", frame)
    key = cv2.waitKey(1)
    if key == 27:
        break

video_stream.release()

