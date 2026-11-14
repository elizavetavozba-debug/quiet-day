export const categories = { personal: 'Личное', work: 'Работа', care: 'Забота о себе' };
export function dateKey(date = new Date()) { return [date.getFullYear(), String(date.getMonth()+1).padStart(2,'0'), String(date.getDate()).padStart(2,'0')].join('-'); }
export function parseDate(key) { const [y,m,d] = key.split('-').map(Number); return new Date(y,m-1,d,12); }
export function shiftDay(key,n) { const d=parseDate(key); d.setDate(d.getDate()+n); return dateKey(d); }
export function calendarDays(month) { const start=new Date(month.getFullYear(),month.getMonth(),1,12); start.setDate(start.getDate() - (start.getDay()+6)%7); return Array.from({length:42},(_,i)=>shiftDay(dateKey(start),i)); }
export function taskWord(n) { const a=n%10,b=n%100; return a===1&&b!==11?'задача':a>=2&&a<=4&&(b<12||b>14)?'задачи':'задач'; }
export function visibleTasks(tasks,{view,selected,today,filter,query}) { return tasks.filter(t=>(view==='all'||view==='upcoming'&&t.due_date>=today||((view==='calendar'||view==='today')&&t.due_date===selected))&&(filter==='all'||(filter==='done'?t.completed:!t.completed))&&((t.title+' '+t.notes).toLocaleLowerCase('ru').includes(query.toLocaleLowerCase('ru')))).sort((a,b)=>a.due_date.localeCompare(b.due_date)||Number(a.completed)-Number(b.completed)||(a.time||'99:99').localeCompare(b.time||'99:99')||Number(b.priority==='high')-Number(a.priority==='high')); }
