#The following is required before you run the script, this 
#basically allows local or remotely signed scripts to be run
#in this process. Better to avoid setting this globally.
#Set-ExecutionPolicy RemoteSigned -Scope Process

Start-Process node .\websocket_server\server.js

if($?){
    cd client
    Start-Process npx vite
}


if($?){
    cd ..\token_detector
    mamba activate ultralytics
    Start-Process python .\main.py 
}

cd ..
