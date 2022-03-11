const express = require('express');
const { validateAction } = require('./actions-middlware')

const Actions = require('./actions-model')

const router = express.Router();


router.get('/', (req, res, next) => {
    Actions.get()
    .then(actions => {
        if (!actions) {
            res.status(404).json([])
        } else {
            res.json(actions)
        }
    })
    .catch(next)
});

router.get('/:id', (req, res, next) => {
    Actions.get(req.params.id)
    .then(action => {
        if (!action) {
            res.status(404).json({
                message: "no action matches given id"
            })
            } else {
                return res.json(action)
            }
        })
    .catch(next)
});

router.post('/', validateAction, (req, res, next) => {
    Actions.insert({ notes: req.notes, description: req.description, project_id: req.project_id })
    .then(({id}) => {
        return Actions.get(id)
    })
    .then(action => {
        res.status(201).json(action)
    })
    .catch(next)
    });

router.put('/:id', validateAction, (req, res, next) => {
    Actions.update({ notes: req.notes, description: req.description, project_id: req.project_id })
    .then(({id}) => {
        return Actions.get(id)
    })
    .then(action => {
        res.status(201).json(action)
    })
    .catch(next)
})

router.delete('/:id', (req, res, next) => {
    Actions.remove(req.params.id)
    .then(action => {
        if (!action) {
            res.status(404).json()
        } else {
            return res.json(action)
        }
    })
    .catch(next)
});


router.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message
    })
})

module.exports = router
