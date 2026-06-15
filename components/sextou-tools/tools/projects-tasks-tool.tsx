"use client"

import { useEffect, useMemo, useState } from "react"
import { HistoryList } from "@/components/sextou-tools/history-list"

interface ProjectsTasksToolProps {
  historyItems: Array<{
    title: string
    subtitle?: string
    timestamp: string
  }>
}

interface TaskRecord {
  id: string
  title: string
  status: string
  priority: string
  assigneeName?: string | null
  dueDate?: string | null
}

interface ProjectRecord {
  id: string
  name: string
  description?: string | null
  status: string
  priority: string
  progress: number
  dueDate?: string | null
  tasks: TaskRecord[]
}

const initialProject = {
  name: "",
  description: "",
  status: "PLANNING",
  priority: "MEDIUM",
  dueDate: "",
}

const initialTask = {
  projectId: "",
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  assigneeName: "",
  dueDate: "",
}

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleDateString("pt-BR") : "Sem prazo"
}

export function ProjectsTasksTool({ historyItems }: ProjectsTasksToolProps) {
  const [projects, setProjects] = useState<ProjectRecord[]>([])
  const [projectForm, setProjectForm] = useState(initialProject)
  const [taskForm, setTaskForm] = useState(initialTask)
  const [localHistory, setLocalHistory] = useState(historyItems)
  const [statusMessage, setStatusMessage] = useState("Crie projetos, tarefas e acompanhe o progresso da operacao.")
  const [isSavingProject, setIsSavingProject] = useState(false)
  const [isSavingTask, setIsSavingTask] = useState(false)

  useEffect(() => {
    async function loadProjects() {
      const response = await fetch("/api/sextou-tools/projects")
      if (!response.ok) return
      const data = await response.json()
      setProjects(data.projects ?? [])
    }

    void loadProjects()
  }, [])

  const overview = useMemo(() => {
    const totalProjects = projects.length
    const totalTasks = projects.reduce((sum, project) => sum + project.tasks.length, 0)
    const completedTasks = projects.reduce(
      (sum, project) => sum + project.tasks.filter((task) => task.status === "DONE").length,
      0
    )
    const inProgressProjects = projects.filter((project) => project.status === "IN_PROGRESS").length

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      inProgressProjects,
    }
  }, [projects])

  async function refreshProjects() {
    const response = await fetch("/api/sextou-tools/projects")
    if (!response.ok) return
    const data = await response.json()
    setProjects(data.projects ?? [])
  }

  async function handleCreateProject() {
    setIsSavingProject(true)
    try {
      const response = await fetch("/api/sextou-tools/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...projectForm,
          dueDate: projectForm.dueDate || null,
        }),
      })

      if (!response.ok) {
        throw new Error("project-save-failed")
      }

      await fetch("/api/sextou-tools/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug: "gerenciador-projetos-tarefas",
          input: { name: projectForm.name, status: projectForm.status },
          output: { projectCreated: true },
          metadata: { summary: `${projectForm.name} · projeto criado` },
        }),
      })

      setLocalHistory((current) => [
        {
          title: "gerenciador projetos tarefas",
          subtitle: `${projectForm.name} · projeto criado`,
          timestamp: new Date().toLocaleString("pt-BR"),
        },
        ...current,
      ].slice(0, 8))

      setProjectForm(initialProject)
      await refreshProjects()
      setStatusMessage("Projeto criado com sucesso.")
    } catch {
      setStatusMessage("Nao foi possivel criar o projeto agora.")
    } finally {
      setIsSavingProject(false)
    }
  }

  async function handleCreateTask() {
    setIsSavingTask(true)
    try {
      const response = await fetch("/api/sextou-tools/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...taskForm,
          dueDate: taskForm.dueDate || null,
        }),
      })

      if (!response.ok) {
        throw new Error("task-save-failed")
      }

      await fetch("/api/sextou-tools/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug: "gerenciador-projetos-tarefas",
          input: { title: taskForm.title, status: taskForm.status },
          output: { taskCreated: true },
          metadata: { summary: `${taskForm.title} · tarefa criada` },
        }),
      })

      setLocalHistory((current) => [
        {
          title: "gerenciador projetos tarefas",
          subtitle: `${taskForm.title} · tarefa criada`,
          timestamp: new Date().toLocaleString("pt-BR"),
        },
        ...current,
      ].slice(0, 8))

      setTaskForm((current) => ({ ...initialTask, projectId: current.projectId }))
      await refreshProjects()
      setStatusMessage("Tarefa criada com sucesso.")
    } catch {
      setStatusMessage("Nao foi possivel criar a tarefa agora.")
    } finally {
      setIsSavingTask(false)
    }
  }

  async function handleTaskStatus(taskId: string, status: string) {
    const response = await fetch(`/api/sextou-tools/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      setStatusMessage("Nao foi possivel atualizar a tarefa.")
      return
    }

    await refreshProjects()
    setStatusMessage("Status da tarefa atualizado.")
  }

  const fieldClass =
    "h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-[#F0EDE6] outline-none transition placeholder:text-[#5A5755] focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20"
  const labelClass = "mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09D97]"

  return (
    <div className="grid gap-6 lg:grid-cols-[1.12fr_minmax(0,0.88fr)]">
      <section className="space-y-6">
        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Novo projeto</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Nome</label>
              <input className={fieldClass} value={projectForm.name} onChange={(event) => setProjectForm((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Prazo</label>
              <input type="date" className={fieldClass} value={projectForm.dueDate} onChange={(event) => setProjectForm((current) => ({ ...current, dueDate: event.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select className={fieldClass} value={projectForm.status} onChange={(event) => setProjectForm((current) => ({ ...current, status: event.target.value }))}>
                <option value="PLANNING">Planning</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="ON_HOLD">On hold</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Prioridade</label>
              <select className={fieldClass} value={projectForm.priority} onChange={(event) => setProjectForm((current) => ({ ...current, priority: event.target.value }))}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Descricao</label>
              <textarea className="min-h-24 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F0EDE6] outline-none transition focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20" value={projectForm.description} onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))} />
            </div>
          </div>
          <button type="button" onClick={handleCreateProject} disabled={isSavingProject} className="mt-6 inline-flex h-[54px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#FF3D57_0%,#FF8C00_100%)] px-6 text-sm font-bold text-white shadow-[0_8px_40px_rgba(255,61,87,0.28)] transition hover:brightness-105 disabled:opacity-60">
            {isSavingProject ? "Salvando..." : "Criar projeto"}
          </button>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Nova tarefa</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className={labelClass}>Projeto</label>
              <select className={fieldClass} value={taskForm.projectId} onChange={(event) => setTaskForm((current) => ({ ...current, projectId: event.target.value }))}>
                <option value="">Selecione um projeto</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Titulo</label>
              <input className={fieldClass} value={taskForm.title} onChange={(event) => setTaskForm((current) => ({ ...current, title: event.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Responsavel</label>
              <input className={fieldClass} value={taskForm.assigneeName} onChange={(event) => setTaskForm((current) => ({ ...current, assigneeName: event.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select className={fieldClass} value={taskForm.status} onChange={(event) => setTaskForm((current) => ({ ...current, status: event.target.value }))}>
                <option value="TODO">To do</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Prioridade</label>
              <select className={fieldClass} value={taskForm.priority} onChange={(event) => setTaskForm((current) => ({ ...current, priority: event.target.value }))}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Prazo</label>
              <input type="date" className={fieldClass} value={taskForm.dueDate} onChange={(event) => setTaskForm((current) => ({ ...current, dueDate: event.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Descricao</label>
              <textarea className="min-h-24 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F0EDE6] outline-none transition focus:border-[#FF3D57] focus:ring-2 focus:ring-[#FF3D57]/20" value={taskForm.description} onChange={(event) => setTaskForm((current) => ({ ...current, description: event.target.value }))} />
            </div>
          </div>
          <button type="button" onClick={handleCreateTask} disabled={isSavingTask || !taskForm.projectId} className="mt-6 inline-flex h-[54px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#FF3D57_0%,#FF8C00_100%)] px-6 text-sm font-bold text-white shadow-[0_8px_40px_rgba(255,61,87,0.28)] transition hover:brightness-105 disabled:opacity-60">
            {isSavingTask ? "Salvando..." : "Criar tarefa"}
          </button>
          <p className="mt-4 rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#A09D97]">{statusMessage}</p>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Visao geral</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">Projetos</p><p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{overview.totalProjects}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">Tarefas</p><p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{overview.totalTasks}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#A09D97]">Concluidas</p><p className="mt-2 font-toolkit text-3xl font-extrabold text-[#F0EDE6]">{overview.completedTasks}</p></div>
            <div className="rounded-2xl border border-[#FF3D57]/20 bg-[linear-gradient(135deg,rgba(255,61,87,0.16),rgba(255,140,0,0.16))] p-4"><p className="text-xs uppercase tracking-[0.12em] text-[#FF3D57]">Em execucao</p><p className="mt-2 font-toolkit text-4xl font-extrabold text-white">{overview.inProgressProjects}</p></div>
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Projetos ativos</p>
          <div className="mt-4 space-y-4">
            {projects.length === 0 ? (
              <p className="text-sm text-[#A09D97]">Nenhum projeto criado ainda.</p>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#F0EDE6]">{project.name}</p>
                      <p className="text-sm text-[#A09D97]">{project.status} · {project.priority}</p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#F0EDE6]">{project.progress}%</span>
                  </div>
                  <p className="mt-2 text-sm text-[#A09D97]">{project.description || "Sem descricao."}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[#A09D97]">Prazo: {formatDate(project.dueDate)}</p>
                  <div className="mt-3 space-y-2">
                    {project.tasks.length === 0 ? (
                      <p className="text-sm text-[#A09D97]">Sem tarefas.</p>
                    ) : (
                      project.tasks.map((task) => (
                        <div key={task.id} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-[#F0EDE6]">{task.title}</p>
                              <p className="text-xs text-[#A09D97]">{task.priority} · {task.assigneeName || "Sem responsavel"}</p>
                            </div>
                            <select className="rounded-xl border border-white/10 bg-[#171717] px-3 py-2 text-xs text-[#F0EDE6]" value={task.status} onChange={(event) => void handleTaskStatus(task.id, event.target.value)}>
                              <option value="TODO">To do</option>
                              <option value="IN_PROGRESS">In progress</option>
                              <option value="DONE">Done</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#171717] p-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#5A5755]">Historico recente</p>
          <div className="mt-4">
            <HistoryList items={localHistory} />
          </div>
        </div>
      </aside>
    </div>
  )
}
