const Actions = require('./actions-model')

function validateAction(req, res, next) {
    const { notes, description, project_id } = req.body
    if ( !notes || !description || !project_id ) {
        res.status(400).json({
            message: "Please provide notes and description for the action"
        })
    } else {
        req.notes = notes,
        req.description = description,
        req.project_id = project_id
        next()
    }
}

module.exports = {validateAction}
