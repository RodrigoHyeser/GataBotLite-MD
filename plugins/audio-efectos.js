import { unlinkSync, readFileSync } from 'fs'
import { join } from 'path'
import { exec } from 'child_process'

let handler = async (m, { conn, args, __dirname, usedPrefix, command }) => {
try {
let q = m.quoted ? m.quoted : m
let mime = ((m.quoted ? m.quoted : m.msg).mimetype || '')
let set
if (/bass/.test(command)) set = '-af "equalizer=f=40:width_type=h:width=50:g=14"' //'-af equalizer=f=94:width_type=o:width=2:g=30' 
if (/blown/.test(command)) set = '-af "acrusher=.1:1:32:0:log,bandpass=f=500:h=2000,compand=attacks=0:points=-40/-20|-20/-10|0/-5|20/-2|40/-1|inf/0,areverse,acrusher=.1:1:32:0:log,bandpass=f=500:h=2000,compand=attacks=0:points=-40/-20|-20/-10|0/-5|20/-2|40/-1|inf/0,areverse"' //'-af "acrusher=.1:1:64:0:log,areverse,acrusher=.1:1:64:0:log,areverse"' //'-af acrusher=.1:1:64:0:log'
if (/deep/.test(command)) set = '-af "atempo=4/4,asetrate=44500*2/3,highpass=f=100,lowpass=f=15000,sinc=48000:lanczos"' //'-af atempo=4/4,asetrate=44500*2/3'
if (/earrape/.test(command)) set = '-af "compand=attacks=0:points=-80/-80|-35/-5|0/-2|20/-1.5:gain=5:delay=0,limit=6dB"' //'-af volume=12'
if (/fast/.test(command)) set = '-filter:a "atempo=1.63,asetrate=44100,highpass=f=1000,lowpass=f=6000"' //'-filter:a "atempo=1.63,asetrate=44100"'
if (/fat/.test(command)) set = '-af "equalizer=f=60:width_type=h:width=50:g=-6"' //'-filter:a "atempo=1.6,asetrate=22100"'
if (/nightcore/.test(command)) set = `-filter:a "atempo=1.06,asetrate=44100*1.25,firequalizer=gain_entry='entry(0,6);entry(250,0);entry(500,-3);entry(1000,-3);entry(2000,-2);entry(4000,0);entry(8000,2);entry(16000,3)',equalizer=f=800:t=h:width_type=h:width=50:g=20"` //'-filter:a atempo=1.06,asetrate=44100*1.25'
if (/reverse/.test(command)) set = '-filter_complex "areverse, highpass=f=200, lowpass=f=8000, afftdn"' //'-filter_complex "areverse"'
if (/robot/.test(command)) set = `-filter_complex "afftfilt=real='hypot(re,im)*sin(2*PI*2000*t)':imag='hypot(re,im)*cos(2*PI*2000*t)':win_size=512:overlap=0.75, asetrate=44100"` //'-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"'
if (/slow/.test(command)) set = `-filter:a "atempo=0.7,asetrate=44100, equalizer=f=60:width_type=h:width=100:g=5, compand=attacks=0:points=-80/-80|-10.1/-5.1|-3.0/-3.0|0/-0.1:knees=120/120|5/5|2/2|0/0:gain=3:volume=-3:delay=0"` //'-filter:a "atempo=0.7,asetrate=44100"'
if (/smooth/.test(command)) set = '-af "lowpass=f=500,highpass=f=100"' //'-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"'
if (/tupai|squirrel|chipmunk/.test(command)) set = '-filter:a "atempo=0.5,asetrate=88200,aresample=soxr"' //'-filter:a "atempo=0.5,asetrate=65100"'
if (/audio/.test(mime)) {
let ran = getRandom('.mp3')
let filename = join(__dirname, '../tmp/' + ran)
let media = await q.download(true)
exec(`ffmpeg -i ${media} ${set} ${filename}`, async (err, stderr, stdout) => {
await unlinkSync(media)
if (err) throw `_*Error!*_`
let buff = await readFileSync(filename)
conn.sendFile(m.chat, buff, ran, null, m, true, {
type: 'audioMessage', 
ptt: true 
})})
} else throw `*RESPONDER A UN AUDIO O NOTA DE VOZ PARA APLICAR EL FILTRO USANDO ${usedPrefix + command}*`
} catch (e) {
throw e
}}
handler.command = /^(bass|blown|deep|earrape|fas?t|nightcore|reverse|robot|slow|smooth|tupai|squirrel|chipmunk)$/i
export default handler

const getRandom = (ext) => {
return `${Math.floor(Math.random() * 10000)}${ext}`}