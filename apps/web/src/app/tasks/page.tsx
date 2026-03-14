import { kanban } from '../../lib/mock-data';

export default function TasksPage() {
  return (
    <section>
      <h1>Kanban de Tasks</h1>
      <p className="small">Pipeline com prioridade, responsável e rastreabilidade.</p>
      <div className="kanban" style={{ marginTop: '1rem' }}>
        <div className="card">
          <h3>Todo</h3>
          {kanban.todo.map((task) => <p key={task}>{task}</p>)}
        </div>
        <div className="card">
          <h3>In Progress</h3>
          {kanban.inProgress.map((task) => <p key={task}>{task}</p>)}
        </div>
        <div className="card">
          <h3>Review</h3>
          {kanban.review.map((task) => <p key={task}>{task}</p>)}
        </div>
        <div className="card">
          <h3>Done</h3>
          {kanban.done.map((task) => <p key={task}>{task}</p>)}
        </div>
      </div>
    </section>
  );
}
