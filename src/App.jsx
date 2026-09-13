
import { useState,useEffect } from 'react';
import './App.css';


const initialSubjects = [
  {
    id: 1,
    name: 'Artificial Intelligence',
    short: 'AI',
    color: 'purple',
    progress: 72,
  },
  {
    id: 2,
    name: 'Database Management',
    short: 'DBMS',
    color: 'blue',
    progress: 58,
  },
  {
    id: 3,
    name: 'Computer Networks',
    short: 'CN',
    color: 'orange',
    progress: 40,
  },
];

const initialTasks = [
  { id: 1, title: 'Complete AI Unit 3 notes', subject: 'Artificial Intelligence', time: '9:00 AM', done: false },
  { id: 2, title: 'Practice SQL queries', subject: 'Database Management', time: '10:30 AM', done: false },
  { id: 3, title: 'Revise network layers', subject: 'Computer Networks', time: '12:00 PM', done: true },
];

const menuItems = [
  { name: 'Dashboard', icon: '◫' },
  { name: 'My Subjects', icon: '▤' },
  { name: 'Study Planner', icon: '▦' },
  { name: 'Assignments', icon: '✓' },
  { name: 'Exams', icon: '▣' },
  { name: 'Focus Timer', icon: '◷' },
  { name: 'Analytics', icon: '▥' },
];

function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [studentName, setStudentName] = useState(() => {
    try {
      return localStorage.getItem('studypilot-student-name') || 'Student';
    } catch {
      return 'Student';
    }
  });

  useEffect(() => {
    localStorage.setItem('studypilot-student-name', studentName);
  }, [studentName]);

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(studentName);

  function editStudentName() {
    setNameDraft(studentName);
    setIsEditingName(true);
  }

  function saveStudentName(event) {
    event.preventDefault();
    const trimmedName = nameDraft.trim();
    if (!trimmedName) return;
    setStudentName(trimmedName);
    setIsEditingName(false);
  }
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('studypilot-tasks');
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });
  const [plannerTitle, setPlannerTitle] = useState('');
  const [plannerSubject, setPlannerSubject] = useState('');
  const [plannerTime, setPlannerTime] = useState('');
  const [plannerDate, setPlannerDate] = useState('');
  const [plannerFilter, setPlannerFilter] = useState('All');
  const [assignments, setAssignments] = useState(() => { try { return JSON.parse(localStorage.getItem('studypilot-assignments')) || []; } catch { return []; } });
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentSubject, setAssignmentSubject] = useState('');
  const [assignmentDue, setAssignmentDue] = useState('');
  const [exams, setExams] = useState(() => { try { return JSON.parse(localStorage.getItem('studypilot-exams')) || []; } catch { return []; } });
  const [examTitle, setExamTitle] = useState('');
  const [examSubject, setExamSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('');
  useEffect(() => { localStorage.setItem('studypilot-exams', JSON.stringify(exams)); }, [exams]);
  function addExam(event) { event.preventDefault(); const title = examTitle.trim(); if (!title || !examDate) return; setExams(current => [...current, { id: Date.now(), title, subject: examSubject || 'General', date: examDate, time: examTime }]); setExamTitle(''); setExamSubject(''); setExamDate(''); setExamTime(''); }
  function deleteExam(id) { setExams(current => current.filter(item => item.id !== id)); }
  useEffect(() => { localStorage.setItem('studypilot-assignments', JSON.stringify(assignments)); }, [assignments]);
  function addAssignment(event) { event.preventDefault(); const title = assignmentTitle.trim(); if (!title) return; setAssignments(current => [...current, { id: Date.now(), title, subject: assignmentSubject || 'General', due: assignmentDue, done: false }]); setAssignmentTitle(''); setAssignmentSubject(''); setAssignmentDue(''); }
  function toggleAssignment(id) { setAssignments(current => current.map(item => item.id === id ? { ...item, done: !item.done } : item)); }
  function deleteAssignment(id) { setAssignments(current => current.filter(item => item.id !== id)); }

const [subjects, setSubjects] = useState(() => {
  try {
    const saved = localStorage.getItem('studypilot-subjects');
    return saved ? JSON.parse(saved) : initialSubjects;
  } catch {
    return initialSubjects;
  }
});

const [subjectName, setSubjectName] = useState('');
const [subjectProgress, setSubjectProgress] = useState('0');
const [editingId, setEditingId] = useState(null);

useEffect(() => {
  localStorage.setItem(
    'studypilot-subjects',
    JSON.stringify(subjects)
  );
}, [subjects]);

function saveSubject(event) {
  event.preventDefault();

  const name = subjectName.trim();
  const progress = Number(subjectProgress);

  if (!name || !Number.isFinite(progress) || progress < 0 || progress > 100) {
    return;
  }

  if (editingId !== null) {
    setSubjects((current) =>
      current.map((subject) =>
        subject.id === editingId
          ? {
              ...subject,
              name,
              short: name.slice(0, 4).toUpperCase(),
              progress,
            }
          : subject
      )
    );
  } else {
    setSubjects((current) => [
      ...current,
      {
        id: Date.now(),
        name,
        short: name.slice(0, 4).toUpperCase(),
        color: 'purple',
        progress,
      },
    ]);
  }

  setSubjectName('');
  setSubjectProgress('0');
  setEditingId(null);
}

function editSubject(subject) {
  setSubjectName(subject.name);
  setSubjectProgress(String(subject.progress));
  setEditingId(subject.id);
}

function deleteSubject(id) {
  const confirmed = window.confirm(
    'Are you sure you want to delete this subject?'
  );

  if (confirmed) {
    setSubjects((current) =>
      current.filter((subject) => subject.id !== id)
    );
  }
}

function cancelEdit() {
  setSubjectName('');
  setSubjectProgress('0');
  setEditingId(null);
}
  const [timerMode, setTimerMode] = useState('Focus');
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!timerRunning) return undefined;
    const interval = window.setInterval(() => {
      setTimerSeconds((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(interval);
          setTimerRunning(false);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning]);

  function changeTimerMode(mode) {
    setTimerMode(mode);
    setTimerRunning(false);
    setTimerSeconds((mode === 'Focus' ? 25 : 5) * 60);
  }

  const completedTasks = tasks.filter((task) => task.done).length;
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const upcomingExams = exams
    .filter((exam) => exam.date >= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date));
  const nextExam = upcomingExams[0];
  const daysUntilExam = (date) => {
    const target = new Date(`${date}T00:00:00`);
    const current = new Date(`${todayKey}T00:00:00`);
    return Math.max(0, Math.ceil((target - current) / 86400000));
  };
  const pendingAssignments = assignments.filter((item) => !item.done).length;
  const averageProgress = subjects.length
    ? Math.round(subjects.reduce((sum, subject) => sum + Number(subject.progress || 0), 0) / subjects.length)
    : 0;


  function addPlannerTask(event) {
    event.preventDefault();
    const title = plannerTitle.trim();
    if (!title) return;
    setTasks((current) => [...current, {
      id: Date.now(),
      title,
      subject: plannerSubject || 'General',
      time: plannerTime || 'Any time',
      date: plannerDate,
      done: false,
    }]);
    setPlannerTitle('');
    setPlannerSubject('');
    setPlannerTime('');
    setPlannerDate('');
  }

  function removePlannerTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  function toggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={(event) => {
          event.preventDefault();
          setActivePage('Dashboard');
        }}>
          <span className="brand-icon">S</span>
          <span>StudyPilot</span>
        </a>

        <div className="profile-card">
          <div className="avatar">{studentName.charAt(0).toUpperCase()}</div>
          <div className="profile-details">
            {isEditingName ? (
              <form onSubmit={saveStudentName}>
                <label htmlFor="student-name-input">Your name</label>
                <input
                  id="student-name-input"
                  type="text"
                  value={nameDraft}
                  onChange={(event) => setNameDraft(event.target.value)}
                  placeholder="Enter your name"
                  autoFocus
                  required
                />
                <div className="subject-form-actions">
                  <button type="submit" className="text-button">Save</button>
                  <button type="button" className="text-button" onClick={() => setIsEditingName(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <strong>{studentName}</strong>
                <span>My learning space</span>
                <button type="button" className="text-button" onClick={editStudentName}>Edit name</button>
              </>
            )}
          </div>
        </div>

        <p className="menu-label">WORKSPACE</p>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${activePage === item.name ? 'active' : ''}`}
              onClick={() => setActivePage(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>
              
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <span className="upgrade-star">✦</span>
            <strong>Keep learning!</strong>
            <p>Small steps every day lead to big results.</p>
          </div>
          <p className="sidebar-footer">StudyPilot · Your study companion</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>{activePage}</strong>
          </div>
          <div className="topbar-actions">
            <span className="today-label">Saturday, September 12</span>
            <button className="notification-button" aria-label="Notifications">♧</button>
            <div className="small-avatar">{studentName.charAt(0).toUpperCase()}</div>
          </div>
        </header>

        <section className="page-content">
          {activePage === 'Exams' ? (
            <section className="exams-page">
              <div className="welcome-row"><div><p className="eyebrow">BE READY FOR EXAM DAY</p><h1>Exams <span>✦</span></h1><p className="welcome-subtitle">Add your upcoming exams and keep all the important details in one place.</p></div></div>
              <div className="assignment-summary"><div className="panel"><span>Total exams</span><strong>{exams.length}</strong></div><div className="panel"><span>Subjects</span><strong>{new Set(exams.map(item => item.subject)).size}</strong></div><div className="panel"><span>Upcoming</span><strong>{exams.filter(item => item.date >= new Date().toISOString().slice(0, 10)).length}</strong></div></div>
              <section className="panel assignment-form-panel"><div className="panel-heading"><div><h2>Add an exam</h2><p>Enter the subject, date, and time of your exam.</p></div></div>
                <form className="assignment-form" onSubmit={addExam}><label htmlFor="exam-title">Exam name</label><input id="exam-title" value={examTitle} onChange={e => setExamTitle(e.target.value)} placeholder="e.g. Internal Assessment 1" required />
                  <div className="assignment-fields"><div><label htmlFor="exam-subject">Subject</label><select id="exam-subject" value={examSubject} onChange={e => setExamSubject(e.target.value)}><option value="">Choose a subject</option>{subjects.map(subject => <option key={subject.id} value={subject.name}>{subject.name}</option>)}<option value="General">General</option></select></div><div><label htmlFor="exam-date">Exam date</label><input id="exam-date" type="date" value={examDate} onChange={e => setExamDate(e.target.value)} required /></div><div><label htmlFor="exam-time">Time (optional)</label><input id="exam-time" type="time" value={examTime} onChange={e => setExamTime(e.target.value)} /></div></div><button className="primary-button" type="submit">＋ Add exam</button></form></section>
              <section className="panel assignment-list-panel"><div className="panel-heading"><div><h2>Your exam schedule</h2><p>Exams are shown in date order.</p></div></div>
                {exams.length === 0 ? <p className="welcome-subtitle">No exams added yet. Add your first exam above.</p> : <div className="exam-list">{[...exams].sort((a,b) => a.date.localeCompare(b.date)).map(item => <div className="exam-card" key={item.id}><div className="exam-date"><span>{new Date(item.date + 'T00:00:00').toLocaleDateString('en-US',{month:'short'}).toUpperCase()}</span><strong>{new Date(item.date + 'T00:00:00').getDate()}</strong></div><div className="exam-details"><strong>{item.title}</strong><span>{item.subject} · {new Date(item.date + 'T00:00:00').toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'short',day:'numeric'})}{item.time ? ` · ${item.time}` : ''}</span></div><button className="text-button planner-delete" onClick={() => deleteExam(item.id)} aria-label={`Delete ${item.title}`}>Delete</button></div>)}</div>}</section>
            </section>
          ) : activePage === 'Assignments' ? (
            <section className="assignment-page">
              <div className="welcome-row"><div><p className="eyebrow">KEEP TRACK OF YOUR WORK</p><h1>Assignments <span>✦</span></h1><p className="welcome-subtitle">Add due dates and check off assignments when finished.</p></div></div>
              <div className="assignment-summary"><div className="panel"><span>Total assignments</span><strong>{assignments.length}</strong></div><div className="panel"><span>Completed</span><strong>{assignments.filter(item => item.done).length}</strong></div><div className="panel"><span>Pending</span><strong>{assignments.filter(item => !item.done).length}</strong></div></div>
              <section className="panel assignment-form-panel"><div className="panel-heading"><div><h2>Add an assignment</h2><p>Record the work you need to complete.</p></div></div>
                <form className="assignment-form" onSubmit={addAssignment}><label htmlFor="assignment-title">Assignment title</label><input id="assignment-title" value={assignmentTitle} onChange={e => setAssignmentTitle(e.target.value)} placeholder="e.g. Prepare DBMS record" required />
                  <div className="assignment-fields"><div><label htmlFor="assignment-subject">Subject</label><select id="assignment-subject" value={assignmentSubject} onChange={e => setAssignmentSubject(e.target.value)}><option value="">Choose a subject</option>{subjects.map(subject => <option key={subject.id} value={subject.name}>{subject.name}</option>)}<option value="General">General</option></select></div><div><label htmlFor="assignment-due">Due date</label><input id="assignment-due" type="date" value={assignmentDue} onChange={e => setAssignmentDue(e.target.value)} /></div></div><button className="primary-button" type="submit">＋ Add assignment</button></form></section>
              <section className="panel assignment-list-panel"><div className="panel-heading"><div><h2>Your assignments</h2><p>{assignments.length ? 'Mark each assignment complete when you finish.' : 'Your assignment list will appear here.'}</p></div></div>
                {assignments.length === 0 ? <p className="welcome-subtitle">No assignments yet. Add one above.</p> : <div className="task-list">{assignments.map(item => <div className={`task-row ${item.done ? 'task-done' : ''}`} key={item.id}><button className={`task-check ${item.done ? 'checked' : ''}`} onClick={() => toggleAssignment(item.id)} aria-label={item.done ? 'Mark assignment incomplete' : 'Mark assignment complete'}>{item.done ? '✓' : ''}</button><div className="task-details"><strong>{item.title}</strong><span>{item.subject}{item.due ? ` · Due ${item.due}` : ''}</span></div><button className="text-button planner-delete" onClick={() => deleteAssignment(item.id)} aria-label={`Delete ${item.title}`}>Delete</button></div>)}</div>}</section>
            </section>
          ) : activePage === 'Study Planner' ? (
            <section className="planner-page">
              <div className="welcome-row">
                <div>
                  <p className="eyebrow">PLAN YOUR LEARNING</p>
                  <h1>Study Planner <span>✦</span></h1>
                  <p className="welcome-subtitle">Add study sessions, choose a subject, and tick them off as you finish.</p>
                </div>
              </div>
              <div className="planner-summary">
                <div className="planner-summary-card"><span>Total sessions</span><strong>{tasks.length}</strong></div>
                <div className="planner-summary-card"><span>Completed</span><strong>{tasks.filter((task) => task.done).length}</strong></div>
                <div className="planner-summary-card"><span>To do</span><strong>{tasks.filter((task) => !task.done).length}</strong></div>
              </div>
              <section className="panel planner-form-panel">
                <div className="panel-heading"><div><h2>Add a study session</h2><p>Build your own study checklist.</p></div></div>
                <form className="planner-form" onSubmit={addPlannerTask}>
                  <label htmlFor="planner-title">What do you want to study?</label>
                  <input id="planner-title" value={plannerTitle} onChange={(event) => setPlannerTitle(event.target.value)} placeholder="e.g. Revise Unit 2" required />
                  <div className="planner-fields">
                    <div><label htmlFor="planner-subject">Subject</label>
                      <select id="planner-subject" value={plannerSubject} onChange={(event) => setPlannerSubject(event.target.value)}>
                        <option value="">Choose a subject</option>
                        {subjects.map((subject) => <option key={subject.id} value={subject.name}>{subject.name}</option>)}
                        <option value="General">General</option>
                      </select>
                    </div>
                    <div><label htmlFor="planner-date">Date</label><input id="planner-date" type="date" value={plannerDate} onChange={(event) => setPlannerDate(event.target.value)} /></div>
                    <div><label htmlFor="planner-time">Time</label><input id="planner-time" type="time" value={plannerTime} onChange={(event) => setPlannerTime(event.target.value)} /></div>
                  </div>
                  <button className="primary-button" type="submit">＋ Add session</button>
                </form>
              </section>
              <section className="panel planner-list-panel">
                <div className="panel-heading"><div><h2>Your study sessions</h2><p>Check off sessions as you complete them.</p></div>
                  <select aria-label="Filter sessions" className="planner-filter" value={plannerFilter} onChange={(event) => setPlannerFilter(event.target.value)}>
                    <option>All</option><option>To do</option><option>Completed</option>
                  </select>
                </div>
                {tasks.filter((task) => plannerFilter === 'All' || (plannerFilter === 'Completed' ? task.done : !task.done)).length === 0
                  ? <p className="welcome-subtitle">Nothing here yet. Add a session above.</p>
                  : <div className="task-list">{tasks.filter((task) => plannerFilter === 'All' || (plannerFilter === 'Completed' ? task.done : !task.done)).map((task) => (
                    <div className={`task-row ${task.done ? 'task-done' : ''}`} key={task.id}>
                      <button className={`task-check ${task.done ? 'checked' : ''}`} onClick={() => toggleTask(task.id)} aria-label={task.done ? 'Mark session incomplete' : 'Mark session complete'}>{task.done ? '✓' : ''}</button>
                      <div className="task-details"><strong>{task.title}</strong><span>{task.subject}{task.date ? ` · ${task.date}` : ''}</span></div>
                      <span className="task-time">{task.time}</span>
                      <button className="text-button planner-delete" onClick={() => removePlannerTask(task.id)} aria-label={`Delete ${task.title}`}>Delete</button>
                    </div>
                  ))}</div>}
              </section>
            </section>
          ) : activePage === 'Focus Timer' ? (
            <section className="focus-timer-page">
              <div className="welcome-row">
                <div>
                  <p className="eyebrow">STAY PRESENT</p>
                  <h1>Focus Timer <span>✦</span></h1>
                  <p className="welcome-subtitle">Work in a focused session, then take a short break.</p>
                </div>
              </div>
              <section className="panel timer-panel">
                <div className="timer-modes" role="group" aria-label="Timer mode">
                  <button className={timerMode === 'Focus' ? 'timer-mode active' : 'timer-mode'} onClick={() => changeTimerMode('Focus')}>Focus · 25 min</button>
                  <button className={timerMode === 'Break' ? 'timer-mode active' : 'timer-mode'} onClick={() => changeTimerMode('Break')}>Break · 5 min</button>
                </div>
                <div className="timer-clock" aria-live="polite">
                  {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:{String(timerSeconds % 60).padStart(2, '0')}
                </div>
                <p className="timer-caption">{timerSeconds === 0 ? 'Session complete! Great work.' : timerMode === 'Focus' ? 'Time to concentrate on one task.' : 'Relax, stretch, and recharge.'}</p>
                <div className="timer-actions">
                  <button className="primary-button" onClick={() => timerSeconds === 0 ? setTimerSeconds((timerMode === 'Focus' ? 25 : 5) * 60) : setTimerRunning((running) => !running)}>
                    {timerSeconds === 0 ? 'Start again' : timerRunning ? 'Pause' : 'Start'}
                  </button>
                  <button className="text-button" onClick={() => { setTimerRunning(false); setTimerSeconds((timerMode === 'Focus' ? 25 : 5) * 60); }}>Reset</button>
                </div>
              </section>
            </section>
          ) : activePage === 'My Subjects' ? (
            <section className="subjects-page">
              <div className="welcome-row">
                <div>
                  <p className="eyebrow">YOUR LEARNING SPACE</p>
                  <h1>My Subjects <span>✦</span></h1>
                  <p className="welcome-subtitle">Organize your subjects and track your syllabus progress.</p>
                </div>
              </div>

              <div className="panel subject-form-panel">
                <div className="panel-heading"><div><h2>{editingId !== null ? 'Edit Subject' : 'Add a New Subject'}</h2><p>Enter your subject details below.</p></div></div>
                <form onSubmit={saveSubject} className="subject-form">
                  <label htmlFor="subject-name">Subject name</label>
                  <input id="subject-name" type="text" placeholder="e.g. Mathematics" value={subjectName} onChange={(event) => setSubjectName(event.target.value)} required />
                  <label htmlFor="subject-progress">Syllabus completed (%)</label>
                  <input id="subject-progress" type="number" min="0" max="100" value={subjectProgress} onChange={(event) => setSubjectProgress(event.target.value)} required />
                  <div className="subject-form-actions">
                    <button className="primary-button" type="submit">{editingId !== null ? 'Save Changes' : 'Add Subject'}</button>
                    {editingId !== null && <button className="text-button" type="button" onClick={cancelEdit}>Cancel</button>}
                  </div>
                </form>
              </div>

              <div className="panel">
                <div className="panel-heading"><div><h2>Your Subjects</h2><p>{subjects.length} subjects in your learning space</p></div></div>
                {subjects.length === 0 ? <p className="welcome-subtitle">No subjects yet. Add your first subject above!</p> : (
                  <div className="subject-list">
                    {subjects.map((subject) => (
                      <div className="subject-row" key={subject.id}>
                        <div className={`subject-icon ${subject.color}`}>{subject.short}</div>
                        <div className="subject-info">
                          <div className="subject-title"><strong>{subject.name}</strong><span>{subject.progress}%</span></div>
                          <div className="subject-progress"><span className={subject.color} style={{ width: `${subject.progress}%` }} /></div>
                          <div className="subject-form-actions">
                            <button type="button" className="text-button" onClick={() => editSubject(subject)}>Edit</button>
                            <button type="button" className="text-button" onClick={() => deleteSubject(subject.id)}>Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ) : activePage === 'Analytics' ? (
            <section className="analytics-page">
              <div className="welcome-row"><div><p className="eyebrow">YOUR LEARNING INSIGHTS</p><h1>Analytics <span>✦</span></h1><p className="welcome-subtitle">A snapshot of your study progress and workload.</p></div></div>
              <div className="stats-grid">
                <div className="stat-card"><p className="stat-label">Subjects tracked</p><div className="stat-value">{subjects.length}</div><div className="stat-bottom">Your active learning subjects</div></div>
                <div className="stat-card"><p className="stat-label">Sessions completed</p><div className="stat-value">{completedTasks}<span> / {tasks.length}</span></div><div className="stat-bottom">Study planner completion</div></div>
                <div className="stat-card"><p className="stat-label">Pending assignments</p><div className="stat-value">{pendingAssignments}</div><div className="stat-bottom">Assignments not yet completed</div></div>
                <div className="stat-card"><p className="stat-label">Average syllabus progress</p><div className="stat-value">{averageProgress}<span>%</span></div><div className="mini-progress"><span style={{width:`${averageProgress}%`}} /></div></div>
              </div>
              <section className="panel"><div className="panel-heading"><div><h2>Subject progress</h2><p>Progress values from My Subjects.</p></div></div>
                {subjects.length ? <div className="subject-list">{subjects.map(subject => <div className="subject-row" key={subject.id}><div className={`subject-icon ${subject.color}`}>{subject.short}</div><div className="subject-info"><div className="subject-title"><strong>{subject.name}</strong><span>{subject.progress}%</span></div><div className="subject-progress"><span className={subject.color} style={{width:`${subject.progress}%`}} /></div></div></div>)}</div> : <p className="welcome-subtitle">Add subjects to see your progress here.</p>}
              </section>
              <section className="panel"><div className="panel-heading"><div><h2>Study workload</h2><p>Counts based on your saved planner tasks, assignments, and exams.</p></div></div>
                <div className="assignment-summary"><div className="panel"><span>Planner sessions</span><strong>{tasks.length}</strong></div><div className="panel"><span>Completed assignments</span><strong>{assignments.filter(item=>item.done).length}</strong></div><div className="panel"><span>Upcoming exams</span><strong>{upcomingExams.length}</strong></div></div>
              </section>
            </section>
          ) : (
            <>
          <div className="welcome-row">
            <div>
              <p className="eyebrow">YOUR PERSONAL STUDY SPACE</p>
              <h1>Good afternoon, {studentName} <span>✦</span></h1>
              <p className="welcome-subtitle">Ready to make today a productive one?</p>
            </div>
            <button className="primary-button" onClick={() => setActivePage('Study Planner')}>
              <span>＋</span> Plan my study
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon purple-bg">▤</span>
                <span className="stat-trend">This semester</span>
              </div>
              <p className="stat-label">Active subjects</p>
              <div className="stat-value">
  {String(subjects.length).padStart(2, '0')}
  <span> subjects</span>
</div>
              <div className="stat-bottom">Keep your learning organized</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon blue-bg">✓</span>
                <span className="stat-trend">Today's tasks</span>
              </div>
              <p className="stat-label">Tasks completed</p>
              <div className="stat-value">{completedTasks.toString().padStart(2, '0')} <span>/ {tasks.length}</span></div>
              <div className="mini-progress" role="progressbar" aria-label="Study tasks completed" aria-valuemin={0} aria-valuemax={tasks.length || 1} aria-valuenow={completedTasks}>
                <span style={{ width: `${tasks.length ? (completedTasks / tasks.length) * 100 : 0}%` }} />
              </div>
              <div className="stat-bottom">
                {tasks.length ? `${Math.round((completedTasks / tasks.length) * 100)}% complete · ${tasks.length - completedTasks} remaining` : 'Add a study session to track your progress'}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top"><span className="stat-icon orange-bg">✓</span><span className="stat-trend">Assignments</span></div>
              <p className="stat-label">Pending assignments</p>
              <div className="stat-value">{String(pendingAssignments).padStart(2, '0')} <span>left</span></div>
              <div className="stat-bottom">Track and complete your work</div>
            </div>

            <div className="stat-card">
              <div className="stat-top"><span className="stat-icon green-bg">▣</span><span className="stat-trend">Coming up</span></div>
              <p className="stat-label">Next examination</p>
              <div className="stat-value">{nextExam ? String(daysUntilExam(nextExam.date)).padStart(2, '0') : '—'} <span>{nextExam ? 'days' : ''}</span></div>
              <div className="stat-bottom">{nextExam ? `${nextExam.title} · ${nextExam.subject}` : 'No upcoming exams added'}</div>
            </div>
          </div>

          <div className="dashboard-grid">
            <section className="panel schedule-panel">
              <div className="panel-heading">
                <div>
                  <h2>Today's study plan</h2>
                  <p>Your daily learning checklist</p>
                </div>
                <button className="text-button" onClick={() => setActivePage('Study Planner')}>View planner ↗</button>
              </div>

              <div className="task-list">
                {tasks.map((task) => (
                  <div className={`task-row ${task.done ? 'task-done' : ''}`} key={task.id}>
                    <button
                      className={`task-check ${task.done ? 'checked' : ''}`}
                      onClick={() => toggleTask(task.id)}
                      aria-label={task.done ? 'Mark task incomplete' : 'Mark task complete'}
                    >
                      {task.done ? '✓' : ''}
                    </button>
                    <div className="task-details">
                      <strong>{task.title}</strong>
                      <span>{task.subject}</span>
                    </div>
                    <span className="task-time">{task.time}</span>
                  </div>
                ))}
              </div>

              <button className="add-task-button" onClick={() => setActivePage('Assignments')}>
                ＋ Manage assignments
              </button>
            </section>

            <section className="panel exam-panel">
              <div className="panel-heading">
                <div>
                  <h2>Upcoming exams</h2>
                  <p>Stay one step ahead</p>
                </div>
                <span className="calendar-icon">▣</span>
              </div>

              {upcomingExams.length === 0 ? (
                <p className="welcome-subtitle">No upcoming exams. Add an exam to see it here.</p>
              ) : upcomingExams.slice(0, 3).map((exam, index) => {
                const examDate = new Date(`${exam.date}T00:00:00`);
                return (
                  <div className="exam-card" key={exam.id}>
                    <div className={`exam-date ${index % 2 ? 'blue-date' : ''}`}>
                      <span>{examDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span>
                      <strong>{examDate.getDate()}</strong>
                    </div>
                    <div className="exam-details">
                      <strong>{exam.title}</strong>
                      <span>{exam.subject}{exam.time ? ` · ${exam.time}` : ''}</span>
                      <span className={`exam-badge ${index % 2 ? 'blue-badge' : ''}`}>{daysUntilExam(exam.date)} days remaining</span>
                    </div>
                  </div>
                );
              })}

              <button className="add-task-button" onClick={() => setActivePage('Exams')}>
                View all exams →
              </button>
            </section>
          </div>

          <div className="bottom-grid">
            <section className="panel subjects-panel">
              <div className="panel-heading">
                <div>
                  <h2>Subject progress</h2>
                  <p>Keep track of your syllabus</p>
                </div>
                <button className="text-button" onClick={() => setActivePage('My Subjects')}>View all ↗</button>
              </div>

              <div className="subject-list">
                {subjects.map((subject) => (
                  <div className="subject-row" key={subject.name}>
                    <div className={`subject-icon ${subject.color}`}>{subject.short}</div>
                    <div className="subject-info">
                      <div className="subject-title">
                        <strong>{subject.name}</strong>
                        <span>{subject.progress}%</span>
                      </div>
                      <div className="subject-progress">
                        <span className={subject.color} style={{ width: `${subject.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel focus-panel">
              <div className="panel-heading">
                <div>
                  <h2>Weekly focus</h2>
                  <p>Your study activity</p>
                </div>
                <span className="week-label">This week</span>
              </div>

              <div className="chart-summary">
                <div><strong>{averageProgress}%</strong><span>Average syllabus progress</span></div>
                <div><strong>{completedTasks}</strong><span>Study sessions completed</span></div>
              </div>
            </section>
          </div>

          <footer className="page-footer">
            Made for your learning journey <span>✦</span>
          </footer>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;