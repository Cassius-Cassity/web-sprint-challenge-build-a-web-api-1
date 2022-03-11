const express = require('express');
const { validateProject, validateProjectId } = require('./projects-middleware');

const Projects = require('./projects-model');

const router = express.Router();

router.get('/', (req, res, next) => {
    Projects.get()
    .then(projects => {
        if(!projects) {
            res.status(404).json([])
        } else {
            return res.json(projects)
        }
    })
    .catch(next)
});

router.get('/:id', (req, res, next) => {
    Projects.get(req.params.id)
    .then(project => {
        if (!project) {
            res.status(404).json({
                message: "no project matches given id"
            })
            } else {
                return res.json(project)
            }
        })
    .catch(next)
});

router.post('/', validateProject, (req, res, next) => {
    Projects.insert({ name: req.name, description: req.description, completed: req.completed })
    .then(({id}) => {
        return Projects.get(id)
    })
    .then(project => {
        res.status(201).json(project)
    })
    .catch(next)
    });

router.put('/:id', validateProjectId, validateProject, (req, res, next) => {
   Projects.update(req.params.id, { name: req.name, description: req.description, completed: req.completed})
    .then(() => {
        return Projects.get(req.params.id)
    })
    .then(project => {
        res.json(project)
    })
    .catch(next)
});

router.delete('/:id', (req, res, next) => {
    Projects.remove(req.params.id)
    .then(project => {
        if (!project) {
            res.status(404).json()
        } else {
            return res.json(project)
        }
    })
    .catch(next)
});

router.get('/:id/actions', async (req, res, next) => {
    try {
        const actions = await Projects.getProjectActions(req.params.id)
        if(!actions) {
            res.json([])
        } else {
            res.json(actions)
        }
    } catch (err) {
        next(err)
    }
});

router.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message
    })
})


module.exports = router
