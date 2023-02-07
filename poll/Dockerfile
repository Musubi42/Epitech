FROM python:alpine3.17

WORKDIR /home/poll

COPY . .

RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 80

CMD [ "python", "./app.py" ]