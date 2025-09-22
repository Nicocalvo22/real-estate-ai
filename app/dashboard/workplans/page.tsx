"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList, CheckCircle, Clock, Play, Check, AlertCircle, Calendar, ExternalLink, Trash2, Edit3, Plus, X, Save, RotateCcw, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface WorkPlanTask {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  dueDate?: string
}

interface WorkPlan {
  id: string
  name: string
  description: string
  properties: Array<{
    number: number
    title: string
    url: string
  }>
  tasks: WorkPlanTask[]
  createdAt: string
  completedAt?: string
  status: 'active' | 'completed'
}

export default function WorkPlansPage() {
  const [workPlans, setWorkPlans] = useState<WorkPlan[]>([])
  const [activeTab, setActiveTab] = useState("active")
  const [selectedPlan, setSelectedPlan] = useState<WorkPlan | null>(null)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [editingPlanName, setEditingPlanName] = useState(false)
  const [editPlanName, setEditPlanName] = useState("")
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editTaskTitle, setEditTaskTitle] = useState("")
  const [editTaskDescription, setEditTaskDescription] = useState("")
  const [showDeletePlanDialog, setShowDeletePlanDialog] = useState(false)
  const [showDeleteCompletedDialog, setShowDeleteCompletedDialog] = useState<string | null>(null)
  const [showPlanDetailsModal, setShowPlanDetailsModal] = useState<WorkPlan | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Load work plans from localStorage
    const saved = localStorage.getItem('workPlans')
    if (saved) {
      setWorkPlans(JSON.parse(saved))
    }
  }, [])

  const saveWorkPlans = (plans: WorkPlan[]) => {
    setWorkPlans(plans)
    localStorage.setItem('workPlans', JSON.stringify(plans))
  }

  const updateTaskStatus = (planId: string, taskId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    const updatedPlans = workPlans.map(plan => {
      if (plan.id === planId) {
        const updatedTasks = plan.tasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )

        // Check if all tasks are completed
        const allCompleted = updatedTasks.every(task => task.status === 'completed')

        return {
          ...plan,
          tasks: updatedTasks,
          ...(allCompleted && plan.status === 'active' ? {
            status: 'completed' as const,
            completedAt: new Date().toISOString()
          } : {})
        }
      }
      return plan
    })

    // Check if plan was just completed
    const planJustCompleted = updatedPlans.find(plan =>
      plan.id === planId &&
      plan.status === 'completed' &&
      !workPlans.find(p => p.id === planId)?.completedAt
    )

    if (planJustCompleted) {
      setShowCompleteModal(true)
      setSelectedPlan(planJustCompleted)
    }

    saveWorkPlans(updatedPlans)
  }

  const getActivePlan = () => workPlans.find(plan => plan.status === 'active')
  const getCompletedPlans = () => workPlans.filter(plan => plan.status === 'completed')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress':
        return <Play className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700'
      case 'in_progress':
        return 'bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }
  }

  // New management functions
  const deletePlan = (planId: string) => {
    const updatedPlans = workPlans.filter(plan => plan.id !== planId)
    saveWorkPlans(updatedPlans)
    setShowDeletePlanDialog(false)
    toast({
      title: "Plan Eliminado",
      description: "El plan de trabajo ha sido eliminado exitosamente.",
    })
  }

  const deleteCompletedPlan = (planId: string) => {
    const updatedPlans = workPlans.filter(plan => plan.id !== planId)
    saveWorkPlans(updatedPlans)
    setShowDeleteCompletedDialog(null)
    toast({
      title: "Plan Completado Eliminado",
      description: "El plan completado ha sido eliminado permanentemente.",
    })
  }

  const updatePlanName = (planId: string, newName: string) => {
    if (!newName.trim()) return

    const updatedPlans = workPlans.map(plan =>
      plan.id === planId ? { ...plan, name: newName.trim() } : plan
    )
    saveWorkPlans(updatedPlans)
    setEditingPlanName(false)
    setEditPlanName("")
    toast({
      title: "Nombre Actualizado",
      description: "El nombre del plan ha sido actualizado exitosamente.",
    })
  }

  const addTask = (planId: string) => {
    if (!newTaskTitle.trim() || !newTaskDescription.trim()) {
      toast({
        title: "Campos Requeridos",
        description: "Por favor completa el título y la descripción de la tarea.",
        variant: "destructive",
      })
      return
    }

    const newTask: WorkPlanTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      status: 'pending',
    }

    const updatedPlans = workPlans.map(plan =>
      plan.id === planId
        ? { ...plan, tasks: [...plan.tasks, newTask] }
        : plan
    )

    saveWorkPlans(updatedPlans)
    setShowAddTaskDialog(false)
    setNewTaskTitle("")
    setNewTaskDescription("")
    toast({
      title: "Tarea Agregada",
      description: "La nueva tarea ha sido agregada exitosamente.",
    })
  }

  const updateTask = (planId: string, taskId: string) => {
    if (!editTaskTitle.trim() || !editTaskDescription.trim()) {
      toast({
        title: "Campos Requeridos",
        description: "Por favor completa el título y la descripción de la tarea.",
        variant: "destructive",
      })
      return
    }

    const updatedPlans = workPlans.map(plan =>
      plan.id === planId
        ? {
            ...plan,
            tasks: plan.tasks.map(task =>
              task.id === taskId
                ? { ...task, title: editTaskTitle.trim(), description: editTaskDescription.trim() }
                : task
            )
          }
        : plan
    )

    saveWorkPlans(updatedPlans)
    setEditingTask(null)
    setEditTaskTitle("")
    setEditTaskDescription("")
    toast({
      title: "Tarea Actualizada",
      description: "La tarea ha sido actualizada exitosamente.",
    })
  }

  const deleteTask = (planId: string, taskId: string) => {
    const updatedPlans = workPlans.map(plan =>
      plan.id === planId
        ? { ...plan, tasks: plan.tasks.filter(task => task.id !== taskId) }
        : plan
    )
    saveWorkPlans(updatedPlans)
    toast({
      title: "Tarea Eliminada",
      description: "La tarea ha sido eliminada exitosamente.",
    })
  }

  const activePlan = getActivePlan()
  const completedPlans = getCompletedPlans()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planes de Trabajo</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tus planes de trabajo para análisis de propiedades
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {activePlan ? '1 activo' : '0 activos'}
          </Badge>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {completedPlans.length} completados
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Plan Activo
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completados ({completedPlans.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Plan Tab */}
        <TabsContent value="active" className="space-y-6">
          {!activePlan ? (
            <Card className="text-center py-12">
              <CardContent>
                <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No tienes un plan activo</h3>
                <p className="text-gray-500 mb-6">
                  Crea un Plan de Trabajo desde Findy AI o desde tus propiedades guardadas.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild className="bg-gradient-to-r from-findy-fuchsia to-findy-magenta text-white">
                    <a href="/dashboard/chat">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Crear desde Findy AI
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="/dashboard/saved">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Crear desde Guardados
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Plan Header */}
              <Card className="bg-gradient-to-r from-findy-electric/10 to-findy-skyblue/10 border-findy-electric/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-3 text-xl text-gray-900 dark:text-gray-100">
                        <div className="w-10 h-10 bg-findy-electric rounded-full flex items-center justify-center">
                          <ClipboardList className="h-5 w-5 text-white" />
                        </div>
                        {editingPlanName ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editPlanName}
                              onChange={(e) => setEditPlanName(e.target.value)}
                              className="text-xl font-bold text-gray-900 dark:text-gray-100"
                              autoFocus
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  updatePlanName(activePlan.id, editPlanName)
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => updatePlanName(activePlan.id, editPlanName)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingPlanName(false)
                                setEditPlanName("")
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{activePlan.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingPlanName(true)
                                setEditPlanName(activePlan.name)
                              }}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </CardTitle>
                      <p className="text-gray-700 dark:text-gray-300 mt-2">{activePlan.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Creado: {formatDate(activePlan.createdAt)}
                        </span>
                        <span>{activePlan.properties.length} propiedades</span>
                        <span>{activePlan.tasks.length} tareas</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddTaskDialog(true)}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Agregar Tarea
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDeletePlanDialog(true)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar Plan
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Properties */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Propiedades del Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activePlan.properties.map((property, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="w-8 h-8 bg-findy-electric rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{property.number}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{property.title}</p>
                        </div>
                        <a
                          href={property.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-findy-electric hover:text-findy-skyblue"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tasks - To Do List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pending Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Clock className="h-4 w-4 text-gray-500" />
                      Por Hacer
                      <Badge variant="secondary">
                        {activePlan.tasks.filter(t => t.status === 'pending').length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {activePlan.tasks.filter(task => task.status === 'pending').map((task) => (
                      <div key={task.id} className={`p-3 rounded-lg border-2 ${getTaskStatusColor(task.status)}`}>
                        {editingTask === task.id ? (
                          <div className="space-y-3">
                            <Input
                              value={editTaskTitle}
                              onChange={(e) => setEditTaskTitle(e.target.value)}
                              placeholder="Título de la tarea"
                              className="font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            />
                            <Textarea
                              value={editTaskDescription}
                              onChange={(e) => setEditTaskDescription(e.target.value)}
                              placeholder="Descripción de la tarea"
                              className="text-xs text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateTask(activePlan.id, task.id)}
                                className="text-xs"
                              >
                                <Save className="h-3 w-3 mr-1" />
                                Guardar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingTask(null)
                                  setEditTaskTitle("")
                                  setEditTaskDescription("")
                                }}
                                className="text-xs"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            {getTaskStatusIcon(task.status)}
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{task.title}</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                              <div className="flex gap-1 mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateTaskStatus(activePlan.id, task.id, 'in_progress')}
                                  className="text-xs"
                                >
                                  Comenzar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingTask(task.id)
                                    setEditTaskTitle(task.title)
                                    setEditTaskDescription(task.description)
                                  }}
                                  className="text-xs p-2"
                                >
                                  <Edit3 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteTask(activePlan.id, task.id)}
                                  className="text-xs p-2 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* In Progress Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Play className="h-4 w-4 text-blue-600" />
                      En Proceso
                      <Badge variant="secondary">
                        {activePlan.tasks.filter(t => t.status === 'in_progress').length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {activePlan.tasks.filter(task => task.status === 'in_progress').map((task) => (
                      <div key={task.id} className={`p-3 rounded-lg border-2 ${getTaskStatusColor(task.status)}`}>
                        {editingTask === task.id ? (
                          <div className="space-y-3">
                            <Input
                              value={editTaskTitle}
                              onChange={(e) => setEditTaskTitle(e.target.value)}
                              placeholder="Título de la tarea"
                              className="font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            />
                            <Textarea
                              value={editTaskDescription}
                              onChange={(e) => setEditTaskDescription(e.target.value)}
                              placeholder="Descripción de la tarea"
                              className="text-xs text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateTask(activePlan.id, task.id)}
                                className="text-xs"
                              >
                                <Save className="h-3 w-3 mr-1" />
                                Guardar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingTask(null)
                                  setEditTaskTitle("")
                                  setEditTaskDescription("")
                                }}
                                className="text-xs"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            {getTaskStatusIcon(task.status)}
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{task.title}</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                              <div className="flex gap-1 mt-2">
                                <Button
                                  size="sm"
                                  onClick={() => updateTaskStatus(activePlan.id, task.id, 'completed')}
                                  className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                >
                                  Completar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateTaskStatus(activePlan.id, task.id, 'pending')}
                                  className="text-xs"
                                >
                                  Pausar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingTask(task.id)
                                    setEditTaskTitle(task.title)
                                    setEditTaskDescription(task.description)
                                  }}
                                  className="text-xs p-2"
                                >
                                  <Edit3 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteTask(activePlan.id, task.id)}
                                  className="text-xs p-2 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Completed Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Completadas
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {activePlan.tasks.filter(t => t.status === 'completed').length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {activePlan.tasks.filter(task => task.status === 'completed').map((task) => (
                      <div key={task.id} className={`p-3 rounded-lg border-2 ${getTaskStatusColor(task.status)}`}>
                        <div className="flex items-start gap-2">
                          {getTaskStatusIcon(task.status)}
                          <div className="flex-1">
                            <h4 className="font-medium text-sm line-through text-gray-500 dark:text-gray-400">{task.title}</h4>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{task.description}</p>
                            <div className="flex gap-1 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateTaskStatus(activePlan.id, task.id, 'in_progress')}
                                className="text-xs"
                                title="Volver a En Proceso"
                              >
                                <RotateCcw className="h-3 w-3 mr-1" />
                                Reabrir
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Completed Plans Tab */}
        <TabsContent value="completed" className="space-y-6">
          {completedPlans.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No tienes planes completados</h3>
                <p className="text-gray-500">
                  Los planes completados aparecerán aquí una vez que termines todas las tareas.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedPlans.map((plan) => (
                <Card key={plan.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      {plan.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <div>Completado: {formatDate(plan.completedAt!)}</div>
                      <div>{plan.properties.length} propiedades • {plan.tasks.length} tareas</div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Propiedades:</h4>
                      {plan.properties.slice(0, 2).map((property, index) => (
                        <div key={index} className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded flex items-center justify-between">
                          <span className="text-gray-900 dark:text-gray-100">{property.title.substring(0, 40)}...</span>
                          <a
                            href={property.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-findy-electric hover:text-findy-skyblue"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      ))}
                      {plan.properties.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{plan.properties.length - 2} propiedades más
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPlanDetailsModal(plan)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                      {/* Future ACM button - placeholder */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        disabled
                      >
                        Realizar ACM (Próximamente)
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDeleteCompletedDialog(plan.id)}
                        className="px-3"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Completion Modal */}
      <Dialog open={showCompleteModal} onOpenChange={setShowCompleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              ¡Plan de Trabajo Completado!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-lg font-medium">
              Has completado exitosamente el plan "{selectedPlan?.name}"
            </p>
            <p className="text-gray-600">
              El plan ha sido guardado en la sección de Completados donde podrás acceder a él cuando lo necesites.
            </p>
            <Button
              onClick={() => {
                setShowCompleteModal(false)
                setActiveTab('completed')
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white"
            >
              Ver Planes Completados
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-findy-electric" />
              Agregar Nueva Tarea
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="taskTitle" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Título de la tarea
              </label>
              <Input
                id="taskTitle"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Ej: Revisar documentos de propiedad"
                className="w-full text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="taskDescription" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Descripción
              </label>
              <Textarea
                id="taskDescription"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Describe los detalles de esta tarea..."
                className="w-full text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddTaskDialog(false)
                  setNewTaskTitle("")
                  setNewTaskDescription("")
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => activePlan && addTask(activePlan.id)}
                disabled={!newTaskTitle.trim() || !newTaskDescription.trim()}
                className="bg-gradient-to-r from-findy-electric to-findy-skyblue text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Tarea
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Plan Dialog */}
      <Dialog open={showDeletePlanDialog} onOpenChange={setShowDeletePlanDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Eliminar Plan de Trabajo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Estás seguro de que quieres eliminar este plan de trabajo? Esta acción no se puede deshacer.
            </p>
            {activePlan && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {activePlan.name}
                </p>
                <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                  {activePlan.tasks.length} tareas • {activePlan.properties.length} propiedades
                </p>
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeletePlanDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => activePlan && deletePlan(activePlan.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Plan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Completed Plan Dialog */}
      <Dialog open={!!showDeleteCompletedDialog} onOpenChange={() => setShowDeleteCompletedDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Eliminar Plan Completado
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
                    ⚠️ Advertencia Importante
                  </h4>
                  <ul className="text-xs text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
                    <li>No podrás realizar el <strong>ACM (Análisis Comparativo de Mercado)</strong> de este plan más tarde</li>
                    <li>Esta acción es <strong>irreversible</strong> y no podrás recuperar el plan</li>
                    <li>Perderás todo el historial de tareas completadas y análisis realizados</li>
                  </ul>
                </div>
              </div>
            </div>

            {showDeleteCompletedDialog && (
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {workPlans.find(p => p.id === showDeleteCompletedDialog)?.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {workPlans.find(p => p.id === showDeleteCompletedDialog)?.tasks.length} tareas • {workPlans.find(p => p.id === showDeleteCompletedDialog)?.properties.length} propiedades
                </p>
              </div>
            )}

            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Estás seguro de que quieres eliminar permanentemente este plan completado?
            </p>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteCompletedDialog(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => showDeleteCompletedDialog && deleteCompletedPlan(showDeleteCompletedDialog)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Permanentemente
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Plan Details Modal */}
      <Dialog open={!!showPlanDetailsModal} onOpenChange={() => setShowPlanDetailsModal(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
              {showPlanDetailsModal?.name}
            </DialogTitle>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Completado el {showPlanDetailsModal?.completedAt && formatDate(showPlanDetailsModal.completedAt)}
            </div>
          </DialogHeader>

          {showPlanDetailsModal && (
            <div className="space-y-6">
              {/* Plan Overview */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">📊 Resumen del Plan</h3>
                <p className="text-sm text-green-700 dark:text-green-300 mb-3">{showPlanDetailsModal.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-green-700 dark:text-green-300">Creado: {formatDate(showPlanDetailsModal.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-700 dark:text-green-300">Completado: {formatDate(showPlanDetailsModal.completedAt!)}</span>
                  </div>
                </div>
              </div>

              {/* Properties Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">🏠 Propiedades Analizadas</h3>
                  <Badge variant="outline" className="bg-findy-electric/10 text-findy-electric border-findy-electric">
                    {showPlanDetailsModal.properties.length} propiedades
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {showPlanDetailsModal.properties.map((property, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-findy-electric rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">{property.number}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                              {property.title}
                            </h4>
                            <a
                              href={property.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-findy-electric hover:text-findy-skyblue transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Ver en ZonaProp
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Tasks Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">✅ Tareas Completadas</h3>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    {showPlanDetailsModal.tasks.length} tareas
                  </Badge>
                </div>

                <div className="space-y-3">
                  {showPlanDetailsModal.tasks.map((task, index) => (
                    <Card key={task.id} className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm text-green-900 dark:text-green-100 mb-1">
                                  {task.title}
                                </h4>
                                <p className="text-xs text-green-700 dark:text-green-300 mb-2">
                                  {task.description}
                                </p>
                              </div>
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 text-xs">
                                #{index + 1}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowPlanDetailsModal(null)}
                  className="flex-1"
                >
                  Cerrar
                </Button>
                <Button
                  variant="outline"
                  disabled
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Exportar Reporte (Próximamente)
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}