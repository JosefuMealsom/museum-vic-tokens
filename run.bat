set dir_path=%cd%

start cmd.exe /c "cd %dir_path% && node .\websocket_server\server.js"
start cmd.exe /c "cd %dir_path% && cd client && npm run dev"
start cmd.exe /c "cd %dir_path% && cd token_detector && mamba activate token_detection && python .\main.py"
