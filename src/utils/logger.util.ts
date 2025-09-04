const fs = require('fs');
const path = require('path');

const ensureLogDirectoryExists = (dirPath:string) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};
const pad = (n:number) :string => String(n).padStart(2, '0');
const writeLog = (level:string, messages:unknown[])=>{
    if (!Array.isArray(messages)) {
        messages = [messages]; 
    }
    try{
        const today = new Date();
        const date = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const logDir = path.join(__dirname, `../../logs`);
        ensureLogDirectoryExists(logDir);
        const logFilePath = path.join(logDir, `${pad(date)}-${pad(month)}-${year}.log`);
        const logMessage = `[${today.toLocaleString()}] ${level.toUpperCase()}: ${messages.map(msg => msg instanceof Error ? msg.stack : msg).join(' ')}\n`;
        fs.appendFile(logFilePath, logMessage, (err: NodeJS.ErrnoException | null) => {
            if (err) {
                console.error("Không thể ghi vào file log: ", err);
            }
        });
    }catch(e){
        console.error("Lỗi khi ghi vào file log", e);
    }
}
interface Logger {
    trace: (...message: unknown[]) => void;
    debug: (...message: unknown[]) => void;
    info: (...message: unknown[]) => void;
    warn: (...message: unknown[]) => void;
    error: (...message: unknown[]) => void;
    fatal: (...message: unknown[]) => void;
    critical: (...message: unknown[]) => void;
}
const logger:Logger = {
    trace: (...message) => writeLog('trace', message),
    debug: (...message) => writeLog('debug', message),
    info: (...message) => writeLog('info', message),
    warn: (...message) => writeLog('warn', message),
    error: (...message) => writeLog('error', message),
    fatal: (...message) => writeLog('fatal', message),
    critical: (...message) => writeLog('critical', message),
};
module.exports = logger;

