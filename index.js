const express = require('express')

const server = express()

const projects = [
  {
    id: 1,
    title: 'Creating an Android App',
    tasks: [
      'User Interface', 'Domain', 'Tests'
    ]
  },
  {
    id: 2,
    title: 'Creating an API with NodeJs',
    tasks: [
      'Entities', 'Services', 'Repositories'
    ]
  }
]

server.use(express.json())

const validateProjectId = (req, res, next) => {
  const { id } = req.params
  const project = projects.find(project => project.id == id)

  if (!project) {
    return res.status(404).json({ error: `Project ${id} not found` })
  }
  return next()
}

const setProjectByIdMiddleware = (req, res, next) => {
  const { id } = req.params
  const project = projects.find(project => project.id == id)
  req.params.project = project
  next()
}

let requestsCounter = 0

server.use((req, res, next) => {
  requestsCounter++
  console.log(`requests amount: ${requestsCounter}`)
  return next()
})


server.get('/projects', (req, res) => {
  return res.json(projects)
})

server.get('/projects/:id', validateProjectId, setProjectByIdMiddleware, (req, res) => {
  const { project } = req.params
  return res.json(project)
})

server.post('/projects', (req, res) => {
  const { id, title } = req.body

  projects.push({ id, title, tasks: [] })
  return res.status(201).send()
})

server.put('/projects/:id', validateProjectId, setProjectByIdMiddleware, (req, res) => {
  const { title } = req.body

  const { project } = req.params
  project.title = title

  return res.status(204).send()

})

server.delete('/projects/:id', validateProjectId, setProjectByIdMiddleware, (req, res) => {

  const { project } = req.params

  const index = projects.indexOf(project)
  projects.splice(index, 1)

  return res.status(204).send()
})

server.post('/projects/:id/tasks', validateProjectId, setProjectByIdMiddleware, (req, res) => {
  const { title: task } = req.body
  const { project } = req.params
  project.tasks.push(task)
  return res.status(201).json(project)
})

server.listen(3000)