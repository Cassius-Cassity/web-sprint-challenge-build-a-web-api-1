const Projects = require('./projects-model')

function validateProject(req, res, next) {
    const { name, description, completed } = req.body
    if ( !name || !description || !completed ) {
        res.status(400).json({
            message: "Please provide name and description for the user"
        })
    } else {
        req.name = name,
        req.description = description,
        req.completed = completed
        next()
    }
}

async function validateProjectId(req, res, next) {
    try {
        const project = await Projects.get(req.params.id)
        if (!project) {
            next({ status: 404, message: 'project not found'})
        } else {
            next()
        }
    } catch (err) {
        res.status(500).json({
            message: 'could not find project',
        })
    }
}

module.exports = {
    validateProject,
    validateProjectId
}