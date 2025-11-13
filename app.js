const qs = (s, el=document) => el.querySelector(s);


const cb = document.createElement('input');
cb.type='checkbox'; cb.checked = task.completed; cb.ariaLabel = 'Toggle complete';


const text = document.createElement('div');
text.className='text'; text.contentEditable = true; text.textContent = task.text; text.spellcheck = true;


const actions = document.createElement('div'); actions.className='actions';
const del = document.createElement('button'); del.className='icon-btn danger'; del.textContent='Delete';
const dup = document.createElement('button'); dup.className='icon-btn'; dup.textContent='Duplicate';


actions.append(dup, del);
li.append(cb, text, actions);


// Toggle complete
cb.addEventListener('change', ()=>{ task.completed = cb.checked; li.classList.toggle('done', task.completed); save(); render(); });


// Edit text (Enter to commit)
text.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); text.blur(); } });
text.addEventListener('blur', ()=>{ const val = text.textContent.trim(); task.text = val || task.text; text.textContent = task.text; save(); render(); });


// Delete
del.addEventListener('click', ()=>{ state.tasks = state.tasks.filter(t=>t.id!==task.id); save(); render(); });


// Duplicate
dup.addEventListener('click', ()=>{ const copy = {...task, id:uid(), completed:false}; state.tasks.splice(state.tasks.indexOf(task)+1,0,copy); save(); render(); });


// Drag & drop
li.addEventListener('dragstart', ()=>{ li.classList.add('dragging'); });
li.addEventListener('dragend', ()=>{ li.classList.remove('dragging'); save(); render(); });


li.addEventListener('dragover', (e)=>{
e.preventDefault();
const dragging = qs('.task.dragging'); if(!dragging||dragging===li) return;
const rect = li.getBoundingClientRect();
const after = (e.clientY - rect.top) > rect.height/2; // place after when below middle
const draggingId = dragging.dataset.id;
const from = state.tasks.findIndex(t=>t.id===draggingId);
const to = state.tasks.findIndex(t=>t.id===task.id) + (after?1:0);
if(from===to || from+1===to) return;
const [moved] = state.tasks.splice(from,1);
state.tasks.splice(to>from?to-1:to, 0, moved);
render();
});


return li;
}


// --- Interactions ---
const input = qs('#newTask');
const addBtn = qs('#addBtn');
const filters = qsa('.chip');
const search = qs('#search');
const clearCompletedBtn = qs('#clearCompleted');
const exportBtn = qs('#exportBtn');


function addTask(){
const val = input.value.trim(); if(!val) return;
state.tasks.unshift({ id: uid(), text: val, completed: false, createdAt: Date.now() });
input.value=''; save(); render(); input.focus();
}


addBtn.addEventListener('click', addTask);
input.addEventListener('keydown', e=>{
